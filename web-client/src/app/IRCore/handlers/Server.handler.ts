import { EventEmitter } from '@angular/core';
import { IRCMessage } from '../utils/IRCMessage.util';

export class ServerHandler {
  public static readonly serverResponse: EventEmitter<IRCMessage> = new EventEmitter<IRCMessage>();
  public static readonly serverNoticeResponse: EventEmitter<IRCMessage> = new EventEmitter<IRCMessage>();

  public static onServerResponse(msg: IRCMessage) {
    this.serverResponse.emit(msg);
  }

  public static onServerNoticeResponse(msg: IRCMessage) {
    this.serverNoticeResponse.emit(msg);
  }
}
