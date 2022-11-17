"use strict";

import calcPrices from "js/precio.js";

//Array de los distintos electrodomésticos
const devices = [
  {
    name: "frigorífico",
    consumption: 0.65,
    unit: "Mwh",
    price: 0,
  },
  {
    name: "congelador",
    consumption: 0.55,
    unit: "Mwh",
    price: 0,
  },
  {
    name: "lavadora",
    consumption: 0.35,
    unit: "Mwh",
    price: 0,
  },
  {
    name: "lavavajilla",
    consumption: 0.25,
    unit: "Mwh",
    price: 0,
  },
  {
    name: "secador",
    consumption: 0.25,
    unit: "Mwh",
    price: 0,
  },
  {
    name: "televisor",
    consumption: 0.25,
    unit: "Mwh",
    price: 0,
  },
];

//Definimos las variables a usar
let counter = 1;

//Seleccionamos el cuadro de texto del formulario del html
const form = document.querySelector("form.search");
const app = document.querySelector("section.app");
const boton = form.querySelector("button.btnForm");

//FUNCIONES

//Arrow funtion para que aparezca un parrafo con el mensaje de error
const writeMessage = (message) => {
  app.innerHTML = `<p>${message}</p>`;
};

//Arrow funtion para contar las pulsaciones de un boton del formulario
let writeCont = () => {
  let Num = counter++;
  return Num;
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
      console.log(arrayLuz["00-01"]);
      console.log(arrayLuz);
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

  //Definimos las variables a usar en la funcion
  let miliSegs = 0;

  //Comprobamos cuantas veces pulsamos el boton
  if (writeCont() < 2) {
    miliSegs = 1000;
  } else {
    miliSegs = 300000;
  }

  //Si esta bien ejecutamos la funcion con el setinterval
  const SetIn = setInterval(doSearch, miliSegs);

  return SetIn;
};

//Añadimos el event listener al boton del formulario
boton.addEventListener("click", interval);
