const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

$(document).ready(function () {
    weatherFn('Pune');

    $('#city-input-btn').click(function() {
        const cityName = $('#city-input').val();
        if (cityName) {
            weatherFn(cityName);
        } else {
            alert('Please enter a city name.');
        }
    });

    $('#city-input').keypress(function(event) {
        if (event.which === 13) {
            event.preventDefault();
            $('#city-input-btn').click();
        }
    });
});

async function weatherFn(cName) {
    const temp = `${url}?q=${encodeURIComponent(cName)}&appid=${apiKey}&units=metric`;
    $('#weather-info').hide();
    $('#loading').show();

    try {
        const res = await fetch(temp);
        if (!res.ok) {
            throw new Error('City not found');
        }
        const data = await res.json();
        weatherShowFn(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        $('#weather-info').addClass('error').html('<p>Error: City not found.<br><b> Please refresh the page before you enter the city name!</b></p>').fadeIn();
    } finally {
        $('#loading').hide();
    }
}
function weatherShowFn(data) {
    $('#weather-info').removeClass('error').show();
    $('#city-name').text(data.name);

    
    const timezoneOffset = data.timezone; 
    const localTime = moment().utc().utcOffset(timezoneOffset / 60).format('MMMM Do YYYY, h:mm:ss a');
    
    $('#date').text(localTime);
    $('#temperature').html(`${data.main.temp} °C`);
    $('#description').text(data.weather[0].description);
    $('#weather-now').text('Weather now:');

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    $('#weather-icon').attr('src', iconUrl);

    $('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
}