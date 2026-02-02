import { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Film } from "lucide-react";
import { tamilCinemaMovies } from "@/data/movies";

interface TopFilmsTableProps {
  yearRange: [number, number];
}

const TopFilmsTable = ({ yearRange }: TopFilmsTableProps) => {
  const films = useMemo(() => {
    const filtered = tamilCinemaMovies.filter(
      (m) => m.year >= yearRange[0] && m.year <= yearRange[1]
    );

    return filtered
      .filter((m) => typeof m.rating === "number")
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8)
      .map((m) => ({ year: m.year, film: m.title, rating: m.rating || 0 }));
  }, [yearRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-lg p-6 shadow-card"
    >
      <h3 className="font-display text-xl text-foreground mb-6 flex items-center gap-2">
        <Film className="w-5 h-5 text-primary" />
        Top Rated Films
      </h3>
      <div className="space-y-3">
        {films.map((film, index) => (
          <motion.div
            key={`${film.year}-${film.film}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl font-display font-bold text-primary/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-medium text-foreground">{film.film}</p>
                <p className="text-sm text-muted-foreground">{film.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Star className="w-4 h-4 fill-primary" />
              <span className="font-medium">{film.rating}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopFilmsTable;
