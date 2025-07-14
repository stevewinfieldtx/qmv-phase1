import { validateSongInfo } from '../utils/validation';

describe('validateSongInfo', () => {
  it('should return errors for missing fields', () => {
    const errs = validateSongInfo({
      artistReference: '',
      overallTone: '',
      speed: '',
      videoLength: 5,
      ageAudience: 'all',
      additionalNotes: '',
    });
    expect(errs.overallTone).toBeDefined();
    expect(errs.speed).toBeDefined();
    expect(errs.videoLength).toBeDefined();
  });

  it('should return empty object when valid', () => {
    const errs = validateSongInfo({
      artistReference: '',
      overallTone: 'happy',
      speed: 'medium',
      videoLength: 30,
      ageAudience: 'all',
      additionalNotes: '',
    });
    expect(Object.keys(errs)).toHaveLength(0);
  });
});