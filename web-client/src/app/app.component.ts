import { CustomEmoteList } from './utils/CustomEmoteList';
import { RockolaData, RockolaService } from 'src/app/rockola/rockola.service';
import { environment } from './../environments/environment';
import { Component, AfterViewInit } from '@angular/core';
import { ParamParse } from './utils/ParamsParse';
import { GmodeHandler, ServerMsgService, IRCoreService, AvatarHelper, KickHandler, KickInfo, UserInfoService } from 'ircore';
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
  requestForPlay: RockolaData;

  kickedInfo: KickInfo;
  playing: boolean;
  rockolaSync: boolean;

  constructor(
      private srvSrv: ServerMsgService,
      private ircoreSrv: IRCoreService,
      private electronSrv: ElectronSrvService,
      private rockola: RockolaService,
      private uiSrv: UserInfoService
    ) {
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
      if(d.userTarget.nick === this.uiSrv.getNick()) {
        this.kickedInfo = d;
      }
    });
    this.rockola.list.subscribe((channel: string) => {
      if(channel === this.rockolaData.channel) {
        this.rockolaData = this.rockola.getList(channel);;
      }
    });
    this.rockola.newplaylist.subscribe((channel) => {
      console.log('New playlist: ', channel);
      if(channel !== this.rockolaData?.channel) {
        this.requestForPlay = this.rockola.getList(channel);
      }
    });
    this.rockola.play.subscribe((playData: any) => {
      if(playData.chann == this.rockolaData?.channel) {
        YTPlayer.loadVideoById(playData.song);
        this.playing = true;
      }
    });
    this.rockola.pause.subscribe((playData: any) => {
      if(playData.chann == this.rockolaData?.channel) {
        YTPlayer.stopVideo();
        this.rockolaSync = false;
        this.playing = false;
      }
    });
    this.rockola.sync.subscribe((syncData) => {
      if(this.playing && !this.rockolaSync && this.rockolaData.channel == syncData.chann) {
        YTPlayer.seekTo(syncData.currentTime / 1000, true);
        this.rockolaSync = true;
      }
    });
  }

  removeRockola(id: string) {
    this.ircoreSrv.sendMessageOrCommand('Rockola remove ' + id, this.rockolaData.channel);
  }

  joinRockola() {
    if(!this.requestForPlay) {
      return;
    }
    this.rockolaData = this.requestForPlay;
    this.requestForPlay = undefined;
    YTPlayer.loadVideoById(this.rockolaData.currentSong);
    this.playing = true;
    this.rockolaSync = false;
    YTPlayingCallback = () => {
      this.rockola.getTime(this.rockolaData.channel);
    };
  }

  ignoreRockola() {
    this.requestForPlay = undefined;
  }

  leaveRockola() {
    this.rockolaData = undefined;
    this.playing = false;
    this.rockolaSync = false;
    YTPlayer.stopVideo();
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
