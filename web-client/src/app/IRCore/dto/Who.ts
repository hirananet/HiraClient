import { UModes } from './../utils/UModes.utils';

export class Who {
  serverFrom: string;
  nick: string;
  isNetOp: boolean;
  isAway: boolean;
  rawMsg: string;
  mode: UModes;
}
