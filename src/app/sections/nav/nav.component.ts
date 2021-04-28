import { AudioService } from 'src/app/utils/audio.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { IRCoreService, UserInfoService, ConnectionStatus, ConnectionStatusData, WebSocketUtil, WhoIsHandler, WhoIsData, StatusHandler, NickChange, ServerMsgService } from 'ircore';
import { ParamParse } from 'src/app/utils/ParamsParse';
import { filter } from 'rxjs/operators';
import { VcardGetterService } from '../chat-parts/message-item/link-vcard/vcard-getter.service';
import { environment } from 'src/environments/environment';
import { ElectronSrvService } from 'src/app/electron/electron-srv.service';

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
  public logsRoute: string;
  public embedded: boolean;

  public serverNews: boolean;
  public isInServWindow: boolean;
  public isElectron: boolean = environment.electron;

  constructor(private router: Router,
              private ircSrv: IRCoreService,
              private uiSrv: UserInfoService,
              private audioSrv: AudioService,
              private servMsgSrv: ServerMsgService,
              private vcg: VcardGetterService,
              private eSrv: ElectronSrvService) {
    this.embedded = ParamParse.parametria['embedded'] && (ParamParse.parametria['embedded'] == 'yes' || ParamParse.parametria['embedded'] == 'true');
  }

  @HostListener('document:logRoute', ['$event'])
  getLogRoute(evt) {
    this.eSrv.oglr(evt);
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
        if(this.isElectron) {
          this.eSrv.getLogRoute().then(route => {
            this.logsRoute = route;
          });
        }
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
    this.servMsgSrv.newMessage.subscribe(d => {
      if(!this.isInServWindow) {
        this.serverNews = true;
      }
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((d: NavigationEnd) => {
      this.isInServWindow = d.url == '/server';
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

  kpLogs(event) {
    if(event.keyCode == 13 && this.logsRoute) {
      this.eSrv.setLogRoute(this.logsRoute);
      this.popupOpened = false;
    }
  }

  save() {
    this.ircSrv.setNick(this.nick);
    if(this.logsRoute && this.isElectron) {
      this.eSrv.setLogRoute(this.logsRoute);
    }
    this.popupOpened = false;
  }

  changeSkin() {
    document.body.classList.remove('dark');
    document.body.classList.add(this.skin);
    localStorage.setItem('skinSelected', this.skin);
    this.popupOpened = false;
  }

  public imageLoading: boolean;

  openFile(evt) {
    if(this.imageLoading) return;
    document.getElementById('fileInput').click();
  }

  onFileSelected(event) {
    this.uploadFile(event.srcElement.files[0]);
  }

  uploadFile(file) {
    const fr = new FileReader();
    fr.onloadend = () => {
      this.vcg.uploadImage((fr.result as string).split('base64,')[1]).subscribe(d => {
        this.ircSrv.sendMessageOrCommand('avatar ' + d.image, 'HiranaBot');
        alert('Comando enviado al HiranaBot');
        this.imageLoading = false;
      }, err => {
        this.imageLoading = false;
        alert('Oops, ocurrió un error');
      });
    };
    if (file) {
      this.imageLoading = true;
      fr.readAsDataURL(file);
    }
  }

}
