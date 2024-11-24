const WeatherApp = class {
    constructor(apiKey, resultsBlockSelector) {
        this.apiKey = apiKey;
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=en";
        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=en";
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = undefined;
        this.forecast = undefined;

        this.resultsBlock = document.querySelector(resultsBlockSelector);
    }

    getCurrentWeather(query) {
        let url = this.currentWeatherLink.replace("{query}", query);
        let req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.addEventListener("load", () => {
            this.currentWeather = JSON.parse(req.responseText);
            console.log(this.currentWeather);
            this.drawWeather();
        });
        req.send();
    }

    getForecast(query) {
        let url = this.forecastLink.replace("{query}", query);
        fetch(url).then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.forecast = this.groupForecastByDays(data.list);
                this.drawWeather();
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
            });
    }

    getWeather(query) {
        this.getCurrentWeather(query);
        this.getForecast(query);
    }

    groupForecastByDays(forecastData) {
        const grouped = {};
        forecastData.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateString = this.formatDate(date);
            if (!grouped[dateString]) {
                grouped[dateString] = [];
            }
            grouped[dateString].push(item);
        });
        return grouped;
    }

    formatDate(date) {
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dayOfWeek = weekdays[date.getDay()];
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${dayOfWeek}, ${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
    }

    drawWeather() {
        const currentWeatherContainer = document.querySelector("#current-weather-container");
        const forecastContainer = document.querySelector("#forecast-container");

        currentWeatherContainer.innerHTML = '';
        forecastContainer.innerHTML = '';

        if (this.currentWeather) {
            const weatherMain = this.currentWeather.weather[0].main.toLowerCase();
            let backgroundImage = 'images/earth.jpg';

            switch (weatherMain) {
                case 'clear':
                    backgroundImage = 'images/sunny.jpg';
                    break;
                case 'clouds':
                    backgroundImage = 'images/cloudy.jpg';
                    break;
                case 'rain':
                case 'drizzle':
                    backgroundImage = 'images/rainy.jpg';
                    break;
                case 'snow':
                    backgroundImage = 'images/snowy.jpg';
                    break;
                case 'fog':
                case 'mist':
                case 'haze':
                    backgroundImage = 'images/foggy.jpg';
                    break;
            }

            document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`;

            const date = new Date(this.currentWeather.dt * 1000);
            const dateTimeString = `${this.formatDate(date)} ${date.toLocaleTimeString("pl-PL")}`;

            const temperature = this.currentWeather.main.temp;
            const feelsLikeTemperature = this.currentWeather.main.feels_like;
            const iconName = this.currentWeather.weather[0].icon;
            const description = this.currentWeather.weather[0].description;

            const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
            currentWeatherContainer.appendChild(weatherBlock);
        }

        if (this.forecast && Object.keys(this.forecast).length > 0) {
            let counter = 0;
            for (let date in this.forecast) {
                if (counter === 5) break; 
                const dailyForecast = this.forecast[date];
                const temperatures = dailyForecast.map(f => f.main.temp);
                const minTemp = Math.min(...temperatures);
                const maxTemp = Math.max(...temperatures);

                const weather = dailyForecast[0];
                const iconName = weather.weather[0].icon;
                const description = weather.weather[0].description;

                const forecastBlock = this.createWeatherBlock(
                    `${date}`,
                    `${minTemp}/${maxTemp}`,
                    null,
                    iconName,
                    description
                );
                forecastContainer.appendChild(forecastBlock);
                counter++;
            }
        } else {
            forecastContainer.innerHTML = "5-day forecast is not available.";
        }
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        let weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        let dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.innerText = dateString;
        weatherBlock.appendChild(dateBlock);

        let temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        if (feelsLikeTemperature !== null) {
            let feelsLikeBlock = document.createElement("div");
            feelsLikeBlock.className = "weather-temperature-feels-like";
            feelsLikeBlock.innerHTML = `Feels like: ${feelsLikeTemperature} &deg;C`;
            weatherBlock.appendChild(feelsLikeBlock);
        }

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        let weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.innerText = description;
        weatherBlock.appendChild(weatherDescription);

        return weatherBlock;
    }
}

document.weatherApp = new WeatherApp("ebc3cfb8a7b06e2b24cc63968074fc8e", "#weather-results-container");

document.querySelector("#checkButton").addEventListener("click", function() {
    const query = document.querySelector("#locationInput").value;
    document.weatherApp.getWeather(query);
});
