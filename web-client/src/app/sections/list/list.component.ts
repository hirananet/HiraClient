import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WhoStatusService } from 'ircore';

@Component({
  selector: 'app-menu-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() title: string;
  @Input() elements: ListElement[] = [];
  @Input() closable: boolean;
  @Input() path: string;
  @Input() selected: string;
  @Input() type: string;
  @Output() close: EventEmitter<ListElement> = new EventEmitter<ListElement>();
  @Output() contextMenu: EventEmitter<{ctx: Event, elem: ListElement}> = new EventEmitter<{ctx: Event, elem: ListElement}>();

  constructor(private router: Router, public whoStatus: WhoStatusService) { }

  ngOnInit(): void {
  }

  open(elem: ListElement) {
    elem.notify = false;
    elem.warn = false;
    this.router.navigateByUrl(this.path + elem.name);
  }

  doClose(elem: ListElement) {
    this.close.emit(elem);
  }

  ctxMenu(ctx: Event, elem: ListElement) {
    this.contextMenu.emit({
      ctx,
      elem
    });
  }

}

export class ListElement {
  name: string;
  notify: boolean;
  warn: boolean;
  image?: string;
  active: boolean;
  labels?: Label[];
  color?: string;
}

export interface Label {
  name: string;
  color: string;
  background: string;
}
