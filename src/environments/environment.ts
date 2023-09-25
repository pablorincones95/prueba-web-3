// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  /**
   * DEV
   */
  production: false,
  dbPrefix: "dev_",
  projectName: "prueba-web=3",
  firebase: {
    apiKey: "AIzaSyADgeci6zXBbe3fy4kQWOCb-wtroyYrSsE",
    authDomain: "prueba-web-3-d0d9b.firebaseapp.com",
    projectId: "prueba-web-3-d0d9b",
    storageBucket: "prueba-web-3-d0d9b.appspot.com",
    messagingSenderId: "597985723991",
    appId: "1:597985723991:web:86b149ff43c998e928c512",
    measurementId: "G-6CSH6BG6M3",
  },

  // DEV
  contractAddress: "0xD1baBb615d85141271054898263082f574a594be",

  urlTokenLogo: "#",
  mainToken: {
    contract: "#",
    name: "#",
    symbol: "#",
    decimals: 18,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
