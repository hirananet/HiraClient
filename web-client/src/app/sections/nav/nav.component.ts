import { AudioService } from 'src/app/utils/audio.service';
import { IRCoreService } from 'src/app/IRCore/IRCore.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionStatus, ConnectionStatusData, WebSocketUtil } from 'src/app/IRCore/utils/WebSocket.util';
import { UserInfoService } from 'src/app/IRCore/services/user-info.service';

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

  constructor(private router: Router, private ircSrv: IRCoreService, private uiSrv: UserInfoService, private audioSrv: AudioService) { }

  ngOnInit(): void {
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
