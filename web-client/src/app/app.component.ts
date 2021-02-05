import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import { ParamParse } from './utils/ParamsParse';
import { GmodeHandler, ServerMsgService, IRCoreService } from 'ircore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  codename = environment.codename;
  version = environment.version;
  requestNick = undefined;

  constructor(private srvSrv: ServerMsgService, private ircoreSrv: IRCoreService) {
    GmodeHandler.onPrivateRequest.subscribe(d => {
      this.requestNick = d;
    });
    ParamParse.parseHash(window.location.hash.slice(1));
    if(ParamParse.parametria['embedded'] && ParamParse.parametria['embedded'] == 'yes') {
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
  }

  accept(nick: string) {
    this.ircoreSrv.sendMessageOrCommand('/accept ' + nick);
    this.requestNick = undefined;
  }

}
