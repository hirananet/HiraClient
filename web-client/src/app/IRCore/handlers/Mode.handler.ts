import { EventEmitter } from '@angular/core';
import { NewMode } from '../dto/NewMode';
import { ValidRegex } from '../utils/validRegex';

/**
 * Clase para gestionar los cambios de modos en un canal (sobre un usuario)
 */

export class ModeHandler {

  public static readonly modeChange: EventEmitter<NewMode> = new EventEmitter<NewMode>();

  public static modeParser(rawMessage: string): string[] {
    let modeRaw = rawMessage.split(' MODE ')[1];
    if(modeRaw.indexOf('#') == -1) {
      const modeCut = modeRaw.split(':');
      const regex = ValidRegex.getRegex(ValidRegex.modeRegex()).exec(modeCut[1]);
      return [
        undefined,
        regex[1], // + o -
        regex[2].trim(), // modo
        modeCut[0].trim() // usuario
      ];
    } else {
      const regex = ValidRegex.channelRegex()+
      '\\s'+ValidRegex.modeRegex()+'\\s\\:?'+ // modos
      ValidRegex.userRegex();
      const regOut = ValidRegex.getRegex(
        regex
      ).exec(modeRaw);
      if(regOut) {
        return [
          undefined,
          regOut[2],
          regOut[3].trim(),
          regOut[4]
        ];
      } else {
        // modo de canal?
        const modos = modeRaw.split(':');
        return [
          undefined,
          undefined,
          modos[1],
          undefined
        ]
      }
    }
  }

  public static changeMode(mode: NewMode) {
    this.modeChange.emit(mode);
  }

}
