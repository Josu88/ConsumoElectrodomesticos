//Función que devuelve el precio de la luz a la hora actual
const watts = (arrayLuz) => {
  let actualHour = Hours();
  actualHour += "-"; //Le añado un guión a la hora generada para compararlo con arrayLuz
  console.log(actualHour);
  for (let i in arrayLuz) {
    if (arrayLuz[i].hour.includes(actualHour)) {
      return arrayLuz[i].price;
    }
  }
};

//Función que guarda en el array devices el Precio de la luz que consumen los distintos electrodomésticos en ese momento del día
const calcPrices = (arrayLuz, devices) => {
  const actualPriceWatts = watts(arrayLuz);
  for (let i in devices) {
    devices[i].price = actualPriceWatts * devices[i].consumption;
    devices[i].price = devices[i].price.toFixed(2) + "€"; //Redondeamos el resultado de la operación anterior a dos decimales y le añadimos el símbolo de euro
  }
  console.log(devices);
};

//Función que devuelve la hora actual
const Hours = () => {
  let today = new Date();
  let now = today.getHours();

  return now;
};

//const betterAndWorstHour = (arrayLuz) => {};

export default calcPrices;
export { Hours };
