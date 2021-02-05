import { Channel } from './Channel';
import { User } from './User';

export class UserInChannel extends User{

  public channel: Channel;

  constructor(nick: string, channel: string) {
    super(nick);
    this.channel = new Channel(channel);
  }
}
