import { EventEmitter } from '@angular/core';
import { KickInfo } from '../dto/KickInfo';

export class KickHandler {

  public static readonly kicked: EventEmitter<KickInfo> = new EventEmitter<KickInfo>();

  public static kickParse(rawMessage: string): string[] {
    return /#([^\s]+)\s([^:]+)\s/.exec(rawMessage);
  }

  public static onKick(kick: KickInfo) {
    this.kicked.emit(kick);
  }

  public static setHandler(hdlr: OnKick) {
    this.kicked.subscribe(data => {
      hdlr.onKick(data);
    });
  }
}

export interface OnKick {
  onKick(data: KickInfo);
}
