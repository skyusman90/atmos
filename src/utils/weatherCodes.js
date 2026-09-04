const WEATHER_CODES = {
  0: { label: 'Clear Sky', category: 'clear' },
  1: { label: 'Mainly Clear', category: 'clear' },
  2: { label: 'Partly Cloudy', category: 'cloudy' },
  3: { label: 'Overcast', category: 'cloudy' },
  45: { label: 'Fog', category: 'fog' },
  48: { label: 'Rime Fog', category: 'fog' },
  51: { label: 'Light Drizzle', category: 'rain' },
  53: { label: 'Drizzle', category: 'rain' },
  55: { label: 'Dense Drizzle', category: 'rain' },
  56: { label: 'Freezing Drizzle', category: 'rain' },
  57: { label: 'Dense Freezing Drizzle', category: 'rain' },
  61: { label: 'Light Rain', category: 'rain' },
  63: { label: 'Rain', category: 'rain' },
  65: { label: 'Heavy Rain', category: 'rain' },
  66: { label: 'Freezing Rain', category: 'rain' },
  67: { label: 'Heavy Freezing Rain', category: 'rain' },
  71: { label: 'Light Snow', category: 'snow' },
  73: { label: 'Snow', category: 'snow' },
  75: { label: 'Heavy Snow', category: 'snow' },
  77: { label: 'Snow Grains', category: 'snow' },
  80: { label: 'Light Showers', category: 'rain' },
  81: { label: 'Showers', category: 'rain' },
  82: { label: 'Heavy Showers', category: 'rain' },
  85: { label: 'Snow Showers', category: 'snow' },
  86: { label: 'Heavy Snow Showers', category: 'snow' },
  95: { label: 'Thunderstorm', category: 'thunderstorm' },
  96: { label: 'Thunderstorm & Hail', category: 'thunderstorm' },
  99: { label: 'Severe Thunderstorm', category: 'thunderstorm' },
};

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] ?? { label: 'Unknown', category: 'clear' };
}
