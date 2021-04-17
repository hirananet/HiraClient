import { MessageData } from './messageData';
import { WebSocketHDLR } from './websocket';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocketHDLR;
  public readonly onMessage: EventEmitter<string> = new EventEmitter<string>();
  public readonly onConnected = new EventEmitter<void>();
  public readonly onDisconnected = new EventEmitter<void>();
  public isConnected = false;

  constructor() { }

  public connect(url: string): void {
    this.socket = new WebSocketHDLR();
    this.socket.onOpenSubject.subscribe(d => {
      this.onConnected.emit();
      this.isConnected = true;
    });
    this.socket.onCloseSubject.subscribe(d => {
      this.onDisconnected.emit();
    });
    this.socket.connect(url).subscribe(d => {
      this.onMessage.emit(d);
    });
  }

  public send(message: MessageData): void {
    if (this.socket) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('Trying to send message without connection: ', message);
    }
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

}
