import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Channel, WhoIsData, WhoIsHandler, IRCoreService, ChannelsService } from 'ircore';
import { Subscription } from 'rxjs';
import { ListElement } from 'src/app/sections/list/list.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-whois',
  templateUrl: './whois.component.html',
  styleUrls: ['./whois.component.scss']
})
export class WhoisComponent implements OnInit {

  public currentWho: WhoIsData;
  public currentImage: string;

  private routeSubscription: Subscription;

  public currentWhoNick;
  public channels: ListElement[];

  public historyWhos: {nick: string, avatar: string}[];

  public searchWho: string;

  constructor(
    private router: Router,
    route: ActivatedRoute,
    private ircSrv: IRCoreService,
    private cSrv: ChannelsService
  ) {
    this.routeSubscription = this.router.events.subscribe(d => {
      this.currentWhoNick = route.snapshot.params.nick;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    const allWhos = WhoIsHandler.getWhoisResponses();
    if(this.currentWhoNick && allWhos[this.currentWhoNick]) {
      this.showCurrent(allWhos);
    } else {
      this.currentWho = undefined;
    }
    this.historyWhos = [];
    Object.entries(allWhos).forEach(entries => {
      this.historyWhos.push({
        nick: entries[1].username,
        avatar: environment.hiranaTools + '/avatar?usr=' + entries[1].username
      });
    })
  }

  setCurrent(nick: string) {
    this.currentWhoNick = nick;
    this.showCurrent(WhoIsHandler.getWhoisResponses());
  }

  showCurrent(allWhos) {
    this.currentWho = allWhos[this.currentWhoNick];
    this.currentImage = environment.hiranaTools + '/avatar?usr=' + this.currentWho.username;
    this.channels = [];
    console.log(allWhos[this.currentWhoNick]);
    if(allWhos[this.currentWhoNick].channelList) {
      allWhos[this.currentWhoNick].channelList.forEach((chnl: Channel) => {
        this.channels.push({
          name: chnl.name,
          active: false,
          notify: false,
          warn: false
        });
      });
    }
  }

  joinC(elem: ListElement) {
    if(this.cSrv.getChannel(elem.name)) {
      this.router.navigateByUrl('/chat/' + elem.name);
    } else {
      this.ircSrv.sendMessageOrCommand('/join #' + elem.name);
    }
  }

  openPv(nick: string) {
    this.router.navigateByUrl('/priv/' + nick)
  }

  search(nick: string) {
    this.ircSrv.sendMessageOrCommand('/whois ' + nick);
  }

  kp(event) {
    if(event.keyCode == 13 && this.searchWho && this.searchWho.length > 0) {
      this.search(this.searchWho);
      this.searchWho = '';
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
