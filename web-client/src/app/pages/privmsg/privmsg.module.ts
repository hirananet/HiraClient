import { PrivmsgComponent } from './privmsg.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatPartsModule } from 'src/app/sections/chat-parts/chat-parts.module';

const routes: Routes = [
  {
    path: '',
    component: PrivmsgComponent
  }
];

@NgModule({
  declarations: [
    PrivmsgComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ChatPartsModule
  ],
})
export class PrivmsgModule { }
