import { JoinHandler, KickHandler, PartHandler, UserInfoService } from 'ircore';
import { environment } from './../../environments/environment';
import { WebSocketService } from './web-socket.service';
import { EventEmitter, Injectable } from '@angular/core';
import { MessageData, WSEventType } from './messageData';

@Injectable({
  providedIn: 'root'
})
export class RockolaService {

  private connected: boolean;

  public readonly play: EventEmitter<any> = new EventEmitter<any>();

  public readonly list: EventEmitter<RockolaData> = new EventEmitter<RockolaData>();
  private lists: {[key: string]: RockolaData} = {};

  public readonly pause: EventEmitter<any> = new EventEmitter<any>();
  public readonly sync: EventEmitter<any> = new EventEmitter<any>();

  constructor(private wsSrv: WebSocketService, private uiSrv: UserInfoService) { }

  public connect() {
    this.wsSrv.connect(environment.rockola);
    this.wsSrv.onConnected.subscribe(d => {
      setInterval(() => {
        this.wsSrv.send(new MessageData(
          'PING',
          WSEventType.PING
        ));
      }, 60000);
      this.connected = true;
      this.welcome();
    });
    this.wsSrv.onDisconnected.subscribe(d => {
      this.connected = false;
    });
    this.wsSrv.onMessage.subscribe(d => {
      const msg = JSON.parse(d);
      console.log('rockola message: ', msg);
      // procesar mensaje
      if(msg.action === 'PLAYLIST') {
        this.lists[msg.chann] = msg.list;
        this.list.emit(msg.list)
      } else if(msg.action === 'START') {
        this.play.emit(msg);
      } else if(msg.action === 'PAUSE') {
        this.pause.emit(msg);
      } else if(msg.action === 'TIME') {
        this.sync.emit(msg);
      }
    });
    this.handlers();
  }

  public getList(chann: string): RockolaData {
    return this.lists[chann];
  }

  private handlers() {
    JoinHandler.joinResponse.subscribe(d => {
      if(this.uiSrv.getNick() === d.user.nick) {
        this.getPlaylist(d.channel.channel);
      }
    });
    PartHandler.partResponse.subscribe(d => {
      if(this.uiSrv.getNick() === d.user.nick) {
        this.unwatch(d.channel.channel);
      }
    });
    KickHandler.kicked.subscribe(d => {
      if(this.uiSrv.getNick() === d.user.nick) {
        this.unwatch(d.channel.channel);
      }
    });
  }

  private welcome() {
    if(this.connected) {
      this.wsSrv.send(new MessageData('HiraClient-IRCoreV2', WSEventType.WELCOME));
    }
  }

  public getPlaylist(channel: string) {
    if(this.connected) {
      this.wsSrv.send(new MessageData(channel, WSEventType.LIST));
    }
  }

  public watch(channel: string) {
    if(this.connected) {
      this.wsSrv.send(new MessageData(channel, WSEventType.WATCH));
    }
  }

  public getTime(channel: string) {
    if(this.connected) {
      this.wsSrv.send(new MessageData(channel, WSEventType.TIME));
    }
  }

  public unwatch(channel: string) {
    if(this.connected) {
      this.wsSrv.send(new MessageData(channel, WSEventType.UNWATCH));
    }
  }

}

export class RockolaData {
  channel: string;
  list: {id: string, title: string}[];
  playing: boolean;
  currentSong: string;
  currentTitle: string;
}
