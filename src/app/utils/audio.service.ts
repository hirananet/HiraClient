import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  public notifyAudioTag: HTMLAudioElement;
  public errorAudioTag: HTMLAudioElement;

  constructor() {
    this.notifyAudioTag = document.getElementById('globalNotifyAudioControl') as HTMLAudioElement;
    this.errorAudioTag = document.getElementById('globalErrorAudioControl') as HTMLAudioElement;
  }

  public playNotify() {
    this.notifyAudioTag.currentTime = 0;
    this.notifyAudioTag.play();
  }

  public playError() {
    this.errorAudioTag.currentTime = 0;
    this.errorAudioTag.play();
  }
}
