import { EventEmitter, Injectable } from '@angular/core';
import { IndividualMessage, IndividualMessageTypes } from '../dto/IndividualMessage';
import { MessageHandler, OnMessageReceived } from '../handlers/Message.handler';
import { PostProcessor } from '../utils/PostProcessor';
import { GenericMessage, Author } from './ChannelData';
import { PrivmsgData } from './PrivmsgData';
import { UserInfoService } from './user-info.service';

@Injectable({
  providedIn: 'root'
})
export class PrivmsgService implements OnMessageReceived {

  public readonly messagesReceived: EventEmitter<GenericMessage> = new EventEmitter<GenericMessage>();
  public readonly newPrivOpened: EventEmitter<string> = new EventEmitter<string>();
  public readonly closedPriv: EventEmitter<string> = new EventEmitter<string>();
  public privMsgs: { [key: string]: PrivmsgData } = {};

  public history: { [key: string]: GenericMessage[] };

  constructor(private userSrv: UserInfoService) {
    MessageHandler.setHandler(this);
    this.history = JSON.parse(localStorage.getItem('pv_history'));
    if(!this.history) {
      this.history = {};
    }
  }

  onMessageReceived(message: IndividualMessage) {
    if(message.messageType == IndividualMessageTypes.PRIVMSG) {
      const msgAuthor = message.privateAuthor ? message.privateAuthor : message.author;
      const msg: GenericMessage = {
        message: (message.message as string),
        messageWithMetadata:  PostProcessor.processMessage(message.message as string, msgAuthor, this.userSrv.getNick()),
        author: new Author<string>(msgAuthor),
        date: message.date + ' ' + message.time,
        special: message.meAction,
        target: message.channel
      };
      if(this.privMsgs[message.author]) {
        this.privMsgs[message.author].messages.push(msg);
      } else {
        this.newPrivOpened.emit(message.author);
        this.privMsgs[message.author] = new PrivmsgData();
        this.privMsgs[message.author].user = message.author;
        this.privMsgs[message.author].messages.push(msg);
      }
      this.messagesReceived.emit(msg);
      this.saveHistory(message.author, msg);

    }
  }

  saveHistory(author: string, msg: GenericMessage) {
    if (!this.history[author]) {
      this.history[author] = [];
    }
    const msC = Object.assign({}, msg);
    msC.fromHistory = true;
    this.history[author].push(msC);
    localStorage.setItem('pv_history', JSON.stringify(this.history));
  }

  getHistory(author: string): GenericMessage[] {
    return this.history[author];
  }

  getPrivate(nick: string): PrivmsgData {
    if(!this.privMsgs[nick]) {
      this.privMsgs[nick] = new PrivmsgData();
      this.privMsgs[nick].user = nick;
      this.newPrivOpened.emit(nick);
    }
    return this.privMsgs[nick];
  }

  closePrivate(nick: string) {
    delete this.privMsgs[nick];
    this.closedPriv.emit(nick);
  }

}
