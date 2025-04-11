import { Movie } from '../types/Movie';

// This file contains a mapping of movie categories to their display names
// and a function to extract categories from a movie object.
export const CATEGORY_MAP: Record<string, string> = {
  action: 'Action',
  adventure: 'Adventure',
  animeSeriesInternationalTvShows: 'Anime Series',
  britishTvShowsDocuseriesInternationalTvShows: 'British TV Shows',
  children: 'Children',
  comedies: 'Comedies',
  comediesDramasInternationalMovies: 'Comedy-Dramas',
  comediesInternationalMovies: 'International Comedies',
  comediesRomanticMovies: 'Romantic Comedies',
  crimeTvShowsDocuseries: 'Crime Docuseries',
  documentaries: 'Documentaries',
  documentariesInternationalMovies: 'International Documentaries',
  docuseries: 'Docuseries',
  dramas: 'Dramas',
  dramasInternationalMovies: 'International Dramas',
  dramasRomanticMovies: 'Romantic Dramas',
  familyMovies: 'Family Movies',
  fantasy: 'Fantasy',
  horrorMovies: 'Horror',
  internationalMoviesThrillers: 'International Thrillers',
  internationalTvShowsRomanticTvShowsTvDramas: 'Intl. Romantic TV Dramas',
  kidsTv: 'Kids TV',
  languageTvShows: 'Language TV',
  musicals: 'Musicals',
  natureTv: 'Nature TV',
  realityTv: 'Reality TV',
  spirituality: 'Spirituality',
  tvAction: 'TV Action',
  tvComedies: 'TV Comedies',
  tvDramas: 'TV Dramas',
  talkShowsTvComedies: 'Talk Shows',
  thrillers: 'Thrillers',
};

export const getCategories = (movie: Movie): string[] => {
  return Object.keys(CATEGORY_MAP)
    .filter((key) => (movie as any)[key] === 1)
    .map((key) => CATEGORY_MAP[key]);
};
