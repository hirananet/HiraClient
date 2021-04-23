
export class ContextElements {
  type: ContextElementsTypes;
  data?: any;
}

export enum ContextElementsTypes {
  WHOIS = 'whois',
  BAN = 'ban',
  KICK = 'kick',
  VOICE = 'voice'
}

export class MenuElementData {
  target: string;
  posX: number;
  posY: number;
}
