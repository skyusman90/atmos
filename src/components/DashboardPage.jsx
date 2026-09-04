import SearchBar from './SearchBar.jsx';
import EmptyState from './EmptyState.jsx';
import CurrentWeatherCard from './CurrentWeatherCard.jsx';
import SunMoonCard from './SunMoonCard.jsx';
import HourlyWeatherCard from './HourlyWeatherCard.jsx';
import AirQualityCard from './AirQualityCard.jsx';
import DailyForecastCard from './DailyForecastCard.jsx';
import CompareLocationsSection from './CompareLocationsSection.jsx';

function DashboardPage({
  settings,
  searchHistory,
  favourites,
  onSelectLocation,
  onUseMyLocation,
  geoLoading,
  geoError,
  onToggleFavourite,
  activeLocation,
  weatherData,
  weatherStatus,
  weatherError,
  weatherLastUpdated,
  refreshWeather,
  airQualityData,
  airQualityStatus,
  airQualityError,
  onViewDetails,
}) {
  return (
    <section className="app__search" aria-label="Weather lookup">
      <SearchBar
        history={searchHistory}
        onSelectLocation={onSelectLocation}
        onUseMyLocation={onUseMyLocation}
        geoLoading={geoLoading}
        favourites={favourites}
        onToggleFavourite={onToggleFavourite}
      />

      {activeLocation ? (
        <div className="weather-row">
          <CurrentWeatherCard
            location={activeLocation}
            weather={weatherData}
            status={weatherStatus}
            error={weatherError}
            unit={settings.temperatureUnit}
            windSpeedUnit={settings.windSpeedUnit}
            precipitationUnit={settings.precipitationUnit}
            timeFormat={settings.timeFormat}
            dateFormat={settings.dateFormat}
            lastUpdated={weatherLastUpdated}
            onRefresh={refreshWeather}
            onViewDetails={onViewDetails}
          />

          <SunMoonCard
            weather={weatherData}
            status={weatherStatus}
            error={weatherError}
            timeFormat={settings.timeFormat}
          />

          <div className="forecast-row">
            <HourlyWeatherCard
              weather={weatherData}
              status={weatherStatus}
              error={weatherError}
              unit={settings.temperatureUnit}
              windSpeedUnit={settings.windSpeedUnit}
              precipitationUnit={settings.precipitationUnit}
              timeFormat={settings.timeFormat}
            />

            <AirQualityCard
              airQuality={airQualityData}
              status={airQualityStatus}
              error={airQualityError}
              aqiScale={settings.aqiScale}
            />
          </div>

          <DailyForecastCard
            weather={weatherData}
            status={weatherStatus}
            error={weatherError}
            unit={settings.temperatureUnit}
            windSpeedUnit={settings.windSpeedUnit}
            precipitationUnit={settings.precipitationUnit}
            timeFormat={settings.timeFormat}
            dateFormat={settings.dateFormat}
          />
        </div>
      ) : (
        <EmptyState onUseMyLocation={onUseMyLocation} geoLoading={geoLoading} geoError={geoError} />
      )}

      <CompareLocationsSection
        favourites={favourites}
        searchHistory={searchHistory}
        settings={{
          unit: settings.temperatureUnit,
          windSpeedUnit: settings.windSpeedUnit,
          precipitationUnit: settings.precipitationUnit,
          aqiScale: settings.aqiScale,
        }}
      />
    </section>
  );
}

export default DashboardPage;
