import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Film, TrendingUp, Star, Calendar, ArrowUp, ArrowDown, Zap } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import YearRangeSlider from "@/components/YearRangeSlider";
import GenreChart from "@/components/GenreChart";
import GenreBreakdown from "@/components/GenreBreakdown";
import RevenueTrend from "@/components/RevenueTrend";
import RatingsDistribution from "@/components/RatingsDistribution";
import TopRevenueBars from "@/components/TopRevenueBars";
import TopFilmsGrid from "@/components/TopFilmsGrid";
import { tamilCinemaMovies, TOP_BLOCKBUSTERS } from "@/data/movies";

const Index = () => {
  const minYear = useMemo(() => Math.min(...tamilCinemaMovies.map(m => m.year)), []);
  const maxYear = useMemo(() => Math.max(...tamilCinemaMovies.map(m => m.year)), []);

  // initialize to full range of dataset
  const [yearRange, setYearRange] = useState<[number, number]>(() => [minYear, maxYear]);

  const stats = useMemo(() => {
    // Use only the explicit top blockbusters for all 'top movie' KPI values
    const topTitles = TOP_BLOCKBUSTERS;
    const topMovies = tamilCinemaMovies.filter((m) => topTitles.includes(m.title));

    const totalFilms = topMovies.length;

    const avgRating = topMovies.length > 0
      ? (topMovies.reduce((sum, m) => sum + (m.rating || 0), 0) / topMovies.length).toFixed(1)
      : "—";

    // Leading genre among top movies
    const genreCounts = topMovies.reduce((acc: Record<string, number>, m) => {
      acc[m.genre] = (acc[m.genre] || 0) + 1;
      return acc;
    }, {});

    const topGenre = Object.entries(genreCounts).length > 0
      ? Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "—";

    const uniqueYears = new Set(topMovies.map((m) => m.year)).size;

    // Top rated movie (from the 12)
    const topRated = topMovies.length > 0
      ? topMovies.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0))[0]
      : null;

    // Top grossing movie (from the 12)
    const topGrossing = topMovies.length > 0
      ? topMovies.slice().sort((a, b) => (b.revenue || 0) - (a.revenue || 0))[0]
      : null;

    return { totalFilms, avgRating, topGenre, years: uniqueYears, topRated, topGrossing };
  }, [yearRange]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* pass a custom hero background (use a path under `public/` or an external URL) */}
      <HeroSection backgroundSrc="/posters/kollywood-home.png" />

      {/* Year Range Selector */}
      <section className="py-8 border-y border-border bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-display text-lg text-foreground">
                Select Year Range
              </h2>
              <p className="text-sm text-muted-foreground">
                Drag the handles to filter the data
              </p>
              <div className="mt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                <span>Dataset range: <span className="font-medium text-foreground">{minYear} - {maxYear}</span></span>
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={() => setYearRange([minYear, maxYear])}
                >
                  Reset
                </button>
              </div>
            </div>
            <YearRangeSlider
              min={minYear}
              max={maxYear}
              values={yearRange}
              onChange={setYearRange}
            />
          </div>
        </div>
      </section>

      {/* Premium KPI Cards with Trend Indicators */}
      <section className="py-12 bg-gradient-to-b from-card/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">Key Metrics</h2>
            <p className="text-sm text-muted-foreground">Real-time analytics dashboard</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Top Movies Count", value: stats.totalFilms, icon: Film, trend: "12 total", positive: true },
              { title: "Top Avg Rating", value: `${stats.avgRating}⭐`, icon: Star, trend: "+N/A", positive: true },
              { title: "Top Genre", value: stats.topGenre, icon: TrendingUp, trend: "Leader", positive: true },
              { title: "Years Covered", value: stats.years, icon: Calendar, trend: "Range", positive: true },
              { title: "Top Rated (12)", value: stats.topRated ? `${stats.topRated.title} (${stats.topRated.rating?.toFixed?.(1) || stats.topRated.rating}⭐` : "—", icon: Star, trend: "Live", positive: true },
              { title: "Top Grossing (12)", value: stats.topGrossing ? `${stats.topGrossing.title} (${Math.round(stats.topGrossing.revenue/10000000)}Cr)` : "—", icon: TrendingUp, trend: "Live", positive: true },
            ].map((kpi, idx) => (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                className="group bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-primary/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <kpi.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.positive ? 'text-green-400' : 'text-red-400'}`}>
                    {kpi.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span>{kpi.trend}</span>
                  </div>
                </div>
                <h3 className="text-muted-foreground text-sm font-medium mb-2">{kpi.title}</h3>
                <p className="font-display text-2xl md:text-3xl font-bold text-foreground">{kpi.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Charts with Enhanced Layout */}
      <section className="py-12 bg-gradient-to-b from-background to-card/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">Genre Trends & Analysis</h2>
            <p className="text-sm text-muted-foreground">Historical data visualization with interactive charts</p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <RevenueTrend yearRange={yearRange} />
            </motion.div>

            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <RatingsDistribution yearRange={yearRange} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <TopRevenueBars />
              </motion.div>
            </div>

          </div>

          {/* Key Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 backdrop-blur"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-lg text-foreground">Key Insights</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <div className="w-1 bg-primary rounded-full" />
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Trending</p>
                  <p className="text-foreground font-medium">{stats.topGenre} dominates the dataset</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 bg-accent rounded-full" />
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Coverage</p>
                  <p className="text-foreground font-medium">{stats.totalFilms} films analyzed</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 bg-secondary rounded-full" />
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Quality</p>
                  <p className="text-foreground font-medium">Avg rating: {stats.avgRating}⭐</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Top Films - Premium Card Grid */}
      <section className="py-12 pb-20 bg-gradient-to-b from-card/20 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">🎬 Top Performing Films</h2>
            <p className="text-sm text-muted-foreground">Ranked by ratings and revenue impact</p>
          </motion.div>
          <TopFilmsGrid yearRange={yearRange} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Tamil Genre Evolution • Data Visualization Project
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
