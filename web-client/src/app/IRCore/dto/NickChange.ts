export class NickChange {
  oldNick: string;
  newNick: string;
  constructor(old: string, nnick: string) {
    this.oldNick = old;
    this.newNick = nnick;
  }
}
