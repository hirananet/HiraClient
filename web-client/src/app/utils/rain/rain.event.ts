import { EventEmitter } from '@angular/core';

export class RainEvent {
  public static readonly rainShow: EventEmitter<boolean> = new EventEmitter<boolean>();
}
