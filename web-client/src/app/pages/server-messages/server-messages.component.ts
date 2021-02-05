import { Subscription } from 'rxjs';
import { IRCoreService } from 'src/app/IRCore/IRCore.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ServerMsgService } from 'src/app/IRCore/services/server-msg.service';
import { IRCMessage } from 'src/app/IRCore/utils/IRCMessage.util';
import { MenuSelectorEvent, MenuType } from 'src/app/sections/menu/menu-selector.event';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-server-messages',
  templateUrl: './server-messages.component.html',
  styleUrls: ['./server-messages.component.scss']
})
export class ServerMessagesComponent implements OnInit, OnDestroy {

  public messages: IRCMessage[];
  public serverCommand: string;
  public subscription: Subscription;

  constructor(private srvSrv: ServerMsgService, private ircSrv: IRCoreService, private titleSrv: Title) {
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
    this.ircSrv.sendMessageOrCommand(this.serverCommand);
    this.serverCommand = '';
    document.getElementById('commandInput').focus();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
