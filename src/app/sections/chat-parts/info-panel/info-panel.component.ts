import { Subscription } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User, UModes, ChannelsService, UserInfoService } from 'ircore';
import { UsersService } from 'src/app/utils/users.service';
import { ListElement } from '../../list/list.types';
import { LocalLabels } from 'src/app/utils/LocalLabels';
import { ContextElements, ContextElementsTypes, MenuElementData } from '../../context-menu/context.types';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit, OnDestroy {

  @Input() members: ListElement[] = [];
  @Input() channelName: string;

  private memberSubscription: Subscription;
  public menuElement: MenuElementData;
  public contextElements: ContextElements[] = [{type: ContextElementsTypes.WHOIS}];

  constructor(chanSrv: ChannelsService, private uSrv: UsersService, private uInfo: UserInfoService) {
    this.memberSubscription = chanSrv.membersChanged.subscribe((d: {channel: string, users: User[]}) => {
      if(d.channel === this.channelName) {
        this.recalcUsers(d.users, this.channelName);
      }
    })
  }

  ngOnInit(): void {

  }

  public recalcUsers(users: User[], channel: string) {
    this.members = [];
    users.sort((a: User, b: User) => a.nick.localeCompare(b.nick)).forEach(user => {
      const member = new ListElement();
      member.name = user.nick;
      member.labels = this.uSrv.getUserLabel(user.nick, channel);
      member.image = environment.hiranaTools + '/avatar?usr=' + user.nick;
      const voiceColor = '#4ecbe8';
      if(user.mode == UModes.FOUNDER) {
        this.uSrv.update(user.nick, channel, {
          name: LocalLabels.FOUNDER,
          background: '#4b3526',
          color: '#dea777',
          isLocal: true
        });
        member.color = voiceColor;
      }
      if(user.mode == UModes.ADMIN) {
        this.uSrv.update(user.nick, channel, {
          name: LocalLabels.ADMIN,
          background: '#3d264b',
          color: '#a977de',
          isLocal: true
        });
        member.color = voiceColor;
      }
      if(user.mode == UModes.OPER) {
        this.uSrv.update(user.nick, channel, {
          name: LocalLabels.OPER,
          background: '#2c4b26',
          color: '#79d87d',
          isLocal: true
        });
        member.color = voiceColor;
      }
      if(user.mode == UModes.HALFOPER) {
        this.uSrv.update(user.nick, channel, {
          name: LocalLabels.HOPER,
          background: '#26344b',
          color: '#779fde',
          isLocal: true
        });
        member.color = voiceColor;
      }
      if(user.mode == UModes.VOICE) {
        member.color = voiceColor;
      }
      this.members.push(member);
    });
  }

  ngOnDestroy() {
    this.memberSubscription.unsubscribe();
  }

  contextMenu(evt) {
    evt.ctx.preventDefault();
    console.log('context name: ', evt.elem.name);
    const labels = this.uSrv.getCachedOnly(this.uInfo.getNick(), this.channelName).filter(label => label.isLocal);
    if(labels.length > 0 && (labels[0].name == LocalLabels.FOUNDER || labels[0].name == LocalLabels.ADMIN || labels[0].name == LocalLabels.OPER || labels[0].name == LocalLabels.HOPER)) {
      this.contextElements = [{type: ContextElementsTypes.BAN}, {type: ContextElementsTypes.KICK, data: {channel: this.channelName}}, {type: ContextElementsTypes.VOICE, data: {channel: this.channelName}}, {type: ContextElementsTypes.WHOIS, data: {channel: this.channelName}}]
    } else {
      this.contextElements = [{type: ContextElementsTypes.WHOIS}];
    }
    this.menuElement = {
      target: evt.elem.name,
      posX: evt.ctx.clientX - 130,
      posY: evt.ctx.clientY + 25
    };
  }

}
