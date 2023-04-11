const userWeatherTab = document.querySelector("[userWeatherData]");
const userSearchTab = document.querySelector("[searchWeatherData]");
const weatherMainContainer = document.querySelector(".weather-container");
const grantLocationContainer = document.querySelector(
  ".allow-location-container"
);
const grantbtn = document.querySelector("[location-btn]");
const searchWeatherFormContainer = document.querySelector(
  "[searchWeatherFormContainer]"
);
const loadingScreenContainer = document.querySelector(".loading-screen");
const userWeatherInformation = document.querySelector(".userweatherinfo");
const cityName = document.querySelector("[userCityName]");
const countryFlag = document.querySelector("[userCountryFlag]");
const weatherDescription = document.querySelector("[userWeatherDescription]");
const weatherIcon = document.querySelector("[userWeatherIcon]");
const temperature = document.querySelector("[dataTemperature]");
const windSpeed = document.querySelector("[windSpeedInfo]");
const humidity = document.querySelector("[HumidityInfo]");
const clouds = document.querySelector("[cloudInfo]");
const searchInputData = document.querySelector("[dataSearchInput]");
const searchWeatherBtn = document.querySelector("[searchWeatherButton]");
const errorPage = document.querySelector("[errorpage]");

// initially variables using
let currentTab = userWeatherTab;
const API_KEY = "7d25ab7d0e5210bf3e3a0a68fad8e34c";
currentTab.classList.add("current-tab");
getFromSessionStorage();
// getfromsessionstrage call is because if coordinates are already present there, it will show data directly

// switchTab function
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchWeatherFormContainer.classList.contains("active")) {
      grantLocationContainer.classList.remove("active");
      loadingScreenContainer.classList.remove("active");
      userWeatherInformation.classList.remove("active");
      searchWeatherFormContainer.classList.add("active");
    } else {
      searchWeatherFormContainer.classList.remove("active");
      userWeatherInformation.classList.remove("active");

      getFromSessionStorage();
    }
  }
}

// switching to current tab
userWeatherTab.addEventListener("click", () => {
  switchTab(userWeatherTab);
});

userSearchTab.addEventListener("click", () => {
  switchTab(userSearchTab);
});

// from where session storage is getting coordinates ? - geo loaction api (eventlistener function down)
// to get co-ordinates from session storage and in grantloaction button we will use geolocation api to get location and will save it into session storage
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    grantLocationContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfor(coordinates);
  }
}

// fetching user information for weather
async function fetchUserWeatherInfor(coordinates) {
  const { lat, lon } = coordinates;
  errorPage.classList.remove("active");
  grantLocationContainer.classList.remove("active");
  loadingScreenContainer.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreenContainer.classList.remove("active");
    userWeatherInformation.classList.add("active");
    renderWeatherInfo(data);
  } catch (error) {}
}

// function which will put data values in their places
function renderWeatherInfo(weatherInfo) {
  cityName.innerText = weatherInfo?.name;
  countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temperature.innerText = `${weatherInfo?.main?.temp}°C`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}

// to get location function
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("No Geo location supported");
  }
}

// showPositon callback function
function showPosition(position) {
  const userCoordinate = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinate));
  fetchUserWeatherInfor(userCoordinate);
}

// grant location button listener
grantbtn.addEventListener("click", getLocation);

// event listener on form submission
searchWeatherFormContainer.addEventListener("submit", (sub) => {
  sub.preventDefault();
  let cityName = searchInputData.value;

  if (cityName === "") {
    return;
  } else {
    fetchSearchInfo(cityName);
  }
});

async function fetchSearchInfo(city) {
  errorPage.classList.remove("active");
  loadingScreenContainer.classList.add("active");
  userWeatherInformation.classList.remove("active");
  grantLocationContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    loadingScreenContainer.classList.remove("active");
    userWeatherInformation.classList.add("active");
    renderWeatherInfo(data);

    if (!data.sys) throw data;
  } catch (error) {
    errorPage.classList.add("active");
    userWeatherInformation.classList.remove("active");
  }
}
