import { GenericMessage } from './ChannelData';
export class PrivmsgData {
  public user: string;
  public messages: GenericMessage[] = [];
}
