import { ChatComponent } from './chat.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatPartsModule } from 'src/app/sections/chat-parts/chat-parts.module';
import { AngularResizedEventModule } from 'angular-resize-event';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent
  }
];

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ChatPartsModule,
    AngularResizedEventModule
  ],
})
export class ChatModule { }
