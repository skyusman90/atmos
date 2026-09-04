import clearDay from '../assets/clear_day.jpg';
import clearNight from '../assets/clear_night.jpg';
import cloudyDay from '../assets/cloudy_day.jpg';
import cloudyNight from '../assets/cloudy_night.jpg';
import raining from '../assets/raining.jpg';
import snowing from '../assets/snowing.jpg';
import sunriseImage from '../assets/sunrise.jpg';
import sunsetImage from '../assets/sunset.jpg';
import thunderstorm from '../assets/thunderstorm.jpg';

function getGoldenHourPeriod(currentTime, sunrise, sunset, windowMinutes = 40) {
  if (!sunrise || !sunset) return null;

  const current = new Date(currentTime).getTime();
  const windowMs = windowMinutes * 60 * 1000;

  if (Math.abs(current - new Date(sunrise).getTime()) <= windowMs) {
    return 'sunrise';
  }
  if (Math.abs(current - new Date(sunset).getTime()) <= windowMs) {
    return 'sunset';
  }
  return null;
}

export function getWeatherBackground({ category, isDay, currentTime, sunrise, sunset }) {
  if (category === 'clear' || category === 'cloudy') {
    const goldenHour = getGoldenHourPeriod(currentTime, sunrise, sunset);
    if (goldenHour === 'sunrise') {
      return sunriseImage;
    }
    if (goldenHour === 'sunset') {
      return sunsetImage;
    }
  }

  switch (category) {
    case 'thunderstorm':
      return thunderstorm;
    case 'snow':
      return snowing;
    case 'rain':
      return raining;
    case 'fog':
      return isDay ? cloudyDay : cloudyNight;
    case 'cloudy':
      return isDay ? cloudyDay : cloudyNight;
    default:
      return isDay ? clearDay : clearNight;
  }
}
