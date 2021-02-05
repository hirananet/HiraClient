import { EventEmitter } from '@angular/core';
import { Quit } from './../dto/Quit';

export class QuitHandler {
  public static readonly quitResponse: EventEmitter<Quit> = new EventEmitter<Quit>();

  public static onQuit(quit: Quit) {
    this.quitResponse.emit(quit);
  }

  public static setHandler(hdlr: OnQuit) {
    this.quitResponse.subscribe(data => {
      hdlr.onQuit(data);
    });
  }
}

export interface OnQuit {
  onQuit(data: Quit);
}
