import { ParamParse } from '../../utils/ParamsParse';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MenuSelectorEvent, MenuType } from 'src/app/sections/menu/menu-selector.event';
import { Title } from '@angular/platform-browser';
import { IRCoreService, StatusHandler, MotdHandler, IRCMessage, ConnectionStatus, ConnectionStatusData, WebSocketUtil } from 'ircore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {

  public isWS: boolean = true;
  public host: string = 'irc.hirana.net';
  public nick: string;
  public nickSecundario: string;
  public canales: string[] = [];
  public canalAgregar: string;
  public password: string;
  public tipoLogin: TiposLogin = TiposLogin.NONE;

  public error: string;
  public connected: boolean;

  private subscription_status: Subscription;


  constructor(private ircSrv: IRCoreService, private router: Router, private titleSrv: Title) {

  }

  ngOnInit(): void {
    this.connected = WebSocketUtil.isConnected();
    this.subscription_status = WebSocketUtil.statusChanged.subscribe((status: ConnectionStatusData<any>) => {
      if(status.status == ConnectionStatus.CONNECTED) {
        this.connected = true;
        this.error = undefined;
      }
      if(status.status == ConnectionStatus.DISCONNECTED || status.status === ConnectionStatus.ERROR) {
        this.error = 'Error de conexión';
        this.connected = false;
      }
    });
    // FIXME: mover a guard:
    MenuSelectorEvent.menuChange.emit({
      type: MenuType.MENU,
      name: 'user'
    });
    this.titleSrv.setTitle('Usuario | HiraClient');
  }

  ngAfterViewInit(): void {
    if(ParamParse.parametria['chat']) {
      const chat = ParamParse.parametria['chat'][0] != '#' ? '#' +ParamParse.parametria['chat'] : ParamParse.parametria['chat'];
      this.canales = [
        chat
      ];
    }
    if(ParamParse.parametria['nick']) {
      this.nick = ParamParse.parametria['nick'];
      this.nickSecundario = ParamParse.parametria['nick'] + '_';
    }
    if(ParamParse.parametria['connect'] && ParamParse.parametria['connect'] == 'yes') {
      this.connect();
    }
    if(localStorage.getItem('cHost')) {
      this.host = localStorage.getItem('cHost');
      if(!ParamParse.parametria['nick']) {
        this.nick = localStorage.getItem('cNick');
        this.nickSecundario = localStorage.getItem('cNickAlt');
      }
      this.tipoLogin = localStorage.getItem('cAuthMethod') as TiposLogin;
      this.password = localStorage.getItem('cPassword');
      if(!ParamParse.parametria['chat']) {
        const canales = JSON.parse(localStorage.getItem('cChannels'));
        this.canales = canales ? canales : [];
      }
      this.isWS = localStorage.getItem('cIsWS') == 'yes';
    }
    document.getElementById('nickInput').focus();
  }

  removeChannel(idx: number) {
    this.canales.splice(idx, 1);
  }

  kp(event: any) {
    if(event.keyCode === 13) {
      this.agregarCanal();
    }
  }

  agregarCanal() {
    if(this.canales.findIndex(canal => canal === this.canalAgregar) === -1) {
      let canalAgregar = this.canalAgregar;
      if(canalAgregar[0] != '#') {
        canalAgregar = '#' + canalAgregar;
      }
      this.canales.push(canalAgregar);
      this.canalAgregar = '';
      document.getElementById('canalInput').focus();
    }
  }

  connect() {
    if(this.saveData()) {
      // establecer conexión
      let host = this.host;
      if(this.isWS) {
        this.ircSrv.connect('wss://' + this.host);
        const subscription_status_b = WebSocketUtil.statusChanged.subscribe(d => {
          this.ircSrv.handshake(this.nick, this.nick);
          this.router.navigateByUrl('/server');
          subscription_status_b.unsubscribe();
        })
        const subscription_nick = StatusHandler.nickAlreadyInUse.subscribe(d => {
          this.ircSrv.setNick(this.nickSecundario);
          subscription_nick.unsubscribe();
        })
        const subscripion_motd = MotdHandler.motdResponse.subscribe((d: IRCMessage) => {
          // joineamos canales?
          this.canales.forEach(canal => {
            this.ircSrv.join(canal);
          });
          subscripion_motd.unsubscribe();
        })
      } else {
        this.ircSrv.connect(environment.webIRCGateway);
        const subscription_status_b = WebSocketUtil.statusChanged.subscribe(d => {
          this.ircSrv.handshake(this.nick, this.nick, this.host);
          this.router.navigateByUrl('/server');
          subscription_status_b.unsubscribe();
        })
        const subscription_nick = StatusHandler.nickAlreadyInUse.subscribe(d => {
          this.ircSrv.setNick(this.nickSecundario);
          subscription_nick.unsubscribe();
        })
        const subscription_motd_pass = MotdHandler.requirePasswordResponse.subscribe((d: IRCMessage) => {
          if(this.tipoLogin === TiposLogin.PASS) {
            this.ircSrv.serverPass(this.nick, this.password);
          }
        });
        const subscripion_motd = MotdHandler.motdResponse.subscribe((d: IRCMessage) => {
          subscription_motd_pass.unsubscribe();
          // joineamos canales?
          this.canales.forEach(canal => {
            this.ircSrv.join(canal);
          });
          subscripion_motd.unsubscribe();
        });
      }
    }
  }

  saveData(): boolean {
    this.error = undefined;
    if(!this.host || this.host.length < 2) {
      this.error = 'Debe ingresar un server';
      document.getElementById('hostInput').focus();
      return false;
    }
    if(!this.nick || this.nick.length < 2) {
      this.error = 'Debe ingresar un apodo';
      document.getElementById('nickInput').focus();
      return false;
    }
    if(!this.nickSecundario || this.nickSecundario.length < 2) {
      this.error = 'Debe ingresar un apodo secundario';
      document.getElementById('nickSecInput').focus();
      return false;
    }
    localStorage.setItem('cHost', this.host);
    localStorage.setItem('cNick', this.nick);
    localStorage.setItem('cNickAlt', this.nickSecundario);
    localStorage.setItem('cAuthMethod', this.tipoLogin);
    localStorage.setItem('cChannels', JSON.stringify(this.canales));
    localStorage.setItem('cPassword', this.password);
    localStorage.setItem('cIsWS', this.isWS ? 'yes' : 'no');
    return true;
  }

  changeNick() {
    this.ircSrv.setNick(this.nick);
  }

  ngOnDestroy(): void {
    this.subscription_status.unsubscribe();
  }

}

export enum TiposLogin {
  NONE = 'NONE',
  NS = 'NS',
  PASS = 'PASS'
}
