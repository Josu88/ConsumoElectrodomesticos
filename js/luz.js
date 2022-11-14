"use strict";

//Seleccionamos el cuadro de texto del formulario del html
const form = document.querySelector("form.search");
const app = document.querySelector("section.app");

//FUNCIONES

//Arrow funtion para que aparezca un parrafo con el mensaje de error
const writeMessage = (message) => {
  app.innerHTML = `<p>${message}</p>`;
};

//Arrow funtion para sacar un array de los datos de la api de la luz
const writeInfLuz = (conLuz) => {
  //Convertir a array el JSON
  let arrayLuz = JSON.parse(conLuz);
  console.log(arrayLuz["00-01"]);
  console.log(arrayLuz);
};

const doSearch = async (e) => {
  e.preventDefault();
  try {
    const url = `https://api.allorigins.win/get?url=https://api.preciodelaluz.org/v1/prices/all?zone=PCB`;

    writeMessage("Cargando Datos....");

    const response = await fetch(url);

    const data = await response.json();

    if (response.ok) {
      writeInfLuz(data.contents);
    } else {
      writeMessage("Hubo un error haciendo la petición");
    }
  } catch (error) {
    writeMessage(error.message);
  }
};
form.addEventListener("submit", doSearch);
