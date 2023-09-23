import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public PACKAGES = [
    {
      label: "Paquete 1",
      price: 500,
      currency: "usd",
      image: "assets/img/packages/package-1-2.png",
      priceClass: "",
      buttonClass: ""
    },
    {
      label: "Paquete 2",
      price: 1000,
      currency: "usd",
      image: "assets/img/packages/package-1-2.png",
      priceClass: "",
      buttonClass: ""
    },
    {
      label: "Paquete 3",
      price: 1500,
      currency: "usd",
      image: "assets/img/packages/package-3.png",
      priceClass: "",
      buttonClass: ""
    },
    {
      label: "Paquete 4",
      price: 2000,
      currency: "usd",
      image: "assets/img/packages/package-4.png",
      priceClass: "",
      buttonClass: ""
    },
    {
      label: "Paquete 5",
      price: 3000,
      currency: "usd",
      image: "assets/img/packages/package-5.png",
       priceClass: "price-2",
      buttonClass: "btn-p-two"
    },
    {
      label: "Paquete 6",
      price: 5000,
      currency: "usd",
      image: "assets/img/packages/package-6.png",
       priceClass: "price-2",
      buttonClass: "btn-p-two"
    },
    {
      label: "Paquete 7",
      price: 5000,
      currency: "usd",
      image: "assets/img/packages/package-7.png",
      priceClass: "price-2",
      buttonClass: "btn-p-two"
    },
  ];

  constructor() { }
}
