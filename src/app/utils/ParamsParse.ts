export class ParamParse {
  public static parametria: URLHash;
  public static parseHash(hash: string) {
    const urh = new URLHash();
    const parts = hash.split(';');
    parts.forEach(part => {
      const kv = part.split('=');
      urh[kv[0]] = kv[1];
    });
    this.parametria = urh;
  }
}

export class URLHash {
  [key: string]: string;
}
