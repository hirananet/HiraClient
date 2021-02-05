import { EventEmitter } from '@angular/core';
import { UserInChannel } from '../dto/UserInChannel';

/*
  Clase para manejar los usuarios que hay en un canal (mensaje inicial de usuarios por names)
*/
export class UsersHandler {

  private static readonly usersInChannel: ChannelUserList = {};
  public static readonly usersInChannelResponse: EventEmitter<ChannelAndUserList> = new EventEmitter<ChannelAndUserList>();

  public static addUsersToChannel(channel: string, users: UserInChannel[]) {
    this.usersInChannel[channel] = users;
    this.usersInChannelResponse.emit(new ChannelAndUserList(channel, users));
  }

  public static getChannelOfMessage(message: string) {
    return /(=|@)([^:]+):/.exec(message)[2].trim();
  }

  public static getUsersInChannel(channel: string): UserInChannel[] {
    return this.usersInChannel[channel];
  }

  public static setHandler(hdlr: OnUserList) {
    this.usersInChannelResponse.subscribe(data => {
      hdlr.onUserList(data.channel, data.userList);
    });
  }

}

export class ChannelAndUserList {
  channel: string;
  userList: UserInChannel[];

  constructor(channel: string, userList: UserInChannel[]) {
    this.channel = channel;
    this.userList = userList;
  }
}

export class ChannelUserList {
  [key: string]: UserInChannel[];
}

export interface OnUserList {
  onUserList(channel: string, users: UserInChannel[]);
}
