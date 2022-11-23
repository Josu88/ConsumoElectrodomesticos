"use strict";

import calcPrices from "/js/precio.js";
import { Hours } from "/js/precio.js";
import { betterAndWorstHour } from "/js/precio.js";

//Array de los distintos electrodomésticos
const devices = [
  {
    name: "Frigorífico",
    consumption: 0.0003,
    unit: "Mw",
    price: 0,
    img: "/img/frigorifico.jpg",
  },
  {
    name: "Congelador",
    consumption: 0.00055,
    unit: "Mw",
    price: 0,
    img: "/img/congelador.jpg",
  },
  {
    name: "Lavadora",
    consumption: 0.0007,
    unit: "Mw",
    price: 0,
    img: "/img/lavadora.jpg",
  },
  {
    name: "Lavavajilla",
    consumption: 0.0019,
    unit: "Mw",
    price: 0,
    img: "/img/lavavajilla.jpg",
  },
  {
    name: "Secador",
    consumption: 0.0028,
    unit: "Mw",
    price: 0,
    img: "/img/secador.jpg",
  },
  {
    name: "Televisor",
    consumption: 0.00035,
    unit: "Mw",
    price: 0,
    img: "/img/televisor.jpg",
  },
];

//Definimos las variables a usar
let counter = 0;
let contWBWH = 0;
let contDW = 0;
let contSA = 0;
let contDS = 0;
//Definimos los arrays de objetos a usar en el localstorage
const arrayDev = [];
const arrayPrec = [];
const arayMH = [];
const arrayPR = [];
const arrayHour = [];
const arrayCH = [];
const arrayPH = [];
const arrayImg = [];
const arrayFech = [];

//Seleccionamos el cuadro de texto del formulario del html
const form = document.querySelector("form.search");
const app = document.querySelector("section.app");
const boton = form.querySelector("button.btnForm");
const select = document.querySelector("#SelectDevices");
const contentArray = document.querySelector("section.seeArray");
const bwHours = document.querySelector("section.bwHours");
const img = document.querySelector("section.photo");

//Definimos la variable para guardar en el localstorage
let Storage = window.localStorage;

//FUNCIONES

//Arrow funtion para escribir la mejor y peor hora en el elemnto
const writeBetterAndWorstHour = (betterHour, worstHour) => {
  //añadir la mejor hora y la peor hora a los arrays
  arayMH[contWBWH] = betterHour;
  arrayPH[contWBWH] = worstHour;

  //Guardamos datos en el localstorage
  Storage.setItem("MejorHora:", JSON.stringify(arayMH));
  Storage.setItem("PeorHora:", JSON.stringify(arrayPH));

  //Escribimos la mejor y peor hora en el elemento
  bwHours.innerHTML = `<p>Hora más barata: ${betterHour}h</p> <p>Hora más cara: ${worstHour}h</p>`;

  //Aumentar la variable
  contWBWH++;
};

//Funcion que dibuja el array en el html
const showArray = (array) => {
  for (const element of array) {
    if (element.name === select.value) {
      let photo = document.createElement("img");
      let seeArray = document.createElement("div");

      photo.src = element.img;
      seeArray.innerHTML = drawData(element);

      contentArray.appendChild(seeArray);
      img.appendChild(photo);

      contentArray.replaceChild(seeArray, contentArray.firstChild);
      img.replaceChild(photo, img.firstChild);

      //Guardamos en el array los valores de devices
      arrayDev[contSA] = select.value;
    }
  }

  //Guardamos datos en el localstorage
  Storage.setItem("Device:", JSON.stringify(arrayDev));

  //Aumentar el contador
  contSA++;
};

//Arrow funtion para escribir en el h2
const drawData = (element) => {
  const hour = Hours();
  //Guardar en los arrrays los valores de hora,consumo,precio y imagen
  arrayHour[contDW] = hour;
  arrayCH[contDW] = element.consumption;
  arrayPH[contDW] = element.price;
  arrayImg[contDW] = element.img;

  //Guardamos datos en el localstorage
  Storage.setItem("Hora:", JSON.stringify(arrayHour));
  Storage.setItem("Consumo por Hora:", JSON.stringify(arrayCH));
  Storage.setItem("Precio Hora:", JSON.stringify(arrayPH));
  Storage.setItem("Imagen:", JSON.stringify(arrayImg));

  //Aumentar contador
  contDW++;

  //Escribimos datos en el h2
  return `<h2>${element.name}</h2> <p>Consumo por hora: ${element.consumption} ${element.unit}</p> <p>Precio a las ${hour}h: ${element.price}€</p>`;
};

//Arrow Function para sacar datos de la api y mandarselos a otra funcion para mostrarlos
const doSearch = async () => {
  try {
    //creamos el fetch para conexion con la api
    const url = `https://api.allorigins.win/get?url=https://api.preciodelaluz.org/v1/prices/all?zone=PCB`;

    const response = await fetch(url);

    const data = await response.json();

    //Comprobamos si la respuesta esta bien
    if (response.ok) {
      //Convertir a array el JSON
      let arrayLuz = JSON.parse(data.contents);

      //Calculamos los precios de los aparatos llamando a la funcion
      calcPrices(arrayLuz, devices);

      //Calculamos la mejor y peor hora para consumir luz
      const [betterHour, worstHour] = betterAndWorstHour(arrayLuz);
      writeBetterAndWorstHour(betterHour, worstHour);

      //Hayamos la fecha actual
      let ObDate = new Date();
      let dateNow = ObDate.toDateString();

      //Guardar en los arrrays los valores de fecha
      arrayFech[contDS] = dateNow;
      //Guardamos datos en el localstorage
      Storage.setItem("Fecha:", JSON.stringify(arrayFech));

      //Aumentar el contador
      contDS++;

      showArray(devices);
    } else {
      //Si no sacamos por consola un mensaje de error
      console.error("Hubo un error haciendo la petición");
    }
  } catch (error) {
    //si falla el catch sacamos por consola un mensaje de error
    console.error(error.message);
  }
};

const interval = async (e) => {
  e.preventDefault();

  let SetIn = [];

  //Aumentamos el contador
  counter++;

  //Comprobamos cuantas veces pulsamos el boton
  if (counter < 2) {
    SetIn = doSearch();
  } else {
    //Si esta bien ejecutamos la funcion con el setinterval
    SetIn = setInterval(doSearch, 3000);
  }
  return SetIn;
};

//Añadimos el event listener al boton del formulario
boton.addEventListener("click", interval);
