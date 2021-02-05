import { MessageWithMetadata } from '../utils/PostProcessor';

export class IndividualMessage {
  messageType: IndividualMessageTypes;
  author: string;
  message: string;
  richMessage?: MessageWithMetadata;
  meAction: boolean;
  specialAction?: boolean;
  isAwayNotify?: boolean;
  time?: string;
  date?: string;
  channel?: string;
  mention?: boolean;
  fromLog?: boolean;
  privateAuthor?: string; // when i send private message my nick is here.
}

export enum IndividualMessageTypes {
  PRIVMSG,
  CHANMSG,
  NOTIFY // notificación contra un canal.
}
