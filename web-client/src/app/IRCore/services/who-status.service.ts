import { Injectable } from '@angular/core';
import { Who } from '../dto/Who';
import { WhoHandler } from '../handlers/Who.handler';

@Injectable({
  providedIn: 'root'
})
export class WhoStatusService {

  public whoStatus: {[key: string]: Who} = {};

  constructor() {
    WhoHandler.onWhoResponse.subscribe((dW: Who) => {
      this.whoStatus[dW.nick] = dW;
    });
  }

  public isAway(nick: string) {
    if(this.whoStatus[nick] && this.whoStatus[nick].isAway) {
      return true;
    }
    return false;
  }
}
