import { Channel } from './Channel';

export class WhoIsData {

  public username: string;
  public connectedFrom?: string;
  public server?: string;
  public isGOP = false;
  public modes: string;
  public userAccount: string;
  public isSecured = false;
  public idle: number;
  public lastLogin: string;
  public channelList: Channel[];

  public getLastLogin(): string {
    const date = new Date(parseInt(this.lastLogin, 10) * 1000);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
  }

  public getIdle(): string {
    let out = '';
    let idle = this.idle;
    if (idle >= 60) {
      out = (this.idle % 60) + 's';
      idle = Math.floor(idle / 60);
    } else {
      return this.idle + 's';
    }
    if (idle >= 60) {
      out = (this.idle % 60) + 'm ' + out;
      idle = Math.floor(idle / 60);
    } else {
      return idle + 'm ' + out;
    }
    if (idle >= 24) {
      out = (this.idle % 24) + 'h ' + out;
      idle = Math.floor(idle / 24);
    } else {
      return idle + 'h ' + out;
    }
    return idle + 'd ' + out;
  }

}
