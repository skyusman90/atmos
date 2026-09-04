export function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

export function convertTemperature(celsius, unit) {
  return unit === 'F' ? celsiusToFahrenheit(celsius) : celsius;
}
