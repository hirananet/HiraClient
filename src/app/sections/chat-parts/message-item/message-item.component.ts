import { UsersService } from 'src/app/utils/users.service';
import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericMessage, Quote, ValidRegex } from 'ircore';
import { Label } from '../../list/list.types';
import { MenuElementData } from '../../context-menu/context.types';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {

  @Input() messageType: MessagesTypes;
  @Input() message: GenericMessage;
  @Output() quote: EventEmitter<Quote> = new EventEmitter<Quote>();
  public menuElement: MenuElementData;
  public badges: Label[];

  constructor(private router: Router, private uSrv: UsersService) { }

  ngOnInit(): void {
  }

  quotear() {
    const q = new Quote();
    q.author = this.message.author.user;
    q.quote = this.message.message;
    const prevQuote = ValidRegex.quoteRegex(this.message.message);
    if(prevQuote) {
      q.quote = prevQuote[3];
    }
    this.quote.emit(q);
  }

  openPM(nick:string) {
    this.router.navigateByUrl('/priv/' + nick);
  }

  getBadges(user: string): Label[] {
    if(!this.badges) {
      this.badges = this.uSrv.getUserLabel(user, this.message.target ? this.message.target : '$private');
    } else {
      return this.badges;
    }
  }

  contextMenu(evt, target) {
    evt.preventDefault();
    this.menuElement = {
      target: target,
      posX: evt.clientX - 130,
      posY: evt.clientY + 25
    };
  }

}

export enum MessagesTypes {
  MESSAGE_RAW,
  ACTION_ME,
  NOTIFY
}
