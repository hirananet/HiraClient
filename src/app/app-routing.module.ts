import { ConnectedGuard } from './pages/connected.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)},
  { path: 'chat', loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule), canActivate: [ConnectedGuard]},
  { path: 'chat/:channel', loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatModule), canActivate: [ConnectedGuard]},
  { path: 'priv/:nick', loadChildren: () => import('./pages/privmsg/privmsg.module').then(m => m.PrivmsgModule), canActivate: [ConnectedGuard]},
  { path: 'user', loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)},
  { path: 'server', loadChildren: () => import('./pages/server-messages/server.module').then(m => m.ServerModule), canActivate: [ConnectedGuard]},
  { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule)},
  { path: 'whois', loadChildren: () => import('./pages/whois/whois.module').then(m => m.WhoisModule), canActivate: [ConnectedGuard]},
  { path: 'whois/:nick', loadChildren: () => import('./pages/whois/whois.module').then(m => m.WhoisModule), canActivate: [ConnectedGuard]},
  { path: 'canales', loadChildren: () => import('./pages/canales/canales.module').then(m => m.CanalesModule), canActivate: [ConnectedGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
