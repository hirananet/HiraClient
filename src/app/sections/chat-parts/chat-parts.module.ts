import { ContextMenuModule } from './../context-menu/context-menu.module';
import { EmoteListComponent } from './emote-list/emote-list.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListModule } from 'src/app/sections/list/list.module';
import { MessageItemComponent } from './message-item/message-item.component';
import { FormsModule } from '@angular/forms';
import { LinkVcardComponent } from './message-item/link-vcard/link-vcard.component';
import { SafePipe } from './message-item/safe.pipe';

@NgModule({
  declarations: [
    InfoPanelComponent,
    MessageItemComponent,
    LinkVcardComponent,
    EmoteListComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    ListModule,
    FormsModule,
    ContextMenuModule
  ],
  exports: [
    InfoPanelComponent,
    MessageItemComponent,
    LinkVcardComponent,
    EmoteListComponent
  ]
})
export class ChatPartsModule { }
