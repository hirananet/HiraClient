// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { globalData } from './version';

export const environment = {
  production: false,
  electron: false,
  version: globalData.version,
  codename: globalData.codename,
  hiranaTools: 'https://thira.tandilserver.com',
  maxCommandHistory: 50,
  intervalWHOX: 10000,
  webIRCGateway: 'wss://wircg.tandilserver.com/webirc/websocket/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
