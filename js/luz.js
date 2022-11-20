"use strict";

import calcPrices from "/js/precio.js";
import { Hours } from "/js/precio.js";
import { betterAndWorstHour } from "/js/precio.js";


//Array de los distintos electrodomésticos
const devices = [
  {
    name: "Frigorífico",
    consumption: 0.65,
    unit: "Mwh",
    price: 0,
    img: "/img/frigorifico.jpg",
  },
  {
    name: "Congelador",
    consumption: 0.55,
    unit: "Mwh",
    price: 0,
    img: "/img/congelador.jpg",
  },
  {
    name: "Lavadora",
    consumption: 0.35,
    unit: "Mwh",
    price: 0,
    img: "/img/lavadora.jpg",
  },
  {
    name: "Lavavajilla",
    consumption: 0.25,
    unit: "Mwh",
    price: 0,
    img: "/img/lavavajilla.jpg",
  },
  {
    name: "Secador",
    consumption: 0.25,
    unit: "Mwh",
    price: 0,
    img: "/img/secador.jpg",
  },
  {
    name: "Televisor",
    consumption: 0.25,
    unit: "Mwh",
    price: 0,
    img: "/img/televisor.jpg",
  },
];

//Definimos las variables a usar
let counter = 0;

//Seleccionamos el cuadro de texto del formulario del html
const form = document.querySelector("form.search");
const app = document.querySelector("section.app");
const boton = form.querySelector("button.btnForm");
const select = document.querySelector("#SelectDevices");
const contentArray = document.querySelector("section.seeArray");
const bwHours = document.querySelector("section.bwHours");


//FUNCIONES

const showArray = (array) => {
  for (const element of array) {
    let seeArray = document.createElement("div");
    seeArray.innerHTML = drawData(element);
    contentArray.appendChild(seeArray);
  }
};

const drawData = (element) => {
  const hour = Hours();
  return `<h2>${element.name}</h2> <p>Consumo por hora: ${element.consumption} ${element.unit}</p> <p>Precio a las ${hour}h: ${element.price}</p> <img src = "${element.img}">`;
};

//Arrow funtion para que aparezca un parrafo con el mensaje de error
const writeMessage = (message) => {
  app.innerHTML = `<p>${message}</p>`;
};

const writeBetterAndWorstHour = (betterHour, worstHour) => {
  bwHours.innerHTML = `<p>Actualmente la hora que la luz cuesta menos es entre ${betterHour}h y la hora en la que la luz cuesta mas es entre ${worstHour}h</p>`;
};

//Funcion que dibuja el array en el html
const showArray = (array) => {
  for (const element of array) {
    if (element.name === select.value) {
      let seeArray = document.createElement("div");
      seeArray.innerHTML = drawData(element);
      contentArray.appendChild(seeArray);
      contentArray.replaceChild(seeArray, contentArray.firstChild);
    }
  }
};

const drawData = (element) => {
  const hour = Hours();
  return `<h2>${element.name}</h2> <p>Consumo por hora: ${element.consumption} ${element.unit}</p> <p>Precio a las ${hour}h: ${element.price}€</p> <img src = "${element.img}">`;
};

//Arrow Function para sacar datos de la api y mandarselos a otra funcion para mostrarlos
const doSearch = async () => {
  try {
    //creamos el fetch para conexion con la api
    const url = `https://api.allorigins.win/get?url=https://api.preciodelaluz.org/v1/prices/all?zone=PCB`;

    const response = await fetch(url);

    const data = await response.json();

    //Sacamos un mensaje por el parafo
    writeMessage("Cargando Datos....");

    //Comprobamos si la respuesta esta bien
    if (response.ok) {
      //Convertir a array el JSON
      let arrayLuz = JSON.parse(data.contents);

      //Definimos la variable para guardar en el localstorage
      let Storage = window.localStorage;

      Storage.setItem("Device", devices[select]);

      //Calculamos los precios de los aparatos llamando a la funcion
      calcPrices(arrayLuz, devices);

      //Calculamos la mejor y peor hora para consumir luz
      const [betterHour, worstHour] = betterAndWorstHour(arrayLuz);
      writeBetterAndWorstHour(betterHour, worstHour);


      showArray(devices);
    } else {
      //Si no sacamos por consola un mensaje de error
      writeMessage("Hubo un error haciendo la petición");
    }
  } catch (error) {
    //si falla el catch sacamos por consola un mensaje de error
    writeMessage(error.message);
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

