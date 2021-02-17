export class MessageData {
  event: WSEventType = WSEventType.DEFAULT;
  data: string;

  constructor(data: string, eventType?: WSEventType) {
    this.data = data;
    if (eventType) {
      this.event = eventType;
    }
  }
}

export enum WSEventType {
  DEFAULT = 'default',
  WELCOME = 'welcome',
  LIST = 'list',
  WATCH = 'watch',
  UNWATCH = 'unwatch',
  TIME = 'time'
}
