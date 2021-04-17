import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmoteList } from 'ircore';

@Component({
  selector: 'app-emote-list',
  templateUrl: './emote-list.component.html',
  styleUrls: ['./emote-list.component.scss']
})
export class EmoteListComponent implements OnInit {

  public readonly faces: string[] = EmoteList.faces;
  public readonly facesLocation: string = EmoteList.facesLocation;
  public readonly facesExtensions: string = EmoteList.facesExtension;
  public readonly memes: string[] = EmoteList.memes;
  public readonly memesLocation: string = EmoteList.memesLocation;
  public readonly memesExtensions: string = EmoteList.memesExtension;

  @Output() writeEmote: EventEmitter<string> = new EventEmitter<string>();

  public list: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
