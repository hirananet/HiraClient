import { EventEmitter } from '@angular/core';

export class MenuSelectorEvent {
  public static readonly menuChange: EventEmitter<MenuElement> = new EventEmitter<MenuElement>();
}

export class MenuElement {
  type: MenuType;
  name: string;
}

export enum MenuType {
  PRIV_MSG,
  CHANNEL,
  MENU
}
