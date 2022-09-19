export const rpcUrl = "https://evm-t3.cronos.org/";

export const blockExplorer = {
  name: "Cronoscan",
  url: "https://testnet.cronoscan.com/",
};

export const cronosTestnet: Chain = {
  id: 338,
  name: "Cronos Testnet",
  network: "cronos",
  rpcUrls: {
    public: rpcUrl,
    default: rpcUrl
  },
  blockExplorers: {
    etherscan: blockExplorer,
    default: blockExplorer,
  },
  nativeCurrency: {
    name: "tCRO",
    symbol: "tCRO",
    decimals: 18,
  },
  testnet: true,
}

export const contractAddress = '0x37697f62166439Ee8bFAD1690f1D27A3C8a26B35';