import { RockolaData, RockolaService } from 'src/app/rockola/rockola.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuSelectorEvent, MenuType } from 'src/app/sections/menu/menu-selector.event';
import { HistoryMessageCursorService } from '../../utils/history-message-cursor.service';
import { InfoPanelComponent } from 'src/app/sections/chat-parts/info-panel/info-panel.component';
import { VcardGetterService } from 'src/app/sections/chat-parts/message-item/link-vcard/vcard-getter.service';
import { Title } from '@angular/platform-browser';
import { ChannelsService, IRCoreService, ChannelData, GenericMessage, Quote, UserInfoService } from 'ircore';
import { ResizedEvent } from 'angular-resize-event';
import { filter } from 'rxjs/operators';
import { LocalLabels } from 'src/app/utils/LocalLabels';
import { UsersService } from 'src/app/utils/users.service';
import { ElectronSrvService } from 'src/app/electron/electron-srv.service';

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

  private rockolaSubs: Subscription;
  public rockolaData: RockolaData;

  @ViewChild('infoPanel', {static: true}) appInfoPanel: InfoPanelComponent;

  constructor(
      private router: Router,
      route: ActivatedRoute,
      private chanSrv: ChannelsService,
      private ircSrv: IRCoreService,
      private vcg: VcardGetterService,
      private hmcSrv: HistoryMessageCursorService,
      private titleSrv: Title,
      private rockola: RockolaService,
      private uSrv: UsersService,
      private uInfo: UserInfoService,
      private electronSrv: ElectronSrvService
  ) {
    this.routeSubscription = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(d => {
      if(this.channelName != route.snapshot.params.channel) {
        this.channelName = route.snapshot.params.channel;
        this.ngOnInit();
      }
    });
    this.timmer_whox = setInterval(() => {
      this.sendWHOX();
    }, environment.intervalWHOX);
  }

  @HostListener('window:resize', ['$event'])
  goDown() {
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
        if(this.autoDownLocked) {
          this.newMessages = true;
          return;
        }
        this.goDown();
      }
    });
  }

  resize(event: ResizedEvent) {
    if(this.autoDownLocked) {
      return;
    }
    this.goDown();
  }

  onScroll(evt) {
    if(this.preventOnScroll) {
      return;
    }
    this.autoDownLocked = evt.srcElement.scrollTop + evt.srcElement.clientHeight != evt.srcElement.scrollHeight;
    if(!this.autoDownLocked) {
      this.newMessages = false;
    }
  }

  writeEmote(emote: string) {
    if(!this.message) {
      this.message = '';
    }
    this.message += ' ' + emote;
    this.message = this.message.trim();
    this.emotePopupOpened = false;
  }

  ngOnInit(): void {
    if(this.channelName) {
      this.channel = this.chanSrv.getChannel(this.channelName);
      this.titleSrv.setTitle('#' + this.channelName + ' | HiraClient');
      this.preventOnScroll = true;
      // FIXME: mover a guard:
      MenuSelectorEvent.menuChange.emit({
        type: MenuType.CHANNEL,
        name: this.channelName
      });
      this.sendWHOX();
      this.goDown();

      this.rockolaData = this.rockola.getList('#'+this.channelName)
    } else if(this.chanSrv.getChannels().length > 0) {
      this.router.navigateByUrl('/chat/' + this.chanSrv.getChannels()[0].name);
    } else {
      this.ircSrv.join('main');
    }
    document.getElementById('messageInput').focus();
    this.appInfoPanel.recalcUsers(this.channel.users, this.channel.name);
    this.autoGoDown();
  }

  sendWHOX() {
    this.ircSrv.sendWhox(this.channelName);
  }

  quotear(q: Quote) {
    this.quote = q;
    document.getElementById('messageInput').focus();
  }

  private multilineText: boolean;

  kp(event) {
    if(event.keyCode === 13 && !event.shiftKey) {
      this.send();
      this.multilineText = false;
    } else if(event.keyCode === 13 && event.shiftKey) {
      this.multilineText = true;
    }
  }

  ku(event) {
    if(event.keyCode === 13 && !event.shiftKey) {
      event.target.value = ''
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
      let completeString = '';
      const searchChann = (_search) => {
        completeString = this.chanSrv.getChannels().find(channel => channel.name.toLocaleLowerCase().indexOf(_search.toLocaleLowerCase()) == 0)?.name;
        return completeString ? '#' + completeString : undefined;
      };
      if(search[0] == '#') {
        completeString = searchChann(search.slice(1));
      } else {
        completeString = this.channel.users.find(user => user.nick.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) == 0)?.nick;
        if(!completeString) {
          completeString = searchChann(search);
        }
      }
      if(completeString) {
        const startPos = curPos - search.length;
        this.message = this.message.substr(0, startPos) + completeString + this.message.substr(curPos) + ' ';
      }
    }
    if(event.keyCode == 38 && !this.multilineText) { // arrow up
      this.message = this.hmcSrv.prev('chan-' + this.channelName);
    }
    if(event.keyCode == 40 && !this.multilineText) { // arrow down
      this.message = this.hmcSrv.next('chan-' + this.channelName);
    }
  }

  send() {
    if(this.message?.trim().length == 0) {
      return;
    }
    if(this.message === '/clear') {
      this.channel.messages = [];
      this.chanSrv.clearHistory(this.channelName);
    }
    if(this.quote) {
      this.message = '<'+this.quote.author+'> '+this.quote.quote+' |' + this.message;
      this.quote = undefined;
    }
    const lines = this.message.split('\n');
    lines.forEach(line => {
      this.hmcSrv.save(line, 'chan-' + this.channelName);
      this.ircSrv.sendMessageOrCommand(line, '#'+this.channelName);
    });
    this.message = '';
    document.getElementById('messageInput').focus();
  }

  public isHalfOrSuper: boolean;
  moderatedMode() {
    this.ircSrv.sendMessageOrCommand('/mode #'+ this.channelName + ' +m');
  }

  openAltMenu() {
    this.altMenu = true;
    const labels = this.uSrv.getCachedOnly(this.uInfo.getNick(), this.channelName).filter(label => label.isLocal);
    this.isHalfOrSuper =  labels.length > 0 && (
                          labels[0].name == LocalLabels.FOUNDER ||
                          labels[0].name == LocalLabels.ADMIN ||
                          labels[0].name == LocalLabels.OPER ||
                          labels[0].name == LocalLabels.HOPER
                        );
  }

  public isElectron = environment.electron;

  openLogFolder() {
    this.electronSrv.openLogsFolder();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.messageSubscription.unsubscribe();
    this.rockolaSubs?.unsubscribe();
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
    const url = environment.prodEndpoint + '/user#chat=' + this.channelName;
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
        this.ircSrv.sendMessageOrCommand(d.image, '#'+this.channelName);
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
    if(this.imageLoading) return;
    document.getElementById('fileInput').click();
  }

  onDrop(event) {
    if(this.imageLoading) return;
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

  openPlaylist() {
    this.rockola.forceOpenPLaylist(this.channelName)
  }
}
