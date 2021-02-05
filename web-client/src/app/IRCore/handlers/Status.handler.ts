import { EventEmitter } from '@angular/core';
import { NickChange } from '../dto/NickChange';


/*
  Clase para manejar los cambios de estado del usuario, como cuando es banneado, o kickeado de un canal.
*/
export class StatusHandler {

  public static readonly nickAlreadyInUse: EventEmitter<string> = new EventEmitter<string>();
  public static readonly banned: EventEmitter<string> = new EventEmitter<string>();
  public static readonly nickChanged: EventEmitter<NickChange> = new EventEmitter<NickChange>();

  public static onNickAlreadyInUse(nickInUse: string) {
    this.nickAlreadyInUse.emit(nickInUse);
  }

  public static onBanned(channel: string) {
    this.banned.emit(channel);
  }

  public static onNickChanged(nick: NickChange) {
    this.nickChanged.emit(nick);
  }

  public static setHandlerNickAlreadyInUse(hdlr: OnNickAlreadyInUse) {
    this.nickAlreadyInUse.subscribe(data => {
      hdlr.onNickAlreadyInUse(data);
    });
  }

  public static setHandlerBanned(hdlr: OnBanned) {
    this.banned.subscribe(data => {
      hdlr.onBanned(data);
    });
  }

  public static setHandlerNickChanged(hdlr: OnNickChanged) {
    this.nickChanged.subscribe(data => {
      hdlr.onNickChanged(data);
    });
  }

}

export interface OnNickAlreadyInUse {
  onNickAlreadyInUse(nickInUse: string);
}

export interface OnBanned {
  onBanned(channel: string);
}

export interface OnNickChanged {
  onNickChanged(nick: NickChange);
}
