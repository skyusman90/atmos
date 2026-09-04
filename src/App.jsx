import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from './components/Header.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import FavouritesPage from './components/FavouritesPage.jsx';
import StatisticsPage from './components/StatisticsPage.jsx';
import { getSearchHistory, addSearchHistory } from './utils/searchHistory.js';
import { getFavourites, addFavourite, removeFavourite, clearFavourites, isFavourite } from './utils/favourites.js';
import { getFavouritesHistory, addFavouritesHistoryEntry, clearFavouritesHistory } from './utils/favouritesHistory.js';
import { locationToParams, paramsToLocation } from './utils/locationQueryParams.js';
import { useCurrentWeather } from './hooks/useCurrentWeather.js';
import { useAirQuality } from './hooks/useAirQuality.js';
import { useFavouritesWeather } from './hooks/useFavouritesWeather.js';
import { isValidCoordinate, isValidLocationResult } from './utils/validation.js';
import { useSettings } from './hooks/useSettings.js';

import './App.css';

function App() {
  const { settings, updateSetting } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeLocation, setActiveLocation] = useState(() => paramsToLocation(searchParams));
  const [searchHistory, setSearchHistory] = useState(() => getSearchHistory());
  const [favourites, setFavourites] = useState(() => getFavourites());
  const [favouritesHistory, setFavouritesHistory] = useState(() => getFavouritesHistory());
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const { data: favouritesWeather, status: favouritesWeatherStatus } = useFavouritesWeather(favourites);

  const {
    data: weatherData,
    status: weatherStatus,
    error: weatherError,
    lastUpdated: weatherLastUpdated,
    refresh: refreshWeather,
  } = useCurrentWeather(activeLocation?.latitude, activeLocation?.longitude);

  const {
    data: airQualityData,
    status: airQualityStatus,
    error: airQualityError,
  } = useAirQuality(activeLocation?.latitude, activeLocation?.longitude);

  const effectiveTheme =
    settings.theme === 'auto'
      ? weatherData?.current?.is_day === 0
        ? 'dark'
        : 'light'
      : settings.theme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  // Keep the dashboard URL's query params in sync with the active location,
  // so the current view is bookmarkable/shareable and back/forward-aware.
  useEffect(() => {
    if (location.pathname !== '/') {
      return;
    }
    setSearchParams(locationToParams(activeLocation), { replace: !activeLocation });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocation, location.pathname]);

  function handleSelectLocation(selected) {
    if (!isValidLocationResult(selected)) {
      return;
    }
    setActiveLocation(selected);
    setGeoError(null);
    setSearchHistory(addSearchHistory(selected));
  }

  function handleAddFavourite(favourite) {
    if (!isValidLocationResult(favourite) || isFavourite(favourites, favourite.id)) {
      return;
    }
    setFavourites(addFavourite(favourite));
    setFavouritesHistory(addFavouritesHistoryEntry(favourite, 'added'));
  }

  function handleRemoveFavourite(id) {
    const removed = favourites.find((item) => item.id === id);
    setFavourites(removeFavourite(id));
    if (removed) {
      setFavouritesHistory(addFavouritesHistoryEntry(removed, 'removed'));
    }
  }

  function handleToggleFavourite(favourite) {
    if (isFavourite(favourites, favourite.id)) {
      handleRemoveFavourite(favourite.id);
    } else {
      handleAddFavourite(favourite);
    }
  }

  function handleClearFavouritesHistory() {
    setFavouritesHistory(clearFavouritesHistory());
  }

  function handleClearFavourites() {
    let updatedHistory = favouritesHistory;
    favourites.forEach((favourite) => {
      updatedHistory = addFavouritesHistoryEntry(favourite, 'removed');
    });
    setFavouritesHistory(updatedHistory);
    setFavourites(clearFavourites());
  }

  function handleSelectFavourite(favourite) {
    setActiveLocation(favourite);
    setGeoError(null);
    navigate('/');
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!isValidCoordinate(latitude, longitude)) {
          setGeoError('Received an invalid location. Please try again.');
          setGeoLoading(false);
          return;
        }

        setActiveLocation({
          id: 'current-location',
          name: 'Current Location',
          country: '',
          admin1: '',
          latitude,
          longitude,
        });
        setGeoLoading(false);
      },
      () => {
        setGeoError('Unable to retrieve your location.');
        setGeoLoading(false);
      }
    );
  }

  return (
    <div className="app">
      <Header
        theme={effectiveTheme}
        onThemeToggle={() => updateSetting('theme', effectiveTheme === 'dark' ? 'light' : 'dark')}
        unit={settings.temperatureUnit}
        onUnitToggle={(value) => updateSetting('temperatureUnit', value)}
        favourites={favourites}
        favouritesWeather={favouritesWeather}
        onSelectFavourite={handleSelectFavourite}
      />

      <div className="app__body">
        <main className="app__content">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  settings={settings}
                  searchHistory={searchHistory}
                  favourites={favourites}
                  onSelectLocation={handleSelectLocation}
                  onUseMyLocation={handleUseMyLocation}
                  geoLoading={geoLoading}
                  geoError={geoError}
                  onToggleFavourite={handleToggleFavourite}
                  activeLocation={activeLocation}
                  weatherData={weatherData}
                  weatherStatus={weatherStatus}
                  weatherError={weatherError}
                  weatherLastUpdated={weatherLastUpdated}
                  refreshWeather={refreshWeather}
                  airQualityData={airQualityData}
                  airQualityStatus={airQualityStatus}
                  airQualityError={airQualityError}
                  onViewDetails={() => navigate('/statistics')}
                />
              }
            />

            <Route
              path="/favourites"
              element={
                <FavouritesPage
                  favourites={favourites}
                  weatherMap={favouritesWeather}
                  weatherStatus={favouritesWeatherStatus}
                  searchHistory={searchHistory}
                  onSelectFavourite={handleSelectFavourite}
                  onAddFavourite={handleAddFavourite}
                  onRemoveFavourite={handleRemoveFavourite}
                  onToggleFavourite={handleToggleFavourite}
                  onClearFavourites={handleClearFavourites}
                />
              }
            />

            <Route
              path="/settings"
              element={
                <SettingsPage
                  location={activeLocation}
                  weather={weatherData}
                  weatherStatus={weatherStatus}
                  airQuality={airQualityData}
                  favouritesHistory={favouritesHistory}
                  onClearFavouritesHistory={handleClearFavouritesHistory}
                />
              }
            />

            <Route
              path="/statistics"
              element={
                <StatisticsPage
                  location={activeLocation}
                  weather={weatherData}
                  weatherStatus={weatherStatus}
                  airQuality={airQualityData}
                />
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
