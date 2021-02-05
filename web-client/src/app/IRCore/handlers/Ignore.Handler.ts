import { EventEmitter } from '@angular/core';
import { Away } from './../dto/Away';

/**
 * clase para manejar los eventos de ignorar.
 */
export class IgnoreHandler {
  public static readonly ignoreResponse: EventEmitter<Away> = new EventEmitter<Away>();

  public static onIgnore(ignore: Away) {
    this.ignoreResponse.emit(ignore);
  }
}
