// receives a city and determins if the city is far enough from base to consider overnight
export const qualifiesForOvernight = (showCity) => {
  // here we assign the lat, lon of the base city which is Riga
  const [baseLat, baseLon] = [56.971149, 24.142749];
  const distance = calculateDistance(
    baseLat,
    baseLon,
    showCity.latitude,
    showCity.longitude
  );
  if (distance >= 100) {
    return true;
  } else {
    return false;
  }
};

// returns array of cities that are within the radius(in km)
export const getNearByCities = (cityList, showCity, radius) => {
  let result = cityList.filter((item) => {
    const distance = calculateDistance(
      item.latitude,
      item.longitude,
      showCity.latitude,
      showCity.longitude
    );
    return distance <= radius;
  });
  return result;
};

// function using Haversine formula to calculate distance between two locations on globe by suing lat and long
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers
  let r = 6371;

  // calculate the result
  return c * r;
};

// returns an array of possible dates without weekends
export const stripAwayWeekends = (array) => {
  const result = [];
  array.forEach((show) => {
    let previousDay = new Date(show.date).withoutTime();
    previousDay.setDate(previousDay.getDate() - 1);
    previousDay = previousDay.withoutTime().toDateString();

    let nextDay = new Date(show.date).withoutTime();
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay = nextDay.withoutTime().toDateString();

    if (
      previousDay.substr(0, 3) === "Sat" ||
      previousDay.substr(0, 3) === "Sun"
    ) {
    } else {
      result.push(previousDay);
    }

    if (nextDay.substr(0, 3) === "Sat" || nextDay.substr(0, 3) === "Sun") {
    } else {
      result.push(nextDay);
    }
  });
  return result;
};

// sorts the array and removes duplicates in case there are some
export const removeDuplicatesAndSort = (arr) => {
  let workArr = [...new Set(arr)];
  workArr.sort((a, b) => new Date(a) - new Date(b));
  return workArr;
};
