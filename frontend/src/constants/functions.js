export const createSelectOptions = (array) => {
  console.log("Function is happening");
  return array.map((item) => {
    return { value: item.cityName, label: item.cityName };
  });
};

export const printThis = (event, city) => {
  event.preventDefault();
  console.log(city);
};
