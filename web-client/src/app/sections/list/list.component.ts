import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WhoStatusService } from 'src/app/IRCore/services/who-status.service';

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
