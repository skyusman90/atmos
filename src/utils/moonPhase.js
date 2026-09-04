const PHASE_NAMES = [
  { upTo: 0.02, name: 'New Moon' },
  { upTo: 0.24, name: 'Waxing Crescent' },
  { upTo: 0.26, name: 'First Quarter' },
  { upTo: 0.49, name: 'Waxing Gibbous' },
  { upTo: 0.51, name: 'Full Moon' },
  { upTo: 0.74, name: 'Waning Gibbous' },
  { upTo: 0.76, name: 'Last Quarter' },
  { upTo: 0.98, name: 'Waning Crescent' },
  { upTo: 1, name: 'New Moon' },
];

export function getMoonPhase(phase) {
  const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100);
  const name = PHASE_NAMES.find((entry) => phase <= entry.upTo)?.name ?? 'New Moon';

  return { phase, illumination, name };
}
