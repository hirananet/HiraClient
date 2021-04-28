import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuSelectorEvent, MenuType } from 'src/app/sections/menu/menu-selector.event';
import { Title } from '@angular/platform-browser';
import { IRCMessage, ServerMsgService, IRCoreService } from 'ircore';
import { ElectronSrvService } from 'src/app/electron/electron-srv.service';

@Component({
  selector: 'app-server-messages',
  templateUrl: './server-messages.component.html',
  styleUrls: ['./server-messages.component.scss']
})
export class ServerMessagesComponent implements OnInit, OnDestroy {

  public messages: IRCMessage[];
  public serverCommand: string;
  public subscription: Subscription;

  constructor(private srvSrv: ServerMsgService, private ircSrv: IRCoreService, private titleSrv: Title, private electronSrv: ElectronSrvService) {
    this.messages = srvSrv.messages;
  }

  ngOnInit(): void {
    this.subscription = this.srvSrv.newMessage.subscribe(msg => {
      this.goDown();
    });
    this.goDown();
    // FIXME: mover a guard:
    MenuSelectorEvent.menuChange.emit({
      type: MenuType.MENU,
      name: 'server'
    });
    this.titleSrv.setTitle('Mensajes del servidor | HiraClient');
  }

  goDown() {
    const elem = document.getElementById('listMessages');
    setTimeout(() => {
      elem.scrollTo({top: elem.scrollHeight});
    }, 100);
  }

  kp(evt) {
    if(evt.keyCode === 13) {
      this.send();
    }
  }

  send() {
    if(environment.electron && this.serverCommand.indexOf('/log_route') === 0) {
      const route = this.serverCommand.replace('/log_route', '').trim();
      if(route.length == 0) {
        this.electronSrv.getLogRoute().then(_route => {
          this.messages.push({
            code: '00',
            message: 'HC: Log route: ' + _route,
            body: 'HC: Log route: ' + _route,
            origin: {
              server: 'HiraClient'
            },
            simplyOrigin: 'HiraClient',
            target: 'SERVER'
          });
          this.goDown();
        })
      } else {
        this.electronSrv.setLogRoute(route);
        this.messages.push({
          code: '00',
          message: 'Setting Log route: ' + route,
          body: 'Setting Log route: ' + route,
          origin: {
            server: 'HiraClient'
          },
          simplyOrigin: 'HiraClient',
          target: 'SERVER'
        });
        this.goDown();
      }
      this.serverCommand = '';
    } else {
      this.ircSrv.sendMessageOrCommand(this.serverCommand);
      this.serverCommand = '';
      document.getElementById('commandInput').focus();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
