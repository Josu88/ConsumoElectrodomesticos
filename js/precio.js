//Función que devuelve el precio de la luz a la hora actual
const watts = (arrayLuz) => {
  let actualHour = Hours();
  actualHour += "-"; //Le añado un guión a la hora generada para compararlo con arrayLuz

  //Obtenemos el precio de la hora actual
  for (let i in arrayLuz) {
    if (arrayLuz[i].hour.includes(actualHour)) {
      return arrayLuz[i].price;
    }
  }
};

//Función que guarda en el array devices el Precio de la luz que consumen los distintos electrodomésticos en ese momento del día
const calcPrices = (arrayLuz, devices) => {
  const actualPriceWatts = watts(arrayLuz);

  //Calculamos los precios multiplicando los Watts con el consumo de los electrodomésticos
  for (let i in devices) {
    devices[i].price = actualPriceWatts * devices[i].consumption;
    devices[i].price = devices[i].price.toFixed(2); //Redondeamos el resultado de la operación anterior a dos decimales
  }
};

//Función que devuelve la hora actual
const Hours = () => {
  let today = new Date();
  let now = today.getHours();

  return now;
};

//Función para sacar la mejor y la peor hora para gastar luz
const betterAndWorstHour = (arrayLuz) => {
  //Declarar variables
  const allPriceArray = [];
  const allHoursArray = [];
  let betterHour = "";
  let worstHour = "";

  //Adaptamos la info de la Api para convertirlo en un array y poder iterar
  for (let i in arrayLuz) {
    allPriceArray[i] = arrayLuz[i].price;
    allHoursArray[i] = arrayLuz[i].hour;
  }
  const values = Object.values(allPriceArray);
  const hours = Object.values(allHoursArray);

  //Comparamos los precios para obtener el mayor y el menor
  let max = values.reduce(function (a, b) {
    return Math.max(a, b);
  });
  let min = values.reduce(function (a, b) {
    return Math.min(a, b);
  });

  //Comparamos los precios para obtener la hora exacta
  for (let i = 0; i < 24; i++) {
    if (values[i] === max) {
      worstHour = hours[i];
    }
    if (values[i] === min) {
      betterHour = hours[i];
    }
  }

  return [betterHour, worstHour];
};

export default calcPrices;
export { Hours };
export { betterAndWorstHour };
