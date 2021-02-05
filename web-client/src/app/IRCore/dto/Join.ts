import { User } from './User';
import { OriginData } from '../utils/IRCMessage.util';
import { Channel } from './Channel';

export class Join {
  public origin: OriginData;
  public user: User;
  public channel: Channel;
}
