import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  DashboardIcon,
  StarIcon,
  StatisticsIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  MapPinIcon,
} from './icons.jsx';
import { convertTemperature } from '../utils/temperature.js';
import './Header.css';

const NAV_LINKS = [
  { path: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { path: '/favourites', label: 'Favourites', icon: StarIcon },
  { path: '/statistics', label: 'Statistics', icon: StatisticsIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

function Header({
  theme,
  onThemeToggle,
  unit,
  onUnitToggle,
  favourites = [],
  favouritesWeather = {},
  onSelectFavourite,
}) {
  const [favouritesOpen, setFavouritesOpen] = useState(false);
  const favouritesRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (favouritesRef.current && !favouritesRef.current.contains(event.target)) {
        setFavouritesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header__side header__side--left">
        <span className="logo">Atmos</span>
      </div>

      <nav className="header__nav" aria-label="Primary">
        {NAV_LINKS.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) => `header__nav-link ${isActive ? 'is-active' : ''}`}
          >
            <span className="header__nav-icon">
              <Icon />
            </span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="header__side header__side--right">
        <div className="unit-toggle" role="group" aria-label="Temperature unit">
          <button
            type="button"
            className={`unit-toggle__option ${unit === 'C' ? 'is-active' : ''}`}
            onClick={() => onUnitToggle('C')}
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-toggle__option ${unit === 'F' ? 'is-active' : ''}`}
            onClick={() => onUnitToggle('F')}
          >
            °F
          </button>
        </div>

        <button
          type="button"
          className="icon-btn theme-toggle"
          aria-label="Toggle theme"
          onClick={onThemeToggle}
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>

        <div className="favourites" ref={favouritesRef}>
          <button
            type="button"
            className={`icon-btn ${favouritesOpen ? 'is-active' : ''}`}
            aria-label="Favourite locations"
            aria-expanded={favouritesOpen}
            onClick={() => setFavouritesOpen((open) => !open)}
          >
            <StarIcon filled={favouritesOpen} />
          </button>

          {favouritesOpen && (
            <div className="favourites__panel">
              <div className="favourites__header">Favourite Locations</div>
              {favourites.length === 0 ? (
                <div className="favourites__empty">
                  No favourites yet. Add one from the Favourites page.
                </div>
              ) : (
                <ul className="favourites__list">
                  {favourites.map((location) => {
                    const region = [location.admin1, location.country].filter(Boolean).join(', ');
                    const temperature = favouritesWeather[location.id]?.current?.temperature_2m;

                    return (
                      <li key={location.id} className="favourites__item">
                        <button
                          type="button"
                          className="favourites__item-btn"
                          onClick={() => {
                            onSelectFavourite?.(location);
                            setFavouritesOpen(false);
                          }}
                        >
                          <span className="favourites__pin">
                            <MapPinIcon />
                          </span>
                          <span className="favourites__info">
                            <span className="favourites__name">{location.name}</span>
                            <span className="favourites__region">{region}</span>
                          </span>
                          <span className="favourites__temp">
                            {temperature == null ? '--°' : `${Math.round(convertTemperature(temperature, unit))}°`}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
