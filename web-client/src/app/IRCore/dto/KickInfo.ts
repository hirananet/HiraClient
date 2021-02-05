import { Channel } from './Channel';
import { User } from './User';
export class KickInfo {
  public channel: Channel;
  public operator: string;
  public userTarget: User;
}
