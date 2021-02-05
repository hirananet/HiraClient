import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { IRCoreService } from 'src/app/IRCore/IRCore.service';
import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelData, GenericMessage, Quote } from 'src/app/IRCore/services/ChannelData';
import { ChannelsService } from 'src/app/IRCore/services/channels.service';
import { MenuSelectorEvent, MenuType } from 'src/app/sections/menu/menu-selector.event';
import { HistoryMessageCursorService } from '../utils/history-message-cursor.service';
import { InfoPanelComponent } from 'src/app/sections/chat-parts/info-panel/info-panel.component';
import { VcardGetterService } from 'src/app/sections/chat-parts/message-item/link-vcard/vcard-getter.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  image: string = undefined;
  public message: string = '';

  private channelName: string;
  public channel: ChannelData = new ChannelData();
  private routeSubscription: Subscription;
  public preventOnScroll: boolean;
  public autoDownLocked: boolean;
  public newMessages: boolean;
  public messageSubscription: Subscription;
  public quote: Quote;
  public altMenu: boolean;
  public imageLoading: boolean;
  public emotePopupOpened: boolean;
  public timmer_whox: any;

  @ViewChild('infoPanel', {static: true}) appInfoPanel: InfoPanelComponent;

  constructor(
      private router: Router,
      route: ActivatedRoute,
      private chanSrv: ChannelsService,
      private ircSrv: IRCoreService,
      private vcg: VcardGetterService,
      private hmcSrv: HistoryMessageCursorService,
      private titleSrv: Title
  ) {
    this.routeSubscription = this.router.events.subscribe(d => {
      if(this.channelName != route.snapshot.params.channel) {
        this.channelName = route.snapshot.params.channel;
        this.ngOnInit();
      }
    });
    this.timmer_whox = setInterval(() => {
      this.sendWHOX();
    }, environment.intervalWHOX);
  }

  goDown() {
    console.log('GoDown');
    const elem = document.getElementById('listMessages');
    this.autoDownLocked = false;
    this.newMessages = false;
    setTimeout(() => {
      this.preventOnScroll = true;
      elem.scrollTo({top: elem.scrollHeight});
      setTimeout(() => {
        this.preventOnScroll = false;
      }, 50);
    }, 100);
  }

  autoGoDown() {
    if(this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.messageSubscription = this.chanSrv.messagesReceived.subscribe(d => {
      if(d.target === this.channelName) {
        this.newMessages = false;
        console.log('NM', this.autoDownLocked);
        if(this.autoDownLocked) {
          this.newMessages = true;
          return;
        }
        this.goDown();
      }
    });
  }

  writeEmote(emote: string) {
    this.message += ' ' + emote;
    this.emotePopupOpened = false;
  }

  onScroll(evt) {
    if(this.preventOnScroll) {
      return;
    }
    this.autoDownLocked = evt.srcElement.scrollTop + evt.srcElement.clientHeight != evt.srcElement.scrollHeight;
    console.log('on scroll', this.autoDownLocked, evt.srcElement.scrollTop + evt.srcElement.clientHeight, evt.srcElement.scrollHeight);
    if(!this.autoDownLocked) {
      this.newMessages = false;
    }
  }

  ngOnInit(): void {
    if(this.channelName) {
      this.channel = this.chanSrv.getChannel(this.channelName);
      this.titleSrv.setTitle('#' + this.channelName + ' | HiraClient');
      if(!this.channel.messages || this.channel.messages.length == 0) {
        const msg = this.chanSrv.getHistory(this.channelName);
        if(msg) {
          msg.forEach(m => {
            this.channel.messages.push(m);
          });
        }
      }
      // FIXME: mover a guard:
      MenuSelectorEvent.menuChange.emit({
        type: MenuType.CHANNEL,
        name: this.channelName
      });
      this.sendWHOX();
      this.goDown();
    } else if(this.chanSrv.getChannels().length > 0) {
      this.router.navigateByUrl('/chat/' + this.chanSrv.getChannels()[0].name);
    } else {
      this.ircSrv.join('main');
    }
    document.getElementById('messageInput').focus();
    this.appInfoPanel.recalcUsers(this.channel.users);
    this.autoGoDown();
  }

  sendWHOX() {
    this.ircSrv.sendWhox(this.channelName);
  }

  quotear(q: Quote) {
    this.quote = q;
    document.getElementById('messageInput').focus();
  }

  kp(event) {
    if(event.keyCode === 13) {
      this.send();
    }
  }

  kd(event) {
    // tabulador
    if(event.keyCode == 9) {
      event.stopPropagation();
      event.preventDefault();
      const curPos = event.target.selectionStart;
      const partial = this.message.substr(0, curPos).split(' ');
      const search = partial[partial.length-1];
      const user = this.channel.users.find(user => user.nick.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) == 0);
      const startPos = curPos - search.length;
      this.message = this.message.substr(0, startPos) + user.nick + this.message.substr(curPos) + ' ';
    }
    if(event.keyCode == 38) { // arrow up
      this.message = this.hmcSrv.prev();
    }
    if(event.keyCode == 40) { // arrow down
      this.message = this.hmcSrv.next();
    }
  }

  send() {
    if(this.message?.trim().length == 0) {
      return;
    }
    if(this.quote) {
      this.message = '<'+this.quote.author+'> '+this.quote.quote+' |' + this.message;
      this.quote = undefined;
    }
    this.hmcSrv.save(this.message);
    this.ircSrv.sendMessageOrCommand(this.message, '#'+this.channelName);
    this.message = '';
    document.getElementById('messageInput').focus();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    clearInterval(this.timmer_whox);
  }

  copyChat(evt) {
    // evt.stopPropagation();
    let chat = '';
    this.channel.messages.forEach((msg: GenericMessage) => {
      chat += msg.date + ' <' + msg.author.user + '> ' + msg.message + '\r\n';
    });
    navigator.clipboard.writeText(chat).then(d => {

    });
  }

  copyLinkChat(evt) {
    const url = window.location.protocol + '//' + window.location.host + '/user#chat=' + this.channelName;
    navigator.clipboard.writeText(url).then(d => {

    });
  }

  onFileSelected(event) {
    this.uploadFile(event.srcElement.files[0]);
  }

  uploadFile(file) {
    const fr = new FileReader();
    fr.onloadend = () => {
      this.vcg.uploadImage((fr.result as string).split('base64,')[1]).subscribe(d => {
        const cboxI = (document.getElementById('messageInput') as any);
        if (cboxI.value.length > 0) {
          cboxI.value = (document.getElementById('messageInput') as any).value.trim() + ' ';
        }
        cboxI.value += d.image;
        cboxI.focus();
        this.imageLoading = false;
      }, err => {
        this.imageLoading = false;
      });
    };
    if (file) {
      this.imageLoading = true;
      fr.readAsDataURL(file);
    }
  }

  openFile() {
    document.getElementById('fileInput').click();
  }

  onDrop(event) {
    const file = event.dataTransfer.files[0];
    if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
      this.uploadFile(file);
    }
    event.preventDefault();
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }
}
