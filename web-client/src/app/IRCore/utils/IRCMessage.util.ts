export class OriginData {
  public nick?: string;
  public identitity?: string;
  public server: string;
}

export class IRCMessage {
  public origin: OriginData;
  public simplyOrigin: string;
  public code: string;
  public target: string;
  public message: string;
  public tag?: string;
  public body?: string;
  public partials?: string[];
}
