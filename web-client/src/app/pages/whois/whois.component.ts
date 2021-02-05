import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WhoIsData, WhoIsHandler } from 'ircore';
import { Subscription } from 'rxjs';
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

  constructor(
    private router: Router,
    route: ActivatedRoute
  ) {
    this.routeSubscription = this.router.events.subscribe(d => {
      this.currentWhoNick = route.snapshot.params.nick;
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    const allWhos = WhoIsHandler.getWhoisResponses();
    if(this.currentWhoNick && allWhos[this.currentWhoNick]) {
      this.currentWho = allWhos[this.currentWhoNick];
      this.currentImage = environment.hiranaTools + '/avatar?usr=' + this.currentWho.username;
    } else {
      this.currentWho = undefined;
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
