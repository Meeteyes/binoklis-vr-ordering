export const createSelectOptions = (array) => {
  return array.map((item) => {
    return { value: item.cityName, label: item.cityName };
  });
};

export const printThis = (event, city) => {
  event.preventDefault();
};
