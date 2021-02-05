import { AboutComponent } from './about.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  }
];

@NgModule({
  declarations: [
    AboutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class AboutModule { }
