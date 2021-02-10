import { Subscription } from 'rxjs';
import { ChannelInfo, IRCoreService, ListHandler, ChannelsService } from 'ircore';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-canales',
  templateUrl: './canales.component.html',
  styleUrls: ['./canales.component.scss']
})
export class CanalesComponent implements OnInit, OnDestroy {

  private listHandler: Subscription;
  public channels: ChannelInfo[];

  constructor(private router: Router, private titleSrv: Title, private ircSrv: IRCoreService, private cSrv: ChannelsService) {
    this.listHandler = ListHandler.channelListCreated.subscribe(d => {
      this.channels = d;
    });
    this.channels = ListHandler.getChannelList();
  }

  ngOnInit(): void {
    this.titleSrv.setTitle('Lista de canales | HiraClient');
    this.ircSrv.sendMessageOrCommand('/list');
  }

  ngOnDestroy(): void {
    this.listHandler.unsubscribe();
  }

  openChan(chan: string) {
    if(chan === '*') return;
    if(this.cSrv.getChannel(chan)) {
      this.router.navigateByUrl('/chat/' + chan);
    } else {
      this.ircSrv.sendMessageOrCommand('/join #' + chan);
    }
  }

}
