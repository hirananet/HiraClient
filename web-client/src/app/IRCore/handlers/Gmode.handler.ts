import { EventEmitter } from '@angular/core';

/*
  Clase para manejar los request en +g
*/
export class GmodeHandler {

  public static readonly onPrivateRequest: EventEmitter<string> = new EventEmitter<string>();

  public static privateRequest(user: string) {
    GmodeHandler.onPrivateRequest.emit(user);
  }

}
