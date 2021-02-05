import { IRCMessage } from './../utils/IRCMessage.util';
import { ServerHandler } from './../handlers/Server.handler';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerMsgService {

  public readonly messages: IRCMessage[] = [];
  public readonly newMessage: EventEmitter<IRCMessage> = new EventEmitter<IRCMessage>();

  constructor() {
    ServerHandler.serverResponse.subscribe((d: IRCMessage) => {
      this.messages.push(d);
      this.newMessage.emit(d);
    })
    ServerHandler.serverNoticeResponse.subscribe((d: IRCMessage) => {
      this.messages.push(d);
      this.newMessage.emit(d);
    });
  }


}
