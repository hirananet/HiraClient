import { EmoteList } from 'ircore';
import { RockolaService } from '../rockola/rockola.service';

declare var startEventEffect: any;
declare var startEventEffectRegalo: any;
declare var startEventEffectMeteor: any;
declare var startEventEffectCabritas: any;
declare var startEventEffectPrimavera: any;
declare var startEventEffectVerano: any;
declare var startEventEffectOtono: any;
declare var startEventEffectKz2s: any;

export class CustomEmoteList {

  public static setSpecialFaces() {

    EmoteList.facesLocation = 'assets/faces/';
    EmoteList.specialLocation = 'assets/specials/';
    EmoteList.memesLocation = 'assets/em-mem/';

    EmoteList.specialFaces = {
      'Gabriela-': [
        'regla',
        'magico',
        'stamp'
      ],
      Alex: [
        'stamp'
      ]
    };

    EmoteList.faces = [
      'aaa',
      'break',
      'chaky',
      'challenge',
      'cry',
      'ehh',
      'facepalm',
      'fap',
      'fffpf',
      'fu',
      'fuckyeah',
      'genius',
      'hmmm',
      'hpm',
      'jij',
      'laugh',
      'LOL',
      'magicBook',
      'magicCircle',
      'magicDrug',
      'magichat',
      'no',
      'oka',
      'rage',
      'siuu',
      'sparkle',
      'stickmagic',
      'stickmagic2',
      'trollface',
      'mog',
      'why',
      'WitchHat',
      'yao',
      'true',
      'amazing',
      'forever',
      'notbad',
      'brindis',
      'buttcoin',
      'cigar',
      'cigar2',
      'coffee',
      'coffee2',
      'coffee3',
      'goatman',
      'hacker',
      'service',
      'stick',
      'wine',
      'wineBottle',
      'escoba',
      'principito',
      'baskerville',
      'cumple',
      'cumple2',
      'abrazo',
      'agua1',
      'agua2',
      'angry',
      'barco',
      'eagle',
      'fatcat',
      'fox',
      'handshake',
      'kiss',
      'rose',
      'tarta',
      'te',
      'whisky',
      'zumo',
      'burger',
      'candy',
      'caniche',
      'celtic',
      'coca',
      'editorial',
      'gaviota',
      'goat',
      'icecream',
      'listado',
      'magicwind',
      'medal',
      'musical',
      'palette',
      'pizza',
      'podium',
      'batido',
      'fresas',
      'wizard',
      'xane',
      'banana',
      'beer',
      'bigSmile',
      'cascada',
      'clap',
      'cronometro',
      'demon',
      'fuego',
      'fugaz',
      'ghost',
      'ghost2',
      'greenApple',
      'hira',
      'invitado',
      'kiwi',
      'leprechaun',
      'littleSmile',
      'mandarina',
      'mate',
      'mendikus',
      'miranda',
      'miranda2',
      'morido',
      'netsplit',
      'orange',
      'peach',
      'pera',
      'redApple',
      'sad1',
      'sad2',
      'shinningStar',
      'silbando',
      'tos',
      'vicximus',
      'vicximus2',
      'vientomagico1',
      'visitante',
      'warrior',
      'watermelon',
      'waterwoman',
      'zombie',
      'zombie2',
      'milk',
      'arcoiris'
    ];

    EmoteList.memes = [
      'baneo',
      'baneo2',
      'baneo3',
      'buscar',
      'buscar2',
      'comunicacion',
      'despedida',
      'expulsar',
      'hacker',
      'hacker2',
      'hacker3',
      'hacker4',
      'hacker5',
      'hacker6',
      'hacker7',
      'hacker8',
      'hacker9',
      'hacker10',
      'hacker11',
      'hacker12',
      'impuestos',
      'impuestos2',
      'llegada',
      'magia',
      'magia2',
      'magia3',
      'magia4',
      'magia5',
      'magia6',
      'nopreguntas',
      'nopreguntas2',
      'topic',
      'topic2',
      'morido'
    ];

    EmoteList.effectChecker = (name: string, author: string, channel: string) => {
      if(name == 'playlist') {
        RockolaService.detectedPlaylist.emit(channel);
        return EmoteList.specialLocation + 'playlist' + EmoteList.facesExtension;
      }
      if (author === 'Gabriela-') {
        if (name === 'magia') {
          startEventEffect();
        }
        if (name === 'primavera') {
          startEventEffectPrimavera();
        }
        if (name === 'verano') {
          startEventEffectVerano();
        }
        if (name === 'otono') {
          startEventEffectOtono();
        }
        if (name === 'cabritas') {
          startEventEffectCabritas();
        }
        if (name === 'regalos') {
          startEventEffectRegalo();
        }
        if (name === 'lluvia') {
          startEventEffectMeteor();
        }
        if (name === 'kz2') {
          startEventEffectKz2s();
          return EmoteList.facesLocation + 'kiss' + EmoteList.facesExtension;
        }
        return undefined;
      } else if (author === 'Alex' || author === 'Tulkalex' || author === 'Tulkalen') {
        if (name === 'kz2') {
          startEventEffectKz2s(); // Probando
          return EmoteList.facesLocation + 'kiss' + EmoteList.facesExtension;
        }
        return undefined;
      }
      return undefined;
    };

  }

}
