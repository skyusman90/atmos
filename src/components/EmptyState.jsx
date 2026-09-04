import CloudIllustration from './CloudIllustration.jsx';
import './EmptyState.css';

function EmptyState({ onUseMyLocation, geoLoading, geoError }) {
  return (
    <section className="empty-state" aria-label="Getting started">
      <CloudIllustration className="empty-state__illustration" />
      <h2 className="empty-state__title">Welcome to Atmos</h2>
      <p className="empty-state__subtitle">Search for a city to get started.</p>
      <button
        type="button"
        className="empty-state__locate"
        onClick={onUseMyLocation}
        disabled={geoLoading}
      >
        {geoLoading ? 'Locating…' : 'Use my location'}
      </button>
      {geoError && (
        <p className="empty-state__error" role="alert">
          {geoError}
        </p>
      )}
    </section>
  );
}

export default EmptyState;
