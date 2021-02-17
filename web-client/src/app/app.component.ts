import { CustomEmoteList } from './utils/CustomEmoteList';
import { RockolaData, RockolaService } from 'src/app/rockola/rockola.service';
import { environment } from './../environments/environment';
import { Component, AfterViewInit } from '@angular/core';
import { ParamParse } from './utils/ParamsParse';
import { GmodeHandler, ServerMsgService, IRCoreService, AvatarHelper, KickHandler, KickInfo } from 'ircore';
import { ElectronSrvService } from './electron/electron-srv.service';

declare var YTPlayer;
declare var YTPlayingCallback;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{

  codename = environment.codename;
  version = environment.version;
  requestNick = undefined;

  rockolaData: RockolaData;
  requestForPlay: boolean;
  kickedInfo: KickInfo;
  playing: boolean;
  rockolaSync: boolean;

  constructor(private srvSrv: ServerMsgService, private ircoreSrv: IRCoreService, private electronSrv: ElectronSrvService, private rockola: RockolaService) {
    CustomEmoteList.setSpecialFaces();
    AvatarHelper.setAvatarURL(environment.hiranaTools + '/avatar?usr=');
    GmodeHandler.onPrivateRequest.subscribe(d => {
      this.requestNick = d;
    });
    ParamParse.parseHash(window.location.hash.slice(1));
    if(ParamParse.parametria['embedded'] && (ParamParse.parametria['embedded'] == 'yes' || ParamParse.parametria['embedded'] == 'true')) {
      document.body.classList.add('embedded');
    }
    if(!ParamParse.parametria['skin'] || ParamParse.parametria['skin'] === 'light') {

    } else if(ParamParse.parametria['skin'] === 'dark') {
      document.body.classList.add('dark');
    }
    if(localStorage.getItem('skinSelected')) {
      const skin = localStorage.getItem('skinSelected');
      document.body.classList.add(skin);
    }
    KickHandler.kicked.subscribe(d => {
      this.kickedInfo = d;
    });
    this.rockola.list.subscribe((d: RockolaData) => {
      console.log('Actualización lista de reproducción', d, this.rockola.getChannelWatching(), d?.playing, d?.channel !== this.rockola.getChannelWatching());
      if(d?.playing && d?.channel !== this.rockola.getChannelWatching()) {
        this.rockolaData = d;
        this.requestForPlay = true;
      }
    });
    this.rockola.play.subscribe((currentSong: string) => {
      YTPlayer.loadVideoById(currentSong);
      this.playing = true;
    });
    this.rockola.pause.subscribe(() => {
      YTPlayer.stopVideo();
      this.rockolaSync = false;
      this.playing = false;
    });
    this.rockola.sync.subscribe(time => {
      console.log('RCK', this.playing, this.rockolaSync);
      if(this.playing && !this.rockolaSync) {
        console.log('seeking to: ', time);
        YTPlayer.seekTo(time, true);
        // this.rockolaSync = true;
      }
    });
  }

  joinRockola() {
    this.rockola.watch(this.rockolaData.channel);
    this.rockola.getTime(this.rockolaData.channel);
    YTPlayer.loadVideoById(this.rockolaData.currentSong);
    this.requestForPlay = false;
    this.playing = true;
    this.rockolaSync = false;
    YTPlayingCallback = () => {
      // sincronizar:
      this.rockola.getTime(this.rockolaData.channel);
    }
  }

  leaveRockola() {
    this.playing = false;
    this.rockolaSync = false;
  }

  accept(nick: string) {
    this.ircoreSrv.sendMessageOrCommand('/accept ' + nick);
    this.requestNick = undefined;
  }

  ngAfterViewInit() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

}
