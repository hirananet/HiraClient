import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IRCoreService } from 'ircore';

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

  elementClicked(elem) {
    if(elem === ContextElements.WHOIS) {
      this.whois(this.target);
    }
  }

  whois(nick) {
    this.ircSrv.sendMessageOrCommand('/whois ' + nick);
  }

}

export enum ContextElements {
  WHOIS = 'whois'
}

export class MenuElementData {
  target: string;
  posX: number;
  posY: number;
}
