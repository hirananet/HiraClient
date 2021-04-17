import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MenuSelectorEvent, MenuType } from 'src/app/sections/menu/menu-selector.event';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  codename = environment.codename;
  version = environment.version;

  constructor(private titleSrv: Title) { }

  ngOnInit(): void {
    // FIXME: mover a guard:
    MenuSelectorEvent.menuChange.emit({
      type: MenuType.MENU,
      name: 'about'
    });
    this.titleSrv.setTitle('Versiones | HiraClient');
  }

}
