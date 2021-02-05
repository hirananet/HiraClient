import { User } from './User';

export class Quit {
  public user: User;
  constructor(user: string) {
    this.user = new User(user);
  }
}
