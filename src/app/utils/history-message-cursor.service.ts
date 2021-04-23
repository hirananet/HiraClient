import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryMessageCursorService {

  private cursor = 0;
  private historyMesage: {[key: string]: string[]} = {};

  constructor() { }

  prev(key: string): string {
    if(!this.historyMesage[key]) return;
    if (this.historyMesage[key].length - this.cursor > 0) {
      this.cursor++;
    }
    return this.historyMesage[key][this.historyMesage[key].length - this.cursor];
  }

  next(key: string): string {
    if(!this.historyMesage[key]) return;
    if (this.cursor > 1) {
      this.cursor--;
      return this.historyMesage[key][this.historyMesage[key].length - this.cursor];
    } else {
      return '';
    }
  }

  save(message: string, key: string) {
    if(!this.historyMesage[key]) {
      this.historyMesage[key] = [];
    }
    this.historyMesage[key].push(message);
    if (this.historyMesage[key].length > environment.maxCommandHistory) {
      this.historyMesage[key].splice(0, 1);
    }
    this.cursor = 0;
  }
}
