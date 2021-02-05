import { Part } from './../dto/Part';
import { EventEmitter } from '@angular/core';

export class PartHandler {
  public static readonly partResponse: EventEmitter<Part> = new EventEmitter<Part>();

  public static onPart(part: Part) {
    this.partResponse.emit(part);
  }

  public static setHandler(hdlr: OnPart) {
    this.partResponse.subscribe(data => {
      hdlr.onPart(data);
    });
  }
}

export interface OnPart {
  onPart(data: Part);
}
