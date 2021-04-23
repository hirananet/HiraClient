import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import { Label } from '../sections/list/list.types';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public usersLabels: {[key: string]: {[key: string]:Label[]}} = {};
  public expireLabels: {[key: string]: {[key: string]:number}} = {};

  constructor(private httpC: HttpClient) { }

  public getUserLabel(user: string, chn: string): Label[] {

    if(!this.usersLabels[user]) {
      this.usersLabels[user] = {};
      this.expireLabels[user] = {};
    }
    if(!this.usersLabels[user][chn]) {
      this.usersLabels[user][chn] = [];
    }

    const cached =  this.expireLabels[user][chn] &&
                    this.expireLabels[user][chn] >= (new Date()).getTime();

    if(!cached) {
      this.expireLabels[user][chn] = (new Date()).getTime() + environment.cacheLabels;
      this.httpC.get(environment.hiranaTools + '/customr?usr='+user+'&chn='+chn).pipe(first()).subscribe((d: {exists: boolean, results: {color: string, rango: string}[]}) => {
        if(!d.exists) return;
        // clean:
        const len = this.usersLabels[user][chn].length - 1;
        for(let i = len; i>=0; i--) {
          if(d.results.findIndex(dN => dN.rango == this.usersLabels[user][chn][i].name) < 0 && !this.usersLabels[user][chn][i].isLocal) {
            this.usersLabels[user][chn].splice(i,1);
          }
        }

        // add news:
        d.results.forEach(dN => {
          if(this.usersLabels[user][chn].findIndex(qN => qN.name == dN.rango) < 0) {
            this.usersLabels[user][chn].push({
              background: 'black',
              color: dN.color,
              name: dN.rango,
              isLocal: false
            });
          }
        });
      });
    }

    return this.usersLabels[user][chn];
  }

  public update(user: string, chn: string, newLabel: Label) {
    if(this.usersLabels[user][chn].findIndex(label => label.name == newLabel.name) < 0){
      this.usersLabels[user][chn].push(newLabel);
    }
  }

  public getCachedOnly(user: string, chn: string) {
    return this.usersLabels[user][chn];
  }


}
