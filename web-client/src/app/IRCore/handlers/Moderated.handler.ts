import { IRCMessage } from './../utils/IRCMessage.util';
import { EventEmitter } from '@angular/core';

export class ModeratedHandler {
  public static readonly channelModerated: EventEmitter<IRCMessage> = new EventEmitter<IRCMessage>();
}
