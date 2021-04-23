import { EventEmitter, Injectable } from '@angular/core';
import { IndividualMessage, IndividualMessageTypes, MessageHandler } from 'ircore';
import { environment } from 'src/environments/environment';

declare var electronApi: ElectronApi;

@Injectable({
  providedIn: 'root'
})
export class ElectronSrvService {

  private onLogRoute: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    if(environment.electron) {
      MessageHandler.messageResponse.subscribe((data: IndividualMessage) => {
        if(data.messageType == IndividualMessageTypes.PRIVMSG) {
          electronApi.log({
            type: 'privmsg',
            target: data.author,
            message: data.date + ' ' + data.time + ' <' +(data.privateAuthor ? data.privateAuthor : data.author) + '> ' + data.message + '\r\n'
          });
        } else if (data.messageType == IndividualMessageTypes.CHANMSG) {
          electronApi.log({
            type: 'channel',
            target: data.channel,
            message: data.date + ' ' + data.time + ' <' + data.author + '> ' + data.message + '\r\n'
          });
        }
      });
    }
  }

  oglr(evt: CustomEvent) {
    this.onLogRoute.emit(evt.detail);
  }

  getLogRoute(): Promise<string> {
    return new Promise<string>((res, rej) => {
      electronApi.getLogRoute();
      this.onLogRoute.subscribe(d => {
        res(d);
      });
    });
  }

  setLogRoute(route: string): void {
    electronApi.setLogRoute(route);
  }

  openLogsFolder(): void {
    if(!environment.electron) {
      return;
    }
    electronApi.sendOpenLogs();
  }

  sendPing(): void {
    if(!environment.electron) {
      return;
    }
    electronApi.sendPing();
  }

  sendBlink(): void {
    if(!environment.electron) {
      return;
    }
    electronApi.sendBlink();
  }

}

interface ElectronApi {
  log(data: {
    type: string,
    target: string,
    message: string
  }): void;
  setLogRoute(data: string): void;
  getLogRoute(): void;
  sendPing(): void;
  sendBlink(): void;
  sendOpenLogs(): void;
}
