import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryMessageCursorService {

  private cursor = 0;
  private historyMesage: string[] = [];

  constructor() { }

  prev(): string {
    if (this.historyMesage.length - this.cursor > 0) {
      this.cursor++;
    }
    return this.historyMesage[this.historyMesage.length - this.cursor];
  }

  next(): string {
    if (this.cursor > 1) {
      this.cursor--;
      return this.historyMesage[this.historyMesage.length - this.cursor];
    } else {
      return '';
    }
  }

  save(message: string) {
    this.historyMesage.push(message);
    if (this.historyMesage.length > environment.maxCommandHistory) {
      this.historyMesage.splice(0, 1);
    }
    this.cursor = 0;
  }
}
