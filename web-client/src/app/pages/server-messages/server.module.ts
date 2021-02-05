import { ServerMessagesComponent } from './server-messages.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: ServerMessagesComponent
  }
];

@NgModule({
  declarations: [
    ServerMessagesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
})
export class ServerModule { }
