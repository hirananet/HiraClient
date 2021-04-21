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

  public readonly newplaylist: EventEmitter<string> = new EventEmitter<string>();
  public readonly list: EventEmitter<string> = new EventEmitter<string>();

  private lists: {[key: string]: RockolaData} = {};

  public readonly pause: EventEmitter<any> = new EventEmitter<any>();
  public readonly sync: EventEmitter<any> = new EventEmitter<any>();
  public readonly forcePlaylist: EventEmitter<string> = new EventEmitter<string>();

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
        const chann = msg.list?.channel;
        console.log('chann?', chann);
        if(chann && msg.list.playing) {
          let newPlaylist = !this.lists[chann];
          console.log('NEW LIST? ', newPlaylist);
          this.lists[chann] = msg.list;
          if(newPlaylist) {
            this.newplaylist.emit(chann);
          } else {
            this.list.emit(chann)
          }
        }
      } else if(msg.action === 'NEW_PLAYLIST') {
        this.lists[msg.chann] = msg.list;
        this.newplaylist.emit(msg.chann);
      } else if(msg.action === 'PLAY') {
        this.play.emit(msg);
      } else if(msg.action === 'PAUSE') {
        this.pause.emit(msg);
      } else if(msg.action === 'TIME') {
        this.sync.emit(msg);
      }
    });
    this.handlers();
  }

  public getList(chann?: string): RockolaData {
    const list = this.lists[chann];;
    if(list) {
      return list;
    } else {
      console.log(list, chann, this.lists);
    }
  }

  private handlers() {
    JoinHandler.joinResponse.subscribe(d => {
      if(this.uiSrv.getNick() === d.user.nick) {
        this.getPlaylist(d.channel.channel);
        this.watch(d.channel.channel);
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

  public forceOpenPLaylist(channel: string) {
    this.forcePlaylist.emit(channel);
  }

}

export class RockolaData {
  channel: string;
  list: {id: string, title: string}[];
  playing: boolean;
  currentSong: string;
  currentTitle: string;
}
