import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericMessage, Quote } from 'ircore';
import { MenuElementData } from '../../context-menu/context-menu.component';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  quotear() {
    const q = new Quote();
    q.author = this.message.author.user;
    q.quote = this.message.message;
    this.quote.emit(q);
  }

  openPM(nick:string) {
    this.router.navigateByUrl('/priv/' + nick);
  }


  contextMenu(evt) {
    evt.ctx.preventDefault();
    this.menuElement = {
      target: evt.elem.name,
      posX: evt.ctx.clientX - 130,
      posY: evt.ctx.clientY + 25
    };
  }

}

export enum MessagesTypes {
  MESSAGE_RAW,
  ACTION_ME,
  NOTIFY
}
