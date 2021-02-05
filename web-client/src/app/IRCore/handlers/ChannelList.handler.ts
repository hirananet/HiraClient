import { EventEmitter } from '@angular/core';
import { Channel } from '../dto/Channel';

/*
  Clase para manejar los canales que tiene un usuario.
  Lista de canales que trae el whois de un usuario o el mensaje inicial
*/
export class ChannelListHandler {

  private static uChannelList: UserChannelList = {};
  public static readonly channelListUpdated: EventEmitter<UpdateChannelList> = new EventEmitter<UpdateChannelList>();

  public static setChannelList(user: string, channelList: Channel[]) {
    // FIXME: update the same instance.
    this.uChannelList[user] = channelList;
    this.channelListUpdated.emit(new UpdateChannelList(user, channelList));
  }

  public static getChannels(): UserChannelList {
    return this.uChannelList;
  }

  public static setHandler(hdlr: OnChannelList) {
    this.channelListUpdated.subscribe(data => {
      hdlr.onChannelList(data.user, data.channels);
    });
  }

}

export class UserChannelList {
  [key: string]: Channel[];
}

export class UpdateChannelList {
  user: string;
  channels: Channel[] = [];
  constructor(user: string, channels: Channel[]) {
    this.user = user;
    this.channels = channels;
  }
}

export interface OnChannelList {
  onChannelList(user: string, channels: Channel[]);
}
