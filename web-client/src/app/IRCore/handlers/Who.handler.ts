import { EventEmitter } from '@angular/core';
import { Who } from './../dto/Who';

/*
  Clase para manejar el estado de los usuarios (si está away, es netop, de donde se conecta, etc.)
*/
export class WhoHandler {

  public static readonly usersWho: UsersWhos = {};
  public static readonly onWhoResponse: EventEmitter<Who> = new EventEmitter<Who>();

  public static addWhoData(user: string, data: Who) {
    if (!this.usersWho[user]) {
      this.usersWho[user] = data;
    } else {
      this.usersWho[user].isAway = data.isAway;
      this.usersWho[user].isNetOp = data.isNetOp;
      this.usersWho[user].mode = data.mode;
      this.usersWho[user].nick = data.nick;
      this.usersWho[user].rawMsg = data.rawMsg;
      this.usersWho[user].serverFrom = data.serverFrom;
    }
    this.onWhoResponse.emit(this.usersWho[user]);
  }

  public static getWhoData(user: string): Who {
    return this.usersWho[user];
  }

  public static WHOUserParser(message: string) {
    return /:([^\s]+)\s([0-9]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s([^\s]+)\s(H|G)(\*?)(\~|\&|\@|\%|\+)?/.exec(message);
  }

}

export class UsersWhos {
  [key: string]: Who;
}
