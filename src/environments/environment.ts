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
  API_KEY_BSC: "4S2UBP9NC7GS85BUV4HIJ76HNV73AY8YNH",

  configUrlAbi: "/assets/abi/erc721s.json",
  firebase: {
    apiKey: "AIzaSyAYiUcHPJHWQu-MDabRVSEXB7wg8__aHKc",
    authDomain: "nexchain-4a28a.firebaseapp.com",
    projectId: "nexchain-4a28a",
    storageBucket: "nexchain-4a28a.appspot.com",
    messagingSenderId: "318604614914",
    appId: "1:318604614914:web:d5a86a5dff65b10a48361b",
    measurementId: "G-72025WRG47",
  },

  // DEV
  contractAddress: "0xD1baBb615d85141271054898263082f574a594be",
  walletRoot: "0x78303360ec1ACA06F195f48F75D6D59107810Dff",
  API_GEMYN:
    "https://devgplay.codibpo.site/api/controllers/pasarelas/Gplay/status.php",
  url_redirecion: "https://devgplay.codibpo.site/",
  AUTH_KEY_GEMYN_API: "1f7ad89017b43a27a97747a0d0967662",
  urlTokenLogo: "#",
  mainToken: {
    contract: "#",
    name: "#",
    symbol: "#",
    decimals: 18,
  },
  chain: {
    walletConnectID: "4af18cacaeb09f42b4d325033743f639",
    infuraId: "356256bc3fcf42de88d2bc2e129ea5d9",

    // Testnet
    // chainId: 97,
    // chainIdMetamask: "0x61",
    // chainName: "BNB Smart Chain Testnet",
    // rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    // rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    // blockExplorerUrls: ["https://testnet.bscscan.com/"],

    // Mainnnet
    chainId: 56,
    chainIdMetamask: "0X38",
    chainName: "BNB Smart Chain Mainnet",
    rpc: "https://nd-971-625-219.p2pify.com/24a342434e8d90b2f9ba75134d971c6e",
    rpcUrls: [
      "https://nd-971-625-219.p2pify.com/24a342434e8d90b2f9ba75134d971c6e",
    ],
    blockExplorerUrls: ["https://bscscan.com/"],
    scan: "https://bscscan.com/tx/",
    scanNft: "https://bscscan.com/token/",

    nativeCurrency: {
      web3ModalNetwork: "binance",
      network: "BNB",
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },

  /**
   * PROD
   */
  // production: false,
  // dbPrefix: "prod_",
  // seedKey: "PROD_NEXCHAIN_2023$$**$%&",

  // projectName: "NEXCHAIN",
  // // API_URL: 'https://nexchain-4a28a.uc.r.appspot.com',
  // API_URL: 'https://3-dot-nexchain-4a28a.uc.r.appspot.com',
  // urlWeb: 'https://dev-nexchain.web.app',
  // configUrlAbi: "/assets/abi/erc721s.json",
  // firebase: {
  //   apiKey: "AIzaSyAYiUcHPJHWQu-MDabRVSEXB7wg8__aHKc",
  //   authDomain: "nexchain-4a28a.firebaseapp.com",
  //   projectId: "nexchain-4a28a",
  //   storageBucket: "nexchain-4a28a.appspot.com",
  //   messagingSenderId: "318604614914",
  //   appId: "1:318604614914:web:d5a86a5dff65b10a48361b",
  //   measurementId: "G-72025WRG47"
  // },

  // // DEV
  // contractAddress: "0x48dE3DfEA72526fE13fa8DEb4C3bA3443E538267",
  // // PROD
  // // contractAddress: "0xdcbF61d8D67C5CC267e29b7FC477917E6e2e588F",

  // contractAddressNCW: "0xB5024DaC9973aaDDfF88cBC9DDE0fd07234Bbd6d", // smart contract provisional de retiro de NCW PROD

  // urlTokenLogo: "#",
  // mainToken: {
  //   contract: "#",
  //   name: "#",
  //   symbol: "#",
  //   decimals: 18,
  // },
  // chain: {
  //   infuraId: "356256bc3fcf42de88d2bc2e129ea5d9",

  //   // Testnet
  //   chainId: 97,
  //   chainIdMetamask: "0x61",
  //   chainName: "BNB Smart Chain Testnet",
  //   rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  //   rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  //   blockExplorerUrls: ["https://testnet.bscscan.com/"],

  //   // Mainnnet
  //   // chainId: 56,
  //   // chainIdMetamask: "0X38",
  //   // chainName: "BNB Smart Chain Mainnet",
  //   // rpc: "https://rpc-bsc.bnb48.club/",
  //   // rpcUrls: ["https://bsc-dataseed1.defibit.io/"],
  //   // blockExplorerUrls: ["https://bscscan.com/"],
  //   // scan: "https://bscscan.com/tx/",
  //   // scanNft: "https://bscscan.com/token/",

  //   nativeCurrency: {
  //     web3ModalNetwork: "binance",
  //     network: "BNB",
  //     name: "BNB",
  //     symbol: "BNB",
  //     decimals: 18,
  //   },

  // },
};

/**
 * TODO: ambiente de producción
 */
// export const environment = {
//   production: false,
//   dbPrefix: "prod_",
//   seedKey: "PROD_NEXCHAIN_2023$$**$%&",

//   projectName: "NEXCHAIN",
//   API_URL: 'https://nexchain-4a28a.uc.r.appspot.com',
//   urlWeb: 'https://nexchain.io',
//   configUrlAbi: "/assets/abi/erc721s.json",
//   firebase: {
//     apiKey: "AIzaSyAYiUcHPJHWQu-MDabRVSEXB7wg8__aHKc",
//     authDomain: "nexchain-4a28a.firebaseapp.com",
//     projectId: "nexchain-4a28a",
//     storageBucket: "nexchain-4a28a.appspot.com",
//     messagingSenderId: "318604614914",
//     appId: "1:318604614914:web:d5a86a5dff65b10a48361b",
//     measurementId: "G-72025WRG47"
//   },

//   contractAddress: "0x238dA21360846C5b4289017540E80a38A643Aa6c",
//   contractAddressNCW: "0xbBC92e10Ee21626B50D096B6D0191b70cA2aB78C", // smart contract provisional de retiro de NCW

//   urlTokenLogo: "#",
//   mainToken: {
//     contract: "#",
//     name: "#",
//     symbol: "#",
//     decimals: 18,
//   },
//   chain: {
//     infuraId: "356256bc3fcf42de88d2bc2e129ea5d9",

//     chainId: 56,
//     chainIdMetamask: "0X38",
//     chainName: "BNB Smart Chain Mainnet",
//     rpc: "https://nd-362-654-807.p2pify.com/2daf8dd874deca4f438089a565047771",
//     rpcUrls: ["https://nd-362-654-807.p2pify.com/2daf8dd874deca4f438089a565047771"],
//     blockExplorerUrls: ["https://bscscan.com/"],
//     scan: "https://bscscan.com/tx/",
//     scanNft: "https://bscscan.com/token/",

//     nativeCurrency: {
//       web3ModalNetwork: "binance",
//       network: "BNB",
//       name: "BNB",
//       symbol: "BNB",
//       decimals: 18,
//     },
//   },
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
