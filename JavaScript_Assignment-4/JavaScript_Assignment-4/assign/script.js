/* Group Member: 
Udit Gami
Gurleen Kaur
*/
// API details
const openWeatherApiKey = "df4f31b00947f5393daccfc2dfa9e3d6";
const openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const giphyApiKey = "rwH2TZIHDYrBuj4BH5zdwV0EMrLRPkib";
const giphyApiUrl = "https://api.giphy.com/v1/gifs/random";

// Elements
const cityForm = document.getElementById("city-form");
const weatherDataContainer = document.getElementById("weather-data");
const gifContainer = document.getElementById("gif-container");
const chartCanvas = document.getElementById("weather-chart");
const chartContext = chartCanvas.getContext("2d");
let chart;

// Event listener for form submission
cityForm.addEventListener("submit", handleFormSubmit);

// Function to handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const cityInput = document.getElementById("city");
  const city = cityInput.value.trim();

  if (city === "") {
    return;
  }

  try {
    const weatherData = await getWeatherData(city);
    if (weatherData) {
      displayWeatherData(weatherData);
      updateChart(weatherData.main.temp);

      const gifData = await getGifData(weatherData.weather[0].main);
      if (gifData) {
        displayGif(gifData);
      }
    }
  } catch (error) {
    handleFetchError(error);
  }
}

// Function to fetch weather data
async function getWeatherData(city) {
  const response = await fetch(
    `${openWeatherApiUrl}?q=${city}&appid=${openWeatherApiKey}&units=metric`
  );
  return response.ok ? await response.json() : null;
}

// Function to display weather data
function displayWeatherData(weatherData) {
  const weatherIcon = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

  weatherDataContainer.innerHTML = `
    <h2>Weather in ${weatherData.name}, ${weatherData.sys.country}</h2>
    <div class="weather-details">
        <img src="${weatherIcon}" alt="Weather Icon">
        <p>Temperature: ${weatherData.main.temp}°C</p>
        <p>Weather: ${weatherData.weather[0].description}</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
        <p>Wind Speed: ${weatherData.wind.speed} m/s</p>
    </div>
  `;
}

// Function to fetch Giphy data
async function getGifData(tag) {
  const response = await fetch(
    `${giphyApiUrl}?api_key=${giphyApiKey}&tag=${tag}`
  );
  return response.ok ? await response.json() : null;
}

// Function to display Giphy data
function displayGif(gifData) {
  const gifImageUrl = gifData.data.images.fixed_height.url;
  gifContainer.innerHTML = `<img src="${gifImageUrl}" alt="Weather GIF">`;
}

// Function to handle fetch errors
function handleFetchError(error) {
  console.error("Error fetching data:", error);
  weatherDataContainer.innerHTML =
    "<p>An error occurred while fetching data.</p>";
}

// Function to initialize the chart
function initChart() {
  chart = new Chart(chartContext, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Temperature (°C)",
          data: [],
          borderColor: "#2196F3",
          backgroundColor: "rgba(33, 150, 243, 0.1)",
          borderWidth: 1,
          pointRadius: 3,
          fill: true,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Time",
          },
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)",
          },
          beginAtZero: false,
        },
      },
    },
  });
}

// Function to update the chart
function updateChart(temperature) {
  const time = new Date().toLocaleTimeString();
  chart.data.labels.push(time);
  chart.data.datasets[0].data.push(temperature);
  chart.update();
}

// Initialization
initChart();
