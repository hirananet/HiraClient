import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRCoreService } from 'ircore';
import { ContextElements, ContextElementsTypes } from './context.types';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  @Input() posY: number;
  @Input() posX: number;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Input() target: string;
  @Input() elements: ContextElements[] = [];

  constructor(private ircSrv: IRCoreService) { }

  ngOnInit(): void {
  }

  elementClicked(elem: ContextElements) {
    if(elem.type === ContextElementsTypes.WHOIS) {
      this.whois(this.target);
    }
    if(elem.type === ContextElementsTypes.BAN) {
      const reason = prompt('Message for user');
      this.ircSrv.sendMessageOrCommand('/cs BAN #' + elem.data.channel + ' ' + this.target + ' ' + reason);
    }
    if(elem.type === ContextElementsTypes.KICK) {
      this.ircSrv.sendMessageOrCommand('/kick #' + elem.data.channel + ' ' + this.target);
    }
    if(elem.type === ContextElementsTypes.VOICE) {
      this.ircSrv.sendMessageOrCommand('/cs flags #' + elem.data.channel + ' ' + this.target + ' +V');
    }
  }

  whois(nick) {
    this.ircSrv.sendMessageOrCommand('/whois ' + nick);
  }

}
