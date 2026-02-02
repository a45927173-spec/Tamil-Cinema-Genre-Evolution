import { useMemo } from "react";
import { motion } from "framer-motion";
import { genreColors, genreDescriptions } from "@/data/moviesData";
import { tamilCinemaMovies } from "@/data/movies";

interface GenreBreakdownProps {
  yearRange: [number, number];
}

const GenreBreakdown = ({ yearRange }: GenreBreakdownProps) => {
  const genreStats = useMemo(() => {
    const filteredMovies = tamilCinemaMovies.filter(
      (m) => m.year >= yearRange[0] && m.year <= yearRange[1]
    );

    const genres = Object.keys(genreColors);

    const genreTotals = genres.reduce((acc: Record<string, number>, genre) => {
      acc[genre] = filteredMovies.filter((m) => m.genre === genre).length;
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(genreTotals).reduce((a, b) => a + b, 0) || 1;

    return genres
      .map((genre) => ({
        name: genre,
        percentage: Math.round((genreTotals[genre] / total) * 100),
        color: genreColors[genre as keyof typeof genreColors],
        description: genreDescriptions[genre],
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [yearRange]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg p-6 shadow-card"
    >
      <h3 className="font-display text-xl text-foreground mb-6">
        Genre Breakdown
      </h3>
      <div className="space-y-4">
        {genreStats.map((genre, index) => (
          <motion.div
            key={genre.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">
                {genre.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {genre.percentage}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${genre.percentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="h-full rounded-full"
                style={{ backgroundColor: genre.color }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {genre.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GenreBreakdown;
