import { Component, OnInit } from '@angular/core';
import { RainEvent } from './rain.event';

@Component({
  selector: 'app-rain',
  templateUrl: './rain.component.html',
  styleUrls: ['./rain.component.scss']
})
export class RainComponent implements OnInit {

  rainEffect: boolean = false;

  public drops = Array(250).fill(0); // .map((x,i)=>i)

  public skin: string;

  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('skinSelected')) {
      this.skin = localStorage.getItem('skinSelected');
    } else {
      this.skin = 'light';
    }
    RainEvent.rainShow.subscribe(r => {
      this.rainEffect = r;
      if(r) {
        setTimeout(() => {
          this.rainEffect = false;
        }, 30000);
      }
    });
  }

}
