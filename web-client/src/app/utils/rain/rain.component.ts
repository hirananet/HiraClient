import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rain',
  templateUrl: './rain.component.html',
  styleUrls: ['./rain.component.scss']
})
export class RainComponent implements OnInit {

  public drops = Array(250).fill(0); // .map((x,i)=>i)

  public skin: string;

  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem('skinSelected')) {
      this.skin = localStorage.getItem('skinSelected');
    } else {
      this.skin = 'light';
    }
  }

}
