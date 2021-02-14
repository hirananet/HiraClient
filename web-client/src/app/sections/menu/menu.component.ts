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

  public activeChannel: string = undefined;
  public activePrivMsg: string = undefined;

  private joinSubscription: Subscription;

  public lastSelected: MenuElement;

  public pingsPrivate: number = 0;
  public pingsChannel: number = 0;
  public privPings: {[key:string]: number} = {};
  public chanPings: {[key:string]: number} = {};

  public channels: ListElement[];
  public privMsg: ListElement[] = [];

  public filterString: string = '';
  public _channels: ListElement[];
  public _privMsg: ListElement[] = [];

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
        const fdn = this._channels.find(channel => channel.name == this.lastSelected.name);
        if(fdn) {
          fdn.active = false;
        }
      } else if(this.lastSelected?.type === MenuType.PRIV_MSG) {
        const fdn = this._privMsg.find(channel => channel.name == this.lastSelected.name);
        if(fdn) {
          fdn.active = false;
        }
      }
      this.lastSelected = d;
      if(this.lastSelected?.type === MenuType.CHANNEL) {
        this._channels.find(channel => channel.name == this.lastSelected.name).active = true;
        this.activeChannel = this.lastSelected.name;
        this.activePrivMsg = undefined;
        if(this.chanPings[d.name] && this.chanPings[d.name] > 0) {
          this.pingsChannel -= this.chanPings[d.name];
          this.chanPings[d.name] = 0;
        }
      } else if(this.lastSelected?.type === MenuType.PRIV_MSG) {
        this._privMsg.find(channel => channel.name == this.lastSelected.name).active = true;
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
        const channel = this._channels.find(channel => channel.name == d.target);
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
        let chat = this._privMsg.find(pms => pms.name === d.author.user);
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

  onSearch(evt) {
    this.channels = this._channels.filter(d => d.name.toLowerCase().indexOf(evt.srcElement.value.toLowerCase().trim()) >= 0);
    this.privMsg = this._privMsg.filter(d => d.name.toLowerCase().indexOf(evt.srcElement.value.toLowerCase().trim()) >= 0);
    this.filterString = evt.srcElement.value.toLowerCase().trim();
  }

  getFiltered(le: ListElement[]) {
    return le.filter(d => d.name.toLowerCase().indexOf(this.filterString) >= 0);
  }

  ngOnInit(): void {
    this.cSrv.listChanged.subscribe((d: ChannelData[]) => {
      // validamos la lista
      this._channels = [];
      d.forEach(channel => {
        const elem = new ListElement();
        elem.active = this.activeChannel == channel.name;
        elem.name = channel.name[0] == '#' ? channel.name.substring(1) : channel.name;
        this._channels.push(elem);
      });
      // estoy en un canal que no existe?
      if(this._channels.findIndex(chan => chan.name === this.activeChannel) == -1) {
        this.activeChannel = undefined;
        this.router.navigateByUrl('/chat');
      }
      this.channels = this.getFiltered(this._channels);
    });
    this.pmsgSrv.newPrivOpened.subscribe((nick) => {
      const elem = new ListElement();
      elem.active = this.activePrivMsg == nick;
      elem.name = nick;
      elem.image = environment.hiranaTools + '/avatar?usr=' + nick;
      this._privMsg.push(elem);
      this.privMsg = this.getFiltered(this._privMsg);
    });
    this.pmsgSrv.closedPriv.subscribe(nick => {
      const pi = this._privMsg.findIndex(p => p.name == nick);
      if(pi < 0) {
        return;
      }
      this._privMsg.splice(pi, 1);
      if(this.activePrivMsg == nick) {
        this.activePrivMsg = undefined;
        this.router.navigateByUrl('/chat');
      }
      this.privMsg = this.getFiltered(this._privMsg);
    });
  }

  closePrivmsg(elem: ListElement) {
    this.pmsgSrv.closePrivate(elem.name);
  }

  ngOnDestroy() {
    this.joinSubscription.unsubscribe();
  }

}
