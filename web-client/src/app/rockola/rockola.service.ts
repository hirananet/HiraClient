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
  private channelWatching: string;

  public readonly play: EventEmitter<string> = new EventEmitter<string>();
  public readonly list: EventEmitter<RockolaData> = new EventEmitter<RockolaData>();
  public readonly pause: EventEmitter<void> = new EventEmitter<void>();
  public readonly sync: EventEmitter<number> = new EventEmitter<number>();
  public static readonly detectedPlaylist: EventEmitter<string> = new EventEmitter<string>();

  constructor(private wsSrv: WebSocketService, private uiSrv: UserInfoService) { }

  public connect() {
    this.wsSrv.connect(environment.rockola);
    this.wsSrv.onConnected.subscribe(d => {
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
        console.log('Emitting playlist');
        this.list.emit(msg.list)
      } else if(msg.action === 'START') {
        this.play.emit(msg.song);
      } else if(msg.action === 'PAUSE') {
        this.pause.emit();
      } else if(msg.action === 'TIME') {
        this.sync.emit(msg.currentTime);
      }
    });
    this.handlers();
    RockolaService.detectedPlaylist.subscribe(channel => {
      this.getPlaylist(channel);
    });
  }

  private clearChannelWatching() {
    this.channelWatching = undefined;
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
      // ya estoy watcheando algo?
      if(this.channelWatching) {
        this.unwatch(this.channelWatching);
      }
      this.channelWatching = channel;
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
      this.channelWatching = undefined;
      this.wsSrv.send(new MessageData(channel, WSEventType.UNWATCH));
    }
  }

  public getChannelWatching() {
    return this.channelWatching;
  }

}

export class RockolaData {
  channel: string;
  list: {id: string, title: string}[];
  playing: boolean;
  currentSong: string;
  currentTitle: string;
}
