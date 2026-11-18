export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

export function formatTemp(celsius, unit) {
  if (unit === 'F') {
    return `${Math.round(celsiusToFahrenheit(celsius))}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTempLong(celsius, unit) {
  if (unit === 'F') {
    return `${Math.round(celsiusToFahrenheit(celsius))}°F`;
  }
  return `${Math.round(celsius)}°C`;
}
