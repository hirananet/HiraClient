import { globalData } from './version';

export const environment = {
  production: true,
  prodEndpoint: 'https://web.hirana.net',
  electron: true,
  version: globalData.version+'-e',
  codename: globalData.codename,
  hiranaTools: 'https://thira.tandilserver.com',
  maxCommandHistory: 50,
  intervalWHOX: 10000,
  intervalPRIVPING: 60000,
  webIRCGateway: 'wss://wircg.tandilserver.com/webirc/websocket/',
  rockola: 'wss://rockola.hirana.net',
  ipstackApiKey: '',
  cacheLabels: 180000 // 3 minutos
};
