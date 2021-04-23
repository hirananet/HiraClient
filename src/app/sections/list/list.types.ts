export class ListElement {
  name: string;
  notify: boolean;
  warn: boolean;
  image?: string;
  active: boolean;
  labels?: Label[];
  color?: string;
}

export interface Label {
  name: string;
  color: string;
  background: string;
  isLocal: boolean;
}
