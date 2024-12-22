const container = document.querySelector(".container");
const search = document.querySelector(".searc-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error = document.querySelector(".not-found");
search.addEventListener("click", function () {
    const APIKey = 'bd41d9c1dcb9276402df6942332334ee';
    const city = document.querySelector(".searc-box input").value;

    if (city.trim() === "")
        return;


    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())

        .then(json => {
            if (json.cod === "404") {
                container.style.height=' 400px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                forecastContainer.classList.remove('active');
                error.classList.add('active');
                return;
            }
            container.style.height=' 500px';
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            forecastContainer.classList.add('active'); 
            error.classList.remove('active'); 

            const image = document.querySelector(".weather-box img");
            const temp = document.querySelector(".weather-box .temprature");
            const description = document.querySelector(".weather-box .description");
            const humidity = document.querySelector(".weather-details .humidity span");
            const windSpeed = document.querySelector(".weather-details .wind span");

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;
                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;
                case 'Rain':
                    image.src = 'images/rain.png';
                    break;
                case 'Snow':
                    image.src = 'images/snow.png';
                    break;
                case 'Mist':
                    image.src = 'images/mist.png';
                    break;
                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                default:
                    image.src = 'images/cloud.png';
                    break;
            }
            temp.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerText = json.weather[0].description;
            humidity.innerText = `${json.main.humidity}%`;
            windSpeed.innerText = `${parseInt(json.wind.speed)}Km/h`;

            // Show the weather box and details (if hidden)
            weatherBox.style.display = "block";
            weatherDetails.style.display = "flex";
        })
        .catch(err => {
            console.error("Error fetching weather data:", err);
        });

    // update forecasting weather

    const forecastContainer = document.querySelector(".forecast-item-container");

    function fetchForecast(city) {
        const APIKey = 'bd41d9c1dcb9276402df6942332334ee';

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
            .then(response => response.json())
            .then(json => {
                forecastContainer.innerHTML = "";

                const dailyForecasts = json.list.filter((forecast, index) =>
                    index % 8 === 0 // Approx. every 8th item (3-hour intervals, 24 hours = 8 intervals)
                );

                dailyForecasts.forEach(forecast => {
                    const date = new Date(forecast.dt_txt);
                    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;
                    const temperature = `${Math.round(forecast.main.temp)} °C`;
                    const weatherIcon = getWeatherIcon(forecast.weather[0].main); // Use a helper function for the icon

                    // Create forecast item HTML
                    const forecastItem = document.createElement("div");
                    forecastItem.classList.add("forecast-item");

                    forecastItem.innerHTML = `
                        <h5 class="forecast-item-date regular-text">${formattedDate}</h5>
                        <img src="${weatherIcon}" alt="${forecast.weather[0].description}" class="forecast-item-image">
                        <h5 class="forecats-item-temp">${temperature}</h5>
                    `;

                    forecastContainer.appendChild(forecastItem);
                });
            })
            .catch(err => {
                console.error("Error fetching forecast data:", err);
            });
    }

    function getWeatherIcon(weatherMain) {
        switch (weatherMain) {
            case 'Clear':
                return './images/clear.png';
            case 'Clouds':
                return './images/cloud.png';
            case 'Rain':
                return './images/rain.png';
            case 'Snow':
                return './images/snow.png';
            case 'Mist':
            case 'Haze':
                return './images/mist.png';
            default:
                return './images/cloud.png';
        }
    }
    fetchForecast("London");

});

