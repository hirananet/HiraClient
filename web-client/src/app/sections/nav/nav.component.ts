import { AudioService } from 'src/app/utils/audio.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IRCoreService, UserInfoService, ConnectionStatus, ConnectionStatusData, WebSocketUtil, WhoIsHandler, WhoIsData, StatusHandler, NickChange } from 'ircore';
import { ParamParse } from 'src/app/utils/ParamsParse';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public connected: boolean;
  public error: boolean;
  public timmer: any;

  public popupOpened: boolean = false;
  public nick: string;
  public skin: string;
  public embedded: boolean;

  constructor(private router: Router, private ircSrv: IRCoreService, private uiSrv: UserInfoService, private audioSrv: AudioService) {
    this.embedded = ParamParse.parametria['embedded'] && (ParamParse.parametria['embedded'] == 'yes' || ParamParse.parametria['embedded'] == 'true');
  }

  ngOnInit(): void {
    StatusHandler.nickChanged.subscribe((nick: NickChange) => {
      if(nick.oldNick === this.uiSrv.getNick()) {
        this.nick = nick.newNick;
      } else {
        this.nick = this.uiSrv.getNick();
      }
    });
    WebSocketUtil.statusChanged.subscribe((status: ConnectionStatusData<any>) => {
      if(status.status == ConnectionStatus.CONNECTED) {
        this.connected = true;
        this.error = false;
        this.timmer = setInterval(() => {
          this.ircSrv.sendRaw('PING IRCoreWS');
        }, 60000); // autoping
      }
      if(status.status == ConnectionStatus.DISCONNECTED || status.status === ConnectionStatus.ERROR) {
        this.error = true;
        this.connected = false;
        this.router.navigateByUrl('/user');
        clearInterval(this.timmer);
        this.audioSrv.playError();
      }
    });
    if(localStorage.getItem('skinSelected')) {
      this.skin = localStorage.getItem('skinSelected');
    } else {
      this.skin = 'light';
    }
    WhoIsHandler.onWhoisResponse.subscribe((d: WhoIsData) => {
      this.router.navigateByUrl('/whois/' + d.username);
    });
  }

  openPopup() {
    this.nick = this.uiSrv.getNick();
    this.popupOpened = !this.popupOpened;
    setTimeout(() => {
      document.getElementById('popupNick').focus();
    }, 75);
  }

  kp(event) {
    if(event.keyCode == 13) {
      this.ircSrv.setNick(this.nick);
      this.popupOpened = false;
    }
  }

  changeSkin() {
    document.body.classList.remove('dark');
    document.body.classList.add(this.skin);
    localStorage.setItem('skinSelected', this.skin);
    this.popupOpened = false;
  }

}
