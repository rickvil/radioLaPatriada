// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  contentServer: 'http://www.fmlapatriada.com.ar/aplicacion',
  streamURL: 'http://server4.stweb.tv:1935/lapatriada/live/playlist.m3u8',
  // streamURL: 'http://www.stweb.tv/clientes/lapatriada',

// Make config variables global
  server: 'http://www.fmlapatriada.com.ar/aplicacion',
  facebook: 'https://www.facebook.com/fmlapatriada',
  twitter: 'FMLaPatriada',
  web: 'http://www.fmlapatriada.com.ar/',
  email: 'info@fmlapatriada.com.ar',
  isPlaying: false,
  whatsapp: 'https://api.whatsapp.com/send?phone=5491122349672&text=Saludos%20Radio%20La%20Patriada',
  btnCustomLink: 'http://www.fmlapatriada.com.ar'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
