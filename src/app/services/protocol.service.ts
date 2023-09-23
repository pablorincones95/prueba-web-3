import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProtocolService {

  nodos: any[] = [
    "PancakeSwap (V2",
    "DODO (BSC)",
    "SushiSwap (BSC)",
    "OpenLeverage",
    "THENA",
    "Ethereum",
    "Conflux",
    "Bittorrent",
    "1inch network",
    "Mask Network",
    "Ankr",
    "Nexo",
    "Ledn",
    "Lendingblock",
    "CoinLoan",
    "Blockfi",
    "Kraken",
    "Bitmart",
    "Bitrue",
    "Digifinex",
    "Phemex",
    "Deeper Network",
    "Pocket Network",
    "CURVE",
    "Synthetix",
    "Flamincome",
    "Swerve",
    "Fortube",
  ];

  constructor() { }


  /**
   * 
   * @returns 
   */
  getData() {
    const nodoProtocolo = this.nodos[Math.floor(Math.random() * this.nodos.length)];
    const id = this.generarHash();
    const fecha = this.generarFecha();
    const amount = this.generarMonto(100, 300000);
    const reward = this.generarRecompensa(0.00005, 0.005);

    return {
      nodoProtocolo,
      id,
      fecha,
      amount,
      reward,
    };
  }


  /**
   * 
   * @returns 
   */
  generarHash() {
    // Generar una cadena aleatoria de 32 caracteres hexadecimal para simular un hash.
    const caracteres = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 32; i++) {
      hash += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return hash;
  }

  /**
   * 
   * @returns 
   */
  generarFecha() {
    // Generar una fecha aleatoria entre el 1 de enero de 2021 y el 14 de abril de 2023.
    const fechaInicial = new Date().getTime();
    const fechaFinal = new Date().getTime();
    const fechaAleatoria = new Date(Math.random() * (fechaFinal - fechaInicial) + fechaInicial);
    return fechaAleatoria.toLocaleDateString();
  }

  /**
   * 
   * @param minimo 
   * @param maximo 
   * @returns 
   */
  generarMonto(minimo: number, maximo: number) {
    // Generar un número aleatorio entre un rango de montos especificado.
    const montoAleatorio = Math.random() * (maximo - minimo) + minimo;
    return montoAleatorio.toFixed(2);
  }

  /**
   * 
   * @param minimo 
   * @param maximo 
   * @returns 
   */
  generarRecompensa(minimo: number, maximo: number) {
    // Generar un número aleatorio entre un rango de recompensas especificado.
    const recompensaAleatoria = Math.random() * (maximo - minimo) + minimo;
    return (recompensaAleatoria * 100).toFixed(5) + '%';
  }
}
