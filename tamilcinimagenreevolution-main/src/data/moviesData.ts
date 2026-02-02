// Mock data representing Tamil film genre evolution from 2004-2024
export interface MovieYear {
  year: number;
  genres: {
    Action: number;
    Romance: number;
    Drama: number;
    Comedy: number;
    Thriller: number;
    Horror: number;
    Family: number;
    Musical: number;
  };
  totalFilms: number;
  topFilm: string;
  avgRating: number;
}

export const genreColors = {
  Action: "hsl(var(--chart-action))",
  Romance: "hsl(var(--chart-romance))",
  Drama: "hsl(var(--chart-drama))",
  Comedy: "hsl(var(--chart-comedy))",
  Thriller: "hsl(var(--chart-thriller))",
  Horror: "hsl(var(--chart-horror))",
  Family: "hsl(var(--chart-family))",
  Musical: "hsl(var(--chart-musical))",
};

export const moviesData: MovieYear[] = [
  { year: 2004, genres: { Action: 35, Romance: 28, Drama: 20, Comedy: 8, Thriller: 4, Horror: 2, Family: 2, Musical: 1 }, totalFilms: 142, topFilm: "Ghilli", avgRating: 6.8 },
  { year: 2005, genres: { Action: 32, Romance: 30, Drama: 22, Comedy: 7, Thriller: 4, Horror: 2, Family: 2, Musical: 1 }, totalFilms: 156, topFilm: "Chandramukhi", avgRating: 7.1 },
  { year: 2006, genres: { Action: 30, Romance: 32, Drama: 20, Comedy: 9, Thriller: 4, Horror: 2, Family: 2, Musical: 1 }, totalFilms: 148, topFilm: "Varalaru", avgRating: 6.9 },
  { year: 2007, genres: { Action: 28, Romance: 30, Drama: 22, Comedy: 10, Thriller: 5, Horror: 2, Family: 2, Musical: 1 }, totalFilms: 165, topFilm: "Sivaji", avgRating: 7.3 },
  { year: 2008, genres: { Action: 30, Romance: 28, Drama: 20, Comedy: 12, Thriller: 5, Horror: 2, Family: 2, Musical: 1 }, totalFilms: 158, topFilm: "Dasavathaaram", avgRating: 6.7 },
  { year: 2009, genres: { Action: 28, Romance: 26, Drama: 22, Comedy: 12, Thriller: 6, Horror: 3, Family: 2, Musical: 1 }, totalFilms: 172, topFilm: "Ayan", avgRating: 6.8 },
  { year: 2010, genres: { Action: 26, Romance: 28, Drama: 22, Comedy: 11, Thriller: 7, Horror: 3, Family: 2, Musical: 1 }, totalFilms: 180, topFilm: "Enthiran", avgRating: 7.5 },
  { year: 2011, genres: { Action: 25, Romance: 26, Drama: 24, Comedy: 12, Thriller: 7, Horror: 3, Family: 2, Musical: 1 }, totalFilms: 188, topFilm: "Mankatha", avgRating: 7.0 },
  { year: 2012, genres: { Action: 24, Romance: 24, Drama: 26, Comedy: 12, Thriller: 8, Horror: 3, Family: 2, Musical: 1 }, totalFilms: 195, topFilm: "3", avgRating: 7.2 },
  { year: 2013, genres: { Action: 22, Romance: 22, Drama: 28, Comedy: 13, Thriller: 8, Horror: 4, Family: 2, Musical: 1 }, totalFilms: 202, topFilm: "Thuppakki", avgRating: 7.4 },
  { year: 2014, genres: { Action: 20, Romance: 20, Drama: 28, Comedy: 14, Thriller: 10, Horror: 4, Family: 3, Musical: 1 }, totalFilms: 210, topFilm: "Veeram", avgRating: 6.9 },
  { year: 2015, genres: { Action: 18, Romance: 18, Drama: 30, Comedy: 14, Thriller: 12, Horror: 4, Family: 3, Musical: 1 }, totalFilms: 215, topFilm: "I", avgRating: 7.1 },
  { year: 2016, genres: { Action: 18, Romance: 16, Drama: 30, Comedy: 15, Thriller: 12, Horror: 5, Family: 3, Musical: 1 }, totalFilms: 220, topFilm: "Kabali", avgRating: 6.8 },
  { year: 2017, genres: { Action: 16, Romance: 14, Drama: 32, Comedy: 16, Thriller: 12, Horror: 5, Family: 4, Musical: 1 }, totalFilms: 228, topFilm: "Mersal", avgRating: 7.3 },
  { year: 2018, genres: { Action: 15, Romance: 12, Drama: 32, Comedy: 18, Thriller: 13, Horror: 5, Family: 4, Musical: 1 }, totalFilms: 235, topFilm: "96", avgRating: 7.8 },
  { year: 2019, genres: { Action: 14, Romance: 12, Drama: 30, Comedy: 18, Thriller: 14, Horror: 6, Family: 5, Musical: 1 }, totalFilms: 242, topFilm: "Bigil", avgRating: 6.9 },
  { year: 2020, genres: { Action: 12, Romance: 10, Drama: 32, Comedy: 18, Thriller: 16, Horror: 6, Family: 5, Musical: 1 }, totalFilms: 145, topFilm: "Master", avgRating: 7.2 },
  { year: 2021, genres: { Action: 14, Romance: 10, Drama: 30, Comedy: 18, Thriller: 16, Horror: 6, Family: 5, Musical: 1 }, totalFilms: 168, topFilm: "Karnan", avgRating: 7.5 },
  { year: 2022, genres: { Action: 16, Romance: 10, Drama: 28, Comedy: 18, Thriller: 16, Horror: 6, Family: 5, Musical: 1 }, totalFilms: 225, topFilm: "Vikram", avgRating: 7.8 },
  { year: 2023, genres: { Action: 18, Romance: 10, Drama: 26, Comedy: 18, Thriller: 16, Horror: 6, Family: 5, Musical: 1 }, totalFilms: 248, topFilm: "Leo", avgRating: 7.4 },
  { year: 2024, genres: { Action: 20, Romance: 10, Drama: 24, Comedy: 18, Thriller: 16, Horror: 6, Family: 5, Musical: 1 }, totalFilms: 132, topFilm: "GOAT", avgRating: 7.1 },
];

export const genreDescriptions: Record<string, string> = {
  Action: "High-octane stunts, fights, and hero-centric narratives",
  Romance: "Love stories and relationship-driven plots",
  Drama: "Character-focused storytelling with emotional depth",
  Comedy: "Humor-driven entertainment and satire",
  Thriller: "Suspense, mystery, and psychological tension",
  Horror: "Supernatural and fear-inducing narratives",
  Family: "Multi-generational stories and family dynamics",
  Musical: "Music-centric films with elaborate song sequences",
};
