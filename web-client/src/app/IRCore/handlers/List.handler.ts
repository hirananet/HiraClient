import { EventEmitter } from '@angular/core';
import { ChannelInfo } from '../dto/ChannelInfo';

/*
  Clase para manejar el comando /list
*/
export class ListHandler {

  private static channels: ChannelInfo[] = [];
  public static readonly channelListCreated: EventEmitter<ChannelInfo[]> = new EventEmitter<ChannelInfo[]>();

  public static addChannels(channel: ChannelInfo): void {
    this.channels.push(channel);
  }

  public static newChannelList(): void {
    this.channels = [];
    this.channelListCreated.emit(this.channels);
  }

  public static getChannelList(): ChannelInfo[] {
    return this.channels;
  }

}
