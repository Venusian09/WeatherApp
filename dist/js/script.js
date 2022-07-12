async function getData(inputValue) {
  const apiKey =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    inputValue +
    "&appid=f8b8ec19397813a2fff86a7c08346cd1";
  const response = await fetch(apiKey);

  if (response.status !== 200) {
    if (!document.contains(validateObjects.errorMessage)) {
      validateObjects.errorMessage = newElement("p", "sidebar__error");
      validateObjects.errorMessage.textContent =
        "❌ Error! Please insert correct city name!";
      sidebarWrapper.appendChild(validateObjects.errorMessage);
    }
  } else {
    if (document.contains(validateObjects.errorMessage)) {
      validateObjects.errorMessage.remove();
    }
    const data = await response.json();
    if (document.contains(introductionSection)) {
      introductionSection.parentNode.removeChild(introductionSection);
    }
    validateObjects.cityTemperature.textContent = `${kelvinToCelcius(
      data.main.temp
    )}°C`;
    validateObjects.cityName.textContent = data.name;
    validateObjects.cityCurrentTime.textContent = getCurrentTime(data.timezone);

    const windSpeed = (data.wind.speed * 3.6).toString();
    weatherDetails[0].textContent = `${windSpeed.slice(0, 4)}km/h`;
    weatherDetails[1].textContent = `${data.main.pressure}hPa`;
    weatherDetails[2].textContent = `${data.main.humidity}%`;
    validateObjects.cityWeatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    appBackground.style.backgroundImage = `url('./img/${data.weather[0].main}.jpeg')`;

    const lastListItem = newElement("li", "sidebar__last-list-item");
    lastListItem.textContent = inputValue;
    sidebarLastList.prepend(lastListItem);
  }
}
async function getFiveDaysData(inputValue) {
  const apiKey =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    inputValue +
    "&appid=f8b8ec19397813a2fff86a7c08346cd1";
  const response = await fetch(apiKey);

  if (response.status !== 200) {
    console.log("error");
  } else {
    const data = await response.json();
    console.log(data);

    const filteredList = data.list.filter((a) => {
      return a.dt_txt.includes("15:00:00");
    });

    if (document.contains(validateObjects.singleDayWrapper)) {
      const firstSearchDays = document.querySelectorAll(".single-day");
      firstSearchDays.forEach((firstSearchDay) => {
        firstSearchDay.remove();
      });
    }

    for (let i = 0; i < filteredList.length; i++) {
      validateObjects.singleDayCard = newElement("div", "single-day");

      validateObjects.singleDayCardDay = newElement("p", "single-day__name");
      validateObjects.singleDayCardIcon = newElement("img", "single-day__icon");
      validateObjects.singleDayCardTemperature = newElement(
        "p",
        "single-day__temp"
      );

      const filteredDayName = new Date(filteredList[i].dt * 1000);

      const days = filteredDayName
        .toDateString({ weekday: "long" })
        .slice(0, 10);

      validateObjects.singleDayCardDay.textContent = days;
      validateObjects.singleDayCardIcon.src = `http://openweathermap.org/img/wn/${filteredList[i].weather[0].icon}@2x.png`;
      validateObjects.singleDayCardTemperature.textContent = `${kelvinToCelcius(
        filteredList[i].main.temp
      )}°C`;

      validateObjects.singleDayCard.appendChild(
        validateObjects.singleDayCardDay
      );
      validateObjects.singleDayCard.appendChild(
        validateObjects.singleDayCardDay
      );
      validateObjects.singleDayCard.appendChild(
        validateObjects.singleDayCardIcon
      );
      validateObjects.singleDayCard.appendChild(
        validateObjects.singleDayCardTemperature
      );
      validateObjects.singleDayWrapper.appendChild(
        validateObjects.singleDayCard
      );
    }
    homeSection.appendChild(validateObjects.singleDayWrapper);
  }
}

const newElement = (tagName, className) => {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
};

const kelvinToCelcius = (kelvinTemp) => {
  const celciusTemp = Math.round(kelvinTemp - 273.15);
  return celciusTemp;
};

const getCurrentTime = (timeZone) => {
  const d = new Date(new Date().getTime() + timeZone * 1000);
  const dateIso = d.toISOString();
  const dayOfWeek = d.toDateString({ weekday: "long" });
  const hour = dateIso.slice(11, 16);
  return `${hour} - ${dayOfWeek}`;
};

const inputSearch = document.querySelector(".sidebar__search-input");
const buttonSearch = document.querySelector(".sidebar__search-button");
const searchForm = document.getElementById("search-form");

const sidebarWrapper = document.querySelector(".sidebar__search-wrapper");
const sidebarLastList = document.querySelector(".sidebar__last-list");
const lastListArray = [];

const homeSection = document.querySelector(".home");

const weatherDetails = document.querySelectorAll(".sidebar__details--value");

const appBackground = document.querySelector(".wrapper");

const introductionSection = document.querySelector(".introduction");

let searchOnce = true;
let errorOnce = true;

let validateObjects = {
  cityInfo: null,
  cityTemperature: null,
  cityInfoWrapper: null,
  cityName: null,
  cityCurrentTime: null,
  cityWeatherIcon: null,
  cityWeatherWrapper: null,
  errorMessage: null,
  singleDayWrapper: null,
  singleDayCard: null,
  singleDayCardDay: null,
  singleDayCardIcom: null,
  singleDayCardTemperature: null,
};

searchForm.addEventListener("submit", (event) => {
  inputSearch.blur();
  event.preventDefault();
  const inputSearchValue = inputSearch.value;
  inputSearch.value = "";
  if (searchOnce) {
    validateObjects.cityInfo = newElement("div", "city-info");
    validateObjects.cityTemperature = newElement("p", "city-info__temperature");
    validateObjects.cityInfoWrapper = newElement("div", "city-info__wrapper");
    validateObjects.cityName = newElement("div", "city-info__city-name");
    validateObjects.cityCurrentTime = newElement(
      "div",
      "city-info__current-time"
    );
    validateObjects.cityWeatherWrapper = newElement(
      "div",
      "city-info__weather-wrapper"
    );
    validateObjects.cityWeatherIcon = newElement(
      "img",
      "city-info__weather-icon"
    );

    validateObjects.singleDayWrapper = newElement("div", "single-day-wrapper");

    homeSection.appendChild(validateObjects.cityInfo);
    validateObjects.cityInfo.appendChild(validateObjects.cityTemperature);
    validateObjects.cityInfo.appendChild(validateObjects.cityInfoWrapper);
    validateObjects.cityInfoWrapper.appendChild(validateObjects.cityName);

    validateObjects.cityName.after(validateObjects.cityCurrentTime);

    validateObjects.cityInfo.appendChild(validateObjects.cityWeatherWrapper);
    validateObjects.cityWeatherWrapper.appendChild(
      validateObjects.cityWeatherIcon
    );
  }
  searchOnce = false;
  getData(inputSearchValue);
  getFiveDaysData(inputSearchValue);
});
