import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ListElement } from 'src/app/sections/list/list.component';
import { environment } from 'src/environments/environment';
import { User, UModes, ChannelsService } from 'ircore';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit, OnDestroy {

  @Input() members: ListElement[] = [];
  @Input() channelName: string;

  private memberSubscription: Subscription;

  constructor(private chanSrv: ChannelsService) {
    this.memberSubscription = chanSrv.membersChanged.subscribe((d: {channel: string, users: User[]}) => {
      if(d.channel === this.channelName) {
        this.recalcUsers(d.users);
      }
    })
  }

  ngOnInit(): void {

  }

  public recalcUsers(users: User[]) {
    this.members = [];
    users.sort((a: User, b: User) => a.nick.localeCompare(b.nick)).forEach(user => {
      const member = new ListElement();
      member.name = user.nick;
      member.labels = [];
      member.image = environment.hiranaTools + '/avatar?usr=' + user.nick;
      if(user.mode == UModes.FOUNDER) {
        member.labels.push(
          {
            name: 'Founder',
            background: '#4b3526',
            color: '#dea777'
          }
        );
        member.color = '#009bd8';
      }
      if(user.mode == UModes.ADMIN) {
        member.labels.push(
          {
            name: 'Admin',
            background: '#3d264b',
            color: '#a977de'
          }
        );
        member.color = '#009bd8';
      }
      if(user.mode == UModes.OPER) {
        member.labels.push(
          {
            name: 'Oper',
            background: '#2c4b26',
            color: '#79d87d'
          }
        );
        member.color = '#009bd8';
      }
      if(user.mode == UModes.HALFOPER) {
        member.labels.push(
          {
            name: 'Half-oper',
            background: '#26344b',
            color: '#779fde'
          }
        );
        member.color = '#009bd8';
      }
      if(user.mode == UModes.VOICE) {
        member.color = '#009bd8';
      }
      this.members.push(member);
    });
  }

  ngOnDestroy() {
    this.memberSubscription.unsubscribe();
  }

}
