import { useEffect, useRef, useState } from 'react';
import { SearchIcon, MapPinIcon, StarIcon } from './icons.jsx';
import { searchLocations } from '../api/geocoding.js';
import { useDebouncedValue } from '../hooks/useDebouncedValue.js';
import { getErrorMessage } from '../utils/errors.js';
import { isNonEmptyString } from '../utils/validation.js';
import './SearchBar.css';

function formatLocationMeta(location) {
  return [location.admin1, location.country].filter(Boolean).join(', ');
}

function SearchBar({
  history,
  onSelectLocation,
  onUseMyLocation,
  geoLoading,
  favourites,
  onToggleFavourite,
  placeholder = 'Search for a city...',
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapRef = useRef(null);

  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, 400);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setIsFocused(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isNonEmptyString(debouncedQuery)) {
      return;
    }

    const controller = new AbortController();

    Promise.resolve().then(() => setStatus('loading'));

    searchLocations(debouncedQuery, { signal: controller.signal })
      .then((data) => {
        setResults(data);
        setStatus('success');
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        if (message === null) return;
        setErrorMessage(message);
        setStatus('error');
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  function handleSelect(location) {
    onSelectLocation(location);
    setQuery('');
    setResults([]);
    setStatus('idle');
    setIsFocused(false);
    setActiveIndex(-1);
  }

  function isFavourite(location) {
    return Boolean(favourites) && favourites.some((item) => item.id === location.id);
  }

  function renderFavouriteToggle(location) {
    if (!onToggleFavourite) {
      return null;
    }
    const active = isFavourite(location);
    return (
      <button
        type="button"
        className={`search-dropdown__fav ${active ? 'is-active' : ''}`}
        aria-label={active ? `Remove ${location.name} from favourites` : `Add ${location.name} to favourites`}
        aria-pressed={active}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavourite(location);
        }}
      >
        <StarIcon filled={active} />
      </button>
    );
  }

  const showHistory = trimmedQuery.length === 0 && history.length > 0;
  const showDropdown = isFocused && (trimmedQuery.length > 0 || showHistory);
  const activeList = showHistory ? history : results;

  function handleKeyDown(event) {
    if (!showDropdown || activeList.length === 0) {
      if (event.key === 'Escape') {
        setIsFocused(false);
        setActiveIndex(-1);
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, activeList.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      if (activeIndex >= 0 && activeList[activeIndex]) {
        event.preventDefault();
        handleSelect(activeList[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      setIsFocused(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="search-bar-wrap" ref={wrapRef}>
      <form className="search-bar" role="search" aria-label="Search for a city" onSubmit={(event) => event.preventDefault()}>
        <span className="search-bar__icon">
          {status === 'loading' ? (
            <span className="search-bar__spinner" aria-hidden="true" />
          ) : (
            <SearchIcon />
          )}
        </span>

        <label htmlFor="city-search-input" className="sr-only">
          Search for a city
        </label>
        <input
          id="city-search-input"
          type="text"
          className="search-bar__input"
          placeholder={placeholder}
          autoComplete="off"
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            setActiveIndex(-1);
            if (!isNonEmptyString(value)) {
              setResults([]);
              setStatus('idle');
            }
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
        />

        {onUseMyLocation && (
          <button
            type="button"
            className="search-bar__locate"
            aria-label="Use current location"
            onClick={onUseMyLocation}
            disabled={geoLoading}
          >
            <MapPinIcon />
          </button>
        )}
      </form>

      {showDropdown && (
        <div className="search-dropdown">
          {showHistory && (
            <>
              <div className="search-dropdown__label" id="search-history-label">
                Recent searches
              </div>
              <ul className="search-dropdown__list" id="search-listbox" role="listbox" aria-labelledby="search-history-label">
                {history.map((location, index) => (
                  <li
                    key={location.id}
                    id={`search-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <div className="search-dropdown__row">
                      <button
                        type="button"
                        className={`search-dropdown__item ${index === activeIndex ? 'is-active' : ''}`}
                        onClick={() => handleSelect(location)}
                      >
                        <span className="search-dropdown__icon">
                          <MapPinIcon />
                        </span>
                        <span className="search-dropdown__info">
                          <span className="search-dropdown__name">{location.name}</span>
                          <span className="search-dropdown__meta">{formatLocationMeta(location)}</span>
                        </span>
                      </button>
                      {renderFavouriteToggle(location)}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {!showHistory && status === 'loading' && (
            <div className="search-dropdown__state" role="status">
              Searching…
            </div>
          )}

          {!showHistory && status === 'error' && (
            <div className="search-dropdown__state search-dropdown__state--error" role="alert">
              {errorMessage || 'Something went wrong. Please try again.'}
            </div>
          )}

          {!showHistory && status === 'success' && results.length === 0 && (
            <div className="search-dropdown__state" role="status">
              No locations found for &ldquo;{debouncedQuery}&rdquo;.
            </div>
          )}

          {!showHistory && status === 'success' && results.length > 0 && (
            <ul className="search-dropdown__list" id="search-listbox" role="listbox">
              {results.map((location, index) => (
                <li
                  key={location.id}
                  id={`search-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <div className="search-dropdown__row">
                    <button
                      type="button"
                      className={`search-dropdown__item ${index === activeIndex ? 'is-active' : ''}`}
                      onClick={() => handleSelect(location)}
                    >
                      <span className="search-dropdown__icon">
                        <MapPinIcon />
                      </span>
                      <span className="search-dropdown__info">
                        <span className="search-dropdown__name">{location.name}</span>
                        <span className="search-dropdown__meta">{formatLocationMeta(location)}</span>
                      </span>
                      <span className="search-dropdown__coords">
                        {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                      </span>
                    </button>
                    {renderFavouriteToggle(location)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
