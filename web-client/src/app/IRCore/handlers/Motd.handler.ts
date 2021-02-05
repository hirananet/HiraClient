import { EventEmitter } from '@angular/core';
import { IRCMessage } from '../utils/IRCMessage.util';
/**
 * clase para manejar los mensajes del día y el hook para enviar el auth al bouncer
 */
export class MotdHandler {
  public static readonly motdResponse: EventEmitter<IRCMessage> = new EventEmitter<IRCMessage>();
  public static readonly requirePasswordResponse: EventEmitter<IRCMessage> = new EventEmitter<IRCMessage>();
}
