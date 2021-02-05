import { UModes } from '../utils/UModes.utils';

export class Channel {
  channel: string;
  name: string;
  mode: UModes;

  constructor(channel: string) {
    if (channel[0] === '~') {
      this.mode = UModes.FOUNDER;
      channel = channel.substr(1);
    } else if (channel[0] === '&') {
      this.mode = UModes.ADMIN;
      channel = channel.substr(1);
    } else if (channel[0] === '@') {
      this.mode = UModes.OPER;
      channel = channel.substr(1);
    } else if (channel[0] === '%') {
      this.mode = UModes.HALFOPER;
      channel = channel.substr(1);
    } else if (channel[0] === '+') {
      this.mode = UModes.VOICE;
      channel = channel.substr(1);
    }
    if (channel[0] === '#') {
      this.channel = channel;
      this.name = channel.substr(1);
    } else {
      this.channel = '#' + channel;
      this.name = channel;
    }
  }
}
