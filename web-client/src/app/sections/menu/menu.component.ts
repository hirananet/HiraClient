import { ChannelsService, UserInfoService, IRCoreService, PrivmsgService, ValidRegex, JoinHandler, Join, ChannelData } from 'ircore';
import { MenuElement, MenuSelectorEvent, MenuType } from './menu-selector.event';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListElement } from '../list/list.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { AudioService } from 'src/app/utils/audio.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  public channels: ListElement[];
  public activeChannel: string = undefined;
  public activePrivMsg: string = undefined;

  public privMsg: ListElement[] = [];

  private joinSubscription: Subscription;

  public lastSelected: MenuElement;

  public pingsPrivate: number = 0;
  public pingsChannel: number = 0;
  public privPings: {[key:string]: number} = {};
  public chanPings: {[key:string]: number} = {};

  constructor(
    private cSrv: ChannelsService,
    private userSrv: UserInfoService,
    private router: Router,
    private ircoreSrv: IRCoreService,
    private pmsgSrv: PrivmsgService,
    private titleSrv: Title,
    private audioSrv: AudioService
  ) {
    this.joinSubscription = JoinHandler.joinResponse.subscribe((data: Join) => {
      if (data.user.nick === this.userSrv.getNick()) {
        this.router.navigateByUrl('/chat/' + data.channel.name);
      }
    });
    MenuSelectorEvent.menuChange.subscribe(d => {
      if(this.lastSelected?.type === MenuType.CHANNEL) {
        const fdn = this.channels.find(channel => channel.name == this.lastSelected.name);
        if(fdn) {
          fdn.active = false;
        }
      } else if(this.lastSelected?.type === MenuType.PRIV_MSG) {
        const fdn = this.privMsg.find(channel => channel.name == this.lastSelected.name);
        if(fdn) {
          fdn.active = false;
        }
      }
      this.lastSelected = d;
      if(this.lastSelected?.type === MenuType.CHANNEL) {
        this.channels.find(channel => channel.name == this.lastSelected.name).active = true;
        this.activeChannel = this.lastSelected.name;
        this.activePrivMsg = undefined;
        if(this.chanPings[d.name] && this.chanPings[d.name] > 0) {
          this.pingsChannel -= this.chanPings[d.name];
          this.chanPings[d.name] = 0;
        }
      } else if(this.lastSelected?.type === MenuType.PRIV_MSG) {
        this.privMsg.find(channel => channel.name == this.lastSelected.name).active = true;
        this.activePrivMsg = this.lastSelected.name;
        this.activeChannel = undefined;
        if(this.privPings[d.name] && this.privPings[d.name] > 0) {
          this.pingsPrivate -= this.privPings[d.name];
          this.privPings[d.name] = 0;
        }
      }
    });
    this.cSrv.messagesReceived.subscribe(d => {
      if(d.target !== this.activeChannel) {
        const channel = this.channels.find(channel => channel.name == d.target);
        const regex = ValidRegex.getRegex(ValidRegex.pingRegex(this.userSrv.getNick()));
        const result = regex.exec(d.message);
        if(result) {
          channel.warn = true;
          this.pingsChannel++;
          this.showPings();
          this.chanPings[d.target] = this.chanPings[d.target] ? this.chanPings[d.target]+1 : 1;
          this.audioSrv.playNotify();
        } else if(!channel.warn) {
          // ping en canal
          channel.notify = true;
        }
      }
    });
    this.pmsgSrv.messagesReceived.subscribe(d => {
      if(d.author.user !== this.activePrivMsg && d.author.user != this.userSrv.getNick()) {
        let chat = this.privMsg.find(pms => pms.name === d.author.user);
        const regex = ValidRegex.getRegex(ValidRegex.pingRegex(this.userSrv.getNick()));
        const result = regex.exec(d.message);
        if(result) {
          chat.warn = true;
        } else if(!chat.warn) {
          // ping en privado
          chat.notify = true;
        }
        this.pingsPrivate++;
        this.showPings();
        this.privPings[d.author.user] = this.privPings[d.author.user] ? this.privPings[d.author.user]+1 : 1;
        this.audioSrv.playNotify();
      }
    });
  }

  showPings() {
    const chanLabels = this.pingsChannel > 0 ? '#(' + this.pingsChannel + ') ' : '';
    const privLabels = this.pingsPrivate > 0 ? '@(' + this.pingsPrivate + ') ' : '';

    if(this.pingsChannel > 0 || this.pingsPrivate > 0) {
      this.titleSrv.setTitle(chanLabels + privLabels + '| HiraClient');
    }
  }

  closeChannel(elem: ListElement) {
    this.ircoreSrv.sendMessageOrCommand('/leave #' + elem.name);
  }

  ngOnInit(): void {
    this.cSrv.listChanged.subscribe((d: ChannelData[]) => {
      // validamos la lista
      this.channels = [];
      d.forEach(channel => {
        const elem = new ListElement();
        elem.active = this.activeChannel == channel.name;
        elem.name = channel.name[0] == '#' ? channel.name.substring(1) : channel.name;
        this.channels.push(elem);
      });
      // estoy en un canal que no existe?
      if(this.channels.findIndex(chan => chan.name === this.activeChannel) == -1) {
        this.activeChannel = undefined;
        this.router.navigateByUrl('/chat');
      }
    });
    this.pmsgSrv.newPrivOpened.subscribe((nick) => {
      const elem = new ListElement();
      elem.active = this.activePrivMsg == nick;
      elem.name = nick;
      elem.image = environment.hiranaTools + '/avatar?usr=' + nick;
      this.privMsg.push(elem);
    });
    this.pmsgSrv.closedPriv.subscribe(nick => {
      const pi = this.privMsg.findIndex(p => p == nick);
      this.privMsg.splice(pi, 1);
      if(this.activePrivMsg == nick) {
        this.activePrivMsg = undefined;
        this.router.navigateByUrl('/chat');
      }
    });
  }

  closePrivmsg(elem: ListElement) {
    this.pmsgSrv.closePrivate(elem.name);
  }

  ngOnDestroy() {
    this.joinSubscription.unsubscribe();
  }

}
