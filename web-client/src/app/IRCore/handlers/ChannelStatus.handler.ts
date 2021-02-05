/**
 * clase para manejar los cambios de estado de un canal, como el topic y los modos.
 */

import { EventEmitter } from '@angular/core';

export class ChannelStatusHandler {

  private static readonly channelsTopics: ChannelsTopic = {};
  public static readonly channelTopicResponse: EventEmitter<ChannelTopicUpdate> = new EventEmitter<ChannelTopicUpdate>();

  public static setChannelTopic(channel: string, topic: string) {
    this.channelsTopics[channel] = topic;
    this.channelTopicResponse.emit(new ChannelTopicUpdate(channel, topic));
  }

  public static getChannelTopic(channel: string) {
    return this.channelsTopics[channel];
  }

  public static findChannels(message: string): string[] {
    let channels = /#([^\s]+)/g.exec(message) as Array<string>;
    channels = channels.slice(1);
    return channels;
  }

  public static setHandler(hdlr: OnTopicUpdate) {
    this.channelTopicResponse.subscribe(topic => {
      hdlr.onTopicUpdate(topic.channel, topic.newTopic);
    });
  }

}

export class ChannelsTopic {
  [key: string]: string;
}

export class ChannelTopicUpdate {
  channel: string;
  newTopic: string;
  constructor(channel: string, newTopic: string) {
    this.channel = channel;
    this.newTopic = newTopic;
  }
}

export interface OnTopicUpdate {
  onTopicUpdate(channel: string, newTopic: string);
}
