import { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Calendar } from "lucide-react";
import { tamilCinemaMovies } from "@/data/movies";

interface TopFilmsGridProps {
  yearRange: [number, number];
}

const TopFilmsGrid = ({ yearRange }: TopFilmsGridProps) => {
  const films = useMemo(() => {
    // Define the 12 specific blockbuster movies to always display
    const blockbusterTitles = [
      "Leo",
      "2.0",
      "Sarkar",
      "Petta",
      "Bigil",
      "Master",
      "Vikram",
      "Ponniyin Selvan: I",
      "Ponniyin Selvan: II",
      "Jailer",
      "Mark Antony",
      "Captain Miller"
    ];

    // Filter for only these 12 specific movies and sort by rating
    return tamilCinemaMovies
      .filter((m) => blockbusterTitles.includes(m.title) && typeof m.rating === "number")
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .map((m, idx) => ({ 
        year: m.year, 
        title: m.title, 
        rating: m.rating || 0,
        revenue: m.revenue || 0,
        posterUrl: m.posterUrl || "/placeholder.svg",
        rank: idx + 1
      }));
  }, []);

  const getRankGradient = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500";
    if (rank === 3) return "bg-gradient-to-br from-orange-400 to-orange-600";
    return "bg-gradient-to-br from-primary to-accent";
  };

  const formatRevenue = (revenue: number) => {
    if (revenue >= 1000000000) return `₹${(revenue / 1000000000).toFixed(1)}B`;
    if (revenue >= 1000000) return `₹${(revenue / 1000000).toFixed(1)}M`;
    return `₹${(revenue / 1000).toFixed(0)}K`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {films.map((film, index) => (
          <motion.div
            key={`${film.year}-${film.title}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="overflow-hidden group transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 h-full flex flex-col cursor-pointer max-w-[320px] rounded-xl border border-muted/20 bg-card">
              {/* Movie Poster */}
              <div className="w-full">
                <div className="relative w-full aspect-[2/3] bg-gradient-to-br from-primary/20 via-accent/10 to-muted overflow-hidden rounded-t-xl">
                  <img
                    src={film.posterUrl}
                    alt={film.title}
                    className="w-full h-full object-cover object-center block transform-gpu group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (!img.dataset.fallback) {
                        img.dataset.fallback = '1';
                        img.src = '/placeholder.svg';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                  {/* Badges on poster */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <div className="flex justify-between items-start">
                      <div className={`${getRankGradient(film.rank)} rounded-full w-10 h-10 flex items-center justify-center shadow-lg`}>
                        <span className="font-display font-bold text-white text-sm">#{film.rank}</span>
                      </div>
                      {film.rating && (
                        <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground rounded-full px-2 py-1 backdrop-blur-sm">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold">{film.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display text-lg font-bold text-white line-clamp-2 drop-shadow-md">
                        {film.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 border-t border-muted/10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-medium">{film.year}</span>
                    </div>
                    {film.revenue > 0 && (
                      <div className="text-xs bg-primary/10 px-2 py-1 rounded">
                        ₹{(film.revenue / 10000000).toFixed(1)}Cr
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer - Revenue Tag */}
                <div className="flex items-center justify-center pt-2 border-t border-muted/10 w-full">
                  {film.revenue > 0 && (
                    <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-lg px-3 py-2 w-fit">
                      <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                      <span className="font-semibold text-green-300 text-xs">{formatRevenue(film.revenue)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopFilmsGrid;
