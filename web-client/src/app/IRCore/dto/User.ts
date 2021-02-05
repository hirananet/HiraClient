import { UModes } from '../utils/UModes.utils';

export class User {

  public nick: string;
  public mode: UModes;
  public away?: boolean;

  constructor(nick: string) {
    if (nick[0] === '~') {
      this.mode = UModes.FOUNDER;
      nick = nick.substr(1);
    } else if (nick[0] === '&') {
      this.mode = UModes.ADMIN;
      nick = nick.substr(1);
    } else if (nick[0] === '@') {
      this.mode = UModes.OPER;
      nick = nick.substr(1);
    } else if (nick[0] === '%') {
      this.mode = UModes.HALFOPER;
      nick = nick.substr(1);
    } else if (nick[0] === '+') {
      this.mode = UModes.VOICE;
      nick = nick.substr(1);
    }
    this.nick = nick;
  }

}
