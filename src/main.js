import { CONFIG } from './config.js';

const API_KEY = CONFIG.API_KEY;
const BASE_URL = CONFIG.BASE_URL;

document.addEventListener('DOMContentLoaded', () => {
    const daySelector = document.getElementById('day');
    const languageSelector = document.getElementById('language');

    daySelector.addEventListener('change', fetchWeatherData);
    languageSelector.addEventListener('change', fetchWeatherData);

    fetchWeatherData();
});

async function fetchWeatherData() {
    const latitude = 52.52437; //hardcoded for now
    const longitude = 13.41053;
    const units = 'metric';
    const lang = document.getElementById('language').value || 'en';

    try {
        const response = await axios.get(`${BASE_URL}?lat=${latitude}&lon=${longitude}&units=${units}&lang=${lang}&appid=${API_KEY}`);
        const data = response.data;

        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

function updateWeatherUI(data) {
    const selectedOption = document.getElementById('day').value;
    const weatherContainer = document.getElementById('weather-info');
    weatherContainer.innerHTML = '';

    if (selectedOption === 'today') {
        const todayWeather = data.list[0];
        weatherContainer.appendChild(createWeatherCard(todayWeather, 'Today'));
    } else {
        for (let i = 0; i < 5; i++) {
            const dayWeather = data.list[i * 8];
            weatherContainer.appendChild(createWeatherCard(dayWeather, `Day ${i + 1}`));
        }
    }
}

function createWeatherCard(weather, dayLabel) {
    const card = document.createElement('div');
    card.classList.add('weather-card');

    const iconCode = weather.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    card.innerHTML = `
        <h3>${dayLabel}</h3>
        <img src="${iconUrl}" alt="Weather Icon">
        <p><strong>Temperature:</strong> ${weather.main.temp}°C</p>
        <p><strong>Humidity:</strong> ${weather.main.humidity}%</p>
        <p><strong>Precipitation:</strong> ${weather.pop * 100}%</p>
        <p><strong>Wind Speed:</strong> ${weather.wind.speed} m/s</p>
    `;

    return card;
}
