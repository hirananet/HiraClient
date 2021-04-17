import { WhoisComponent } from './whois.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListModule } from 'src/app/sections/list/list.module';

const routes: Routes = [
  {
    path: '',
    component: WhoisComponent
  }
];

@NgModule({
  declarations: [
    WhoisComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ListModule
  ]
})
export class WhoisModule { }
