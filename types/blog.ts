interface GamePerson {
  id: number;
  name: string;
}

interface GameCategory {
  id: number;
  name: string;
}

interface GameMechanic {
  id: number;
  name: string;
}

interface RatingDistribution {
  rating: number;
  count: number;
}

interface GameStats {
  owners?: number;
  players?: number;
  ratings?: number;
  comments?: number;
}

interface GameDetail {
  id: number;
  title: string;
  title_en?: string;
  slug: string;
  year?: number;
  cover_image?: string;
  background_image?: string;
  description?: string;
  content?: string;
  min_players?: number;
  max_players?: number;
  playing_time?: number;
  min_age?: number;
  average_rating?: number;
  rank?: number;
  users_rated?: number;
  rating_distribution?: RatingDistribution[];
  designers?: GamePerson[];
  artists?: GamePerson[];
  publishers?: GamePerson[];
  categories?: GameCategory[];
  mechanics?: GameMechanic[];
  stats?: GameStats;
}