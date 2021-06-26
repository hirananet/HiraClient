import { RainEvent } from './rain/rain.event';
import { EmoteList } from 'ircore';

declare var startEventEffect: any;
declare var startEventEffectRegalo: any;
declare var startEventEffectMeteor: any;
declare var startEventEffectCabritas: any;
declare var startEventEffectPrimavera: any;
declare var startEventEffectVerano: any;
declare var startEventEffectOtono: any;
declare var startEventEffectKz2s: any;
declare var startEventEffectGatosPerros: any;
declare var startEventEffectBarkito: any;
declare var addBarkitoEffect: any;

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
      'abrazo',
      'agua',
      'agua1',
      'amigos',
      'amor',
      'aplauso',
      'arcoiris',
      'b612',
      'banana',
      'barco',
      'baskervielle',
      'batalla',
      'batido',
      'bicho',
      'birra',
      'break',
      'brindis',
      'bruja',
      'buttcoin',
      'cabrita',
      'cafe',
      'cafe1',
      'caniche',
      'caramelo',
      'cascada',
      'celtic',
      'chaky',
      'chicocabra',
      'cigarro',
      'cigarro2',
      'coca',
      'comer',
      'comida',
      'cortado',
      'cronometro',
      'cumple',
      'cumple2',
      'circulomag',
      'demonio',
      'desafio',
      'duende',
      'durazno',
      'editorial',
      'ehh',
      'enojo',
      'escoba',
      'estrella',
      'fantasma',
      'fantasma1',
      'fap',
      'feliz',
      'fenix',
      'fffpf',
      'fresas',
      'fu',
      'fuego',
      'fugaz',
      'furia',
      'gato',
      'gaviota',
      'genius',
      'gnomo',
      'goat',
      'gotitas',
      'guerrero',
      'hacker',
      'hamburguesa',
      'hechizado',
      'hechizo',
      'helado',
      'hira',
      'hirana',
      'hmmm',
      'hpm',
      'invierno',
      'invitado',
      'jiji',
      'kiss',
      'kiwi',
      'kz2',
      'laugh',
      'leche',
      'leprechaun',
      'libromagico',
      'listado',
      'llorando',
      'llorar',
      'LOL',
      'madremia',
      'magia',
      'magichat',
      'mago',
      'mandarina',
      'manzana',
      'manzana1',
      'mate',
      'medalla',
      'mendikus',
      'miranda',
      'mog',
      'morido',
      'mujeragua',
      'musical',
      'muyhechizado',
      'naranja',
      'netsplit',
      'no',
      'notbad',
      'oka',
      'olitas',
      'ooo',
      'otono',
      'paleta',
      'pera',
      'pizza',
      'pocion',
      'podium',
      'polsaker',
      'porsiempre',
      'primavera',
      'principito',
      'prohibido',
      'puente',
      'regalos',
      'resucitado',
      'rosa',
      'sandia',
      'servicio',
      'silbando',
      'silencio',
      'silencioUC',
      'siuu',
      'sonrisa',
      'stalker',
      'tarta',
      'te',
      'tos',
      'triste',
      'troll',
      'trollface',
      'true',
      'underc0de',
      'varita',
      'varita2',
      'veneno',
      'verano',
      'vicximus',
      'vientomag',
      'vientomagico1',
      'vino',
      'vinobot',
      'visitante',
      'vudu',
      'whisky',
      'why',
      'xane',
      'yao',
      'zombie',
      'zorro',
      'zumo',
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
        if (name === 'gotitas') {
          RainEvent.rainShow.emit(true);
        }
        if (name === 'kz2') {
          startEventEffectKz2s();
        }
        if (name === 'olitas') {
          startEventEffectBarkito();
        }
        if (name === 'batalla') {
          startEventEffectGatosPerros();
        }
      } else if (author === 'Alex' || author === 'Tulkalex' || author === 'Tulkalen') {
        if (name === 'kz2') {
          startEventEffectKz2s(); // Probando
        }
        if (name === 'olitas') {
          startEventEffectBarkito();
        }
      }
      if(name === 'barco') {
        addBarkitoEffect();
      }
    };

  }

}
