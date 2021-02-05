import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-canales',
  templateUrl: './canales.component.html',
  styleUrls: ['./canales.component.scss']
})
export class CanalesComponent implements OnInit {

  constructor(private titleSrv: Title) { }

  ngOnInit(): void {
    this.titleSrv.setTitle('Lista de canales | HiraClient');
  }

}
