import { useState } from 'react';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import SearchBar from './SearchBar.jsx';
import { StarIcon, PlusIcon, CloseIcon } from './icons.jsx';
import { getWeatherInfo } from '../utils/weatherCodes.js';
import { getWeatherBackground } from '../utils/weatherBackground.js';
import { convertTemperature } from '../utils/temperature.js';
import { useSettings } from '../hooks/useSettings.js';
import './FavouritesPage.css';

function renderConditionIcon(category, isDay) {
  const iconProps = { size: '1em', strokeWidth: 1.7 };
  switch (category) {
    case 'clear':
      return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
    case 'cloudy':
      return <Cloud {...iconProps} />;
    case 'rain':
      return <CloudRain {...iconProps} />;
    case 'snow':
      return <CloudSnow {...iconProps} />;
    case 'thunderstorm':
      return <CloudLightning {...iconProps} />;
    case 'fog':
      return <CloudFog {...iconProps} />;
    default:
      return <Cloud {...iconProps} />;
  }
}

function FavouriteCard({ favourite, weather, status, unit, onSelect, onRemove }) {
  const current = weather?.current;
  const daily = weather?.daily;
  const isLoading = status === 'loading' && !weather;

  const { category, label } = current ? getWeatherInfo(current.weather_code) : { category: 'clear', label: '' };
  const isDay = current ? current.is_day === 1 : true;
  const background = current
    ? getWeatherBackground({
        category,
        isDay,
        currentTime: current.time,
        sunrise: daily?.sunrise?.[0],
        sunset: daily?.sunset?.[0],
      })
    : null;

  const meta = [favourite.admin1, favourite.country].filter(Boolean).join(', ');
  const temperature = current ? convertTemperature(current.temperature_2m, unit) : null;

  return (
    <button
      type="button"
      className="favourite-card"
      style={background ? { backgroundImage: `url(${background})` } : undefined}
      onClick={() => onSelect(favourite)}
      aria-label={`View weather for ${favourite.name}`}
    >
      <span className="favourite-card__overlay" aria-hidden="true" />

      <span
        className="favourite-card__remove"
        role="button"
        tabIndex={0}
        aria-label={`Remove ${favourite.name} from favourites`}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(favourite.id);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.stopPropagation();
            event.preventDefault();
            onRemove(favourite.id);
          }
        }}
      >
        <CloseIcon />
      </span>

      <span className="favourite-card__content">
        <span className="favourite-card__top">
          <span className="favourite-card__name">{favourite.name}</span>
          {meta && <span className="favourite-card__meta">{meta}</span>}
        </span>

        <span className="favourite-card__bottom">
          {temperature !== null && (
            <span className="favourite-card__icon">{renderConditionIcon(category, isDay)}</span>
          )}
          <span className="favourite-card__temp">
            {isLoading || temperature === null ? '--°' : `${Math.round(temperature)}°${unit}`}
          </span>
          {current && <span className="favourite-card__condition">{label}</span>}
        </span>
      </span>
    </button>
  );
}

function FavouritesPage({
  favourites,
  weatherMap,
  weatherStatus,
  searchHistory,
  onSelectFavourite,
  onAddFavourite,
  onRemoveFavourite,
  onToggleFavourite,
  onClearFavourites,
}) {
  const { settings } = useSettings();
  const [isAdding, setIsAdding] = useState(false);

  function handleAddSelect(location) {
    onAddFavourite(location);
    setIsAdding(false);
  }

  return (
    <section className="favourites-page" aria-label="Favourites">
      <div className="favourites-page__header">
        <div className="favourites-page__heading">
          <span className="favourites-page__heading-icon">
            <StarIcon />
          </span>
          <h1 className="favourites-page__title">Favourites</h1>
        </div>

        <div className="favourites-page__controls">
          {isAdding && (
            <div className="favourites-page__search">
              <SearchBar
                history={searchHistory}
                onSelectLocation={handleAddSelect}
                favourites={favourites}
                onToggleFavourite={onToggleFavourite}
                placeholder="Search for a city to add..."
              />
            </div>
          )}

          <button
            type="button"
            className="favourites-page__add-btn"
            onClick={() => setIsAdding((open) => !open)}
            aria-expanded={isAdding}
          >
            {isAdding ? <CloseIcon /> : <PlusIcon />}
            {isAdding ? 'Close' : 'Add Favourite'}
          </button>

          {favourites.length > 0 && (
            <button type="button" className="favourites-page__clear-btn" onClick={onClearFavourites}>
              Clear
            </button>
          )}
        </div>
      </div>

      {favourites.length === 0 ? (
        <div className="favourites-page__empty">
          <p className="favourites-page__empty-text">You haven&rsquo;t added any favourite locations yet.</p>
          <p className="favourites-page__empty-hint">
            Use &ldquo;Add Favourite&rdquo; to search and save a location for quick access.
          </p>
        </div>
      ) : (
        <div className="favourites-page__grid">
          {favourites.map((favourite) => (
            <FavouriteCard
              key={favourite.id}
              favourite={favourite}
              weather={weatherMap[favourite.id]}
              status={weatherStatus}
              unit={settings.temperatureUnit}
              onSelect={onSelectFavourite}
              onRemove={onRemoveFavourite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FavouritesPage;
