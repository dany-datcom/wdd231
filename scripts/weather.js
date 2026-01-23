// select HTML elements in the document
console.log("JS cargado correctamente");
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// OpenWeatherMap Current Weather API URL
const url = 'https://api.openweathermap.org/data/2.5/weather?lat=10.0912&lon=-84.4703&units=metric&appid=16b1929a08aeba55d44892ad6d4c7d05';
 
// async function to fetch API data
async function apiFetch() {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      console.log(data); // output results for testing
      displayResults(data); // Call function to display data
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to display the weather data
function displayResults(data) {
  // Display temperature with degree symbol
  currentTemp.innerHTML = `${data.main.temp}&deg;C`;
  
  // Get weather icon and description
  const iconCode = data.weather[0].icon;
  const description = data.weather[0].description;
  
  // Capitalize each word of the description
  const words = description.split(' ');
  const capitalizedDesc = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Set weather icon and description
  weatherIcon.src = `https://openweathermap.org/img/w/${iconCode}.png`;
  weatherIcon.alt = capitalizedDesc;
  captionDesc.textContent = capitalizedDesc;
}

// invoke the function
apiFetch();