import { EventEmitter } from '@angular/core';
import { WhoIsData } from '../dto/WhoIs';

/*
  Clase para manejar el Whois de un usuario.
*/
export class WhoIsHandler {

  private static whoisdatas: WhoDatas = {};
  public static readonly onWhoisResponse: EventEmitter<WhoIsData> = new EventEmitter<WhoIsData>();

  public static addWhoisPartial(user: string, field: string, data: any) {
    if (!this.whoisdatas[user]) {
      this.whoisdatas[user] = new WhoIsData();
      this.whoisdatas[user].username = user;
    }
    this.whoisdatas[user][field] = data;
  }

  public static finalWhoisMessage(user: string) {
    this.onWhoisResponse.emit(this.whoisdatas[user]);
  }

  public static getWhoisResponses() {
    return this.whoisdatas;
  }

}

export class WhoDatas {
  [key: string]: WhoIsData;
}
