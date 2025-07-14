import type { SongInfo, ErrorsMap } from '../types/form';

export function validateSongInfo(info: SongInfo): ErrorsMap {
  const errs: ErrorsMap = {};
  if (!info.overallTone) errs.overallTone = 'Tone is required';
  if (!info.speed) errs.speed = 'Speed required';
  if (!info.videoLength || info.videoLength < 10) errs.videoLength = 'Video length must be >=10s';
  return errs;
}