import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EmoteList } from 'ircore';

@Component({
  selector: 'app-emote-list',
  templateUrl: './emote-list.component.html',
  styleUrls: ['./emote-list.component.scss']
})
export class EmoteListComponent implements OnInit {

  public faces: string[] = EmoteList.faces;
  public readonly _faces: string[] = EmoteList.faces;
  public readonly facesLocation: string = EmoteList.facesLocation;
  public readonly facesExtensions: string = EmoteList.facesExtension;
  public readonly _memes: string[] = EmoteList.memes;
  public memes: string[] = EmoteList.memes;
  public readonly memesLocation: string = EmoteList.memesLocation;
  public readonly memesExtensions: string = EmoteList.memesExtension;

  public searchQuery: string;

  @Output() writeEmote: EventEmitter<string> = new EventEmitter<string>();
  @Output() closePopup: EventEmitter<void> = new EventEmitter<void>();

  public list: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  ku(evt) {
    this.memes = this._memes.filter(meme => meme.indexOf(this.searchQuery) >= 0);
    this.faces = this._faces.filter(face => face.indexOf(this.searchQuery) >= 0);
  }

}
