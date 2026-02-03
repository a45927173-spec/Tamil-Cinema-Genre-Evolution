import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clapperboard, Star, Search, Filter, ArrowLeft, Calendar, User, TrendingUp, ChevronLeft, ChevronRight, Edit3, Check, X, Repeat } from "lucide-react";
import Header from "@/components/Header";
import { tamilCinemaMovies } from "@/data/movies";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMovieEdits } from "@/hooks/use-movie-edits";
import { useToast } from "@/components/ui/use-toast";

const Movies = () => {
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("year-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);
  const itemsPerPage = 12;

  // Scroll to top when page changes (instant jump for snappier pagination)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // instant jump instead of smooth to avoid perceived lag
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [currentPage]);

  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(tamilCinemaMovies.map((m) => m.genre))];
    return uniqueGenres.sort();
  }, []);

  const { edits } = useMovieEdits();

  const filteredMovies = useMemo(() => {
    let filtered = tamilCinemaMovies.filter((movie) => {
      const appliedDirector = edits[movie.id]?.director ?? movie.director ?? "";
      const appliedActor = edits[movie.id]?.actor ?? movie.actor ?? "";
      const matchesSearch = 
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        appliedDirector.toLowerCase().includes(search.toLowerCase()) ||
        appliedActor.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genreFilter === "all" || movie.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });

    // Sort
    switch (sortBy) {
      case "year-desc":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "year-asc":
        filtered.sort((a, b) => a.year - b.year);
        break;
      case "rating-desc":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-asc":
        filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "revenue-desc":
        filtered.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [search, genreFilter, sortBy, edits]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    setCurrentPage(1);
    callback();
  };

  // Component: editable director & cast UI for each movie.
  function EditableDirectorCast({ movie }: { movie: any }) {
    const { edits, setMovieEdit, clearMovieEdit } = useMovieEdits();
    const { toast } = useToast();

    const saved = edits[movie.id] || {};
    const appliedDirector = saved.director ?? movie.director ?? "";
    const appliedActor = saved.actor ?? movie.actor ?? "";

    const [editing, setEditing] = useState(false);
    const [directorValue, setDirectorValue] = useState(appliedDirector);
    const [actorValue, setActorValue] = useState(appliedActor);

    // keep inputs in sync when external edits change
    useEffect(() => {
      if (!editing) {
        setDirectorValue(appliedDirector);
        setActorValue(appliedActor);
      }
    }, [appliedDirector, appliedActor, editing]);

    const onSave = () => {
      setMovieEdit(movie.id, { director: directorValue.trim(), actor: actorValue.trim() });
      setEditing(false);
      toast({ title: "Saved", description: "Changes saved locally" });
    };

    const onCancel = () => {
      setDirectorValue(appliedDirector);
      setActorValue(appliedActor);
      setEditing(false);
    };

    const onReset = () => {
      clearMovieEdit(movie.id);
      setDirectorValue(movie.director ?? "");
      setActorValue(movie.actor ?? "");
      setEditing(false);
      toast({ title: "Reset", description: "Local edits cleared" });
    };

    return (
      <div>
        {!editing ? (
          <div className="space-y-1">
            {appliedDirector && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 inline mr-1" />
                  <span className="line-clamp-1">Dir: {appliedDirector}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditing(true); }} className="gap-1">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onReset(); }} className="gap-1 text-xs">
                    <Repeat className="w-4 h-4" /> Reset
                  </Button>
                </div>
              </div>
            )}

            {appliedActor && (
              <div className="text-xs text-muted-foreground line-clamp-1">Cast: {appliedActor}</div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              <label className="text-[11px] font-medium">Director</label>
              <Input value={directorValue} onChange={(e) => setDirectorValue(e.target.value)} placeholder="Director name" className="mt-1" />
            </div>

            <div className="text-xs text-muted-foreground">
              <label className="text-[11px] font-medium">Cast (comma-separated)</label>
              <Textarea value={actorValue} onChange={(e) => setActorValue(e.target.value)} className="mt-1" />
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={(e) => { e.stopPropagation(); onSave(); }} className="gap-1">
                <Check className="w-4 h-4" /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); onCancel(); }} className="gap-1">
                <X className="w-4 h-4" /> Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const getGenreColor = (genre: string) => {
    const colors: Record<string, string> = {
      Action: "bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-400",
      Comedy: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-400",
      Drama: "bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-400",
      Romance: "bg-pink-500/20 text-pink-700 border-pink-500/30 dark:text-pink-400",
      Thriller: "bg-purple-500/20 text-purple-700 border-purple-500/30 dark:text-purple-400",
      Horror: "bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-400",
      Crime: "bg-slate-500/20 text-slate-700 border-slate-500/30 dark:text-slate-400",
      "Sci-Fi": "bg-cyan-500/20 text-cyan-700 border-cyan-500/30 dark:text-cyan-400",
      Sports: "bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-400",
      Family: "bg-indigo-500/20 text-indigo-700 border-indigo-500/30 dark:text-indigo-400",
    };
    return colors[genre] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Clapperboard className="w-4 h-4" />
              <span className="text-sm font-medium">Complete Movie Database</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore {tamilCinemaMovies.length}+ Tamil Films
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search, filter, and analyze the complete Tamil cinema database with movie details, ratings, and revenue information
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Movies", value: tamilCinemaMovies.length },
              { label: "Avg Rating", value: (tamilCinemaMovies.reduce((sum, m) => sum + m.rating, 0) / tamilCinemaMovies.length).toFixed(1) + "★" },
              { label: "Genres", value: genres.length },
              { label: "Years", value: "2004-2024" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-card/50 border border-border/50 rounded-lg text-center"
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section
        role="region"
        aria-label="Search and filters"
        className="sticky top-16 z-50 bg-background/95 backdrop-blur-sm py-4 md:py-6 border-b border-border/50 shadow-sm transition-shadow duration-200 md:h-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-4 h-full">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by movie title, director, or actor..."
                value={search}
                onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
                className="pl-10"
              />
            </div>
            
            {/* Filters and Sort */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Select value={genreFilter} onValueChange={(value) => handleFilterChange(() => setGenreFilter(value))}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres ({tamilCinemaMovies.length} movies)</SelectItem>
                    {genres.map((genre) => {
                      const count = tamilCinemaMovies.filter(m => m.genre === genre).length;
                      return (
                        <SelectItem key={genre} value={genre}>
                          {genre} ({count})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select value={sortBy} onValueChange={(value) => handleFilterChange(() => setSortBy(value))}>
                  <SelectTrigger>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="year-desc">Newest First</SelectItem>
                    <SelectItem value="year-asc">Oldest First</SelectItem>
                    <SelectItem value="rating-desc">Highest Rated</SelectItem>
                    <SelectItem value="rating-asc">Lowest Rated</SelectItem>
                    <SelectItem value="revenue-desc">Highest Revenue</SelectItem>
                    <SelectItem value="title-asc">A-Z Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between md:justify-end md:space-x-4 md:w-64">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{Math.min(endIndex, filteredMovies.length)}</span> of <span className="font-semibold text-foreground">{filteredMovies.length}</span> movies (Page {currentPage} of {totalPages || 1})
              </p>
              {genreFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGenreFilter("all");
                    setSearch("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer max-w-[220px] rounded-lg border border-muted/20">
                  <div className="flex justify-center pt-4">
                    <Skeleton className="w-[140px] sm:w-[160px] md:w-[180px] aspect-[2/3]" />
                  </div>

                  <CardContent className="p-4 space-y-3 w-full">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center py-24">
              <Clapperboard className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No movies found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setGenreFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
              {paginatedMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.2), duration: 0.3 }}
                >
                  <Link to={`/movies/${movie.id}`} className="no-underline block">
                    <Card className={`overflow-hidden group transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 h-full flex flex-col cursor-pointer ${movie.title?.toLowerCase().includes('kaak') ? 'max-w-[420px]' : 'max-w-[320px]'} rounded-xl border border-muted/20`}>
                    {/* Movie Poster */}
                    <div className="w-full">
                      <div className="relative w-full aspect-[2/3] bg-gradient-to-br from-primary/20 via-accent/10 to-muted overflow-hidden flex items-stretch justify-center rounded-t-xl">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover object-center block transform-gpu group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // fallback to local placeholder to avoid empty poster area
                            const img = e.currentTarget as HTMLImageElement;
                            if (!img.dataset.fallback) {
                              img.dataset.fallback = '1';
                              img.src = '/placeholder.svg';
                            } else {
                              img.style.display = 'none';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                        {/* Badges on poster */}
                        <div className="absolute inset-0 flex flex-col justify-between p-4">
                          <div className="flex justify-between items-start">
                            <Badge className={getGenreColor(movie.genre)}>
                              {movie.genre}
                            </Badge>
                            {movie.rating && (
                              <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground rounded-full px-2 py-1 backdrop-blur-sm">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold">{movie.rating}</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h3 className="font-display text-lg font-bold text-white line-clamp-2 drop-shadow-md">
                              {movie.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Movie Details (editable director & cast) */}
                    <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3 border-t border-muted/10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="font-medium">{movie.year}</span>
                          </div>
                          {movie.revenue && (
                            <div className="text-xs bg-primary/10 px-2 py-1 rounded">
                              ₹{(movie.revenue / 10000000).toFixed(1)}Cr
                            </div>
                          )}
                        </div>

                        {/* Editable fields: Director & Cast */}
                        <EditableDirectorCast movie={movie} />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-muted/10 w-full">
                        <span className="text-xs font-semibold text-amber-400">{movie.genre}</span>
                        <span className="text-xs text-muted-foreground">{movie.year}</span>
                      </div>
                    </CardContent>
                  </Card>                  </Link>                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination Controls */}
      {filteredMovies.length > 0 && totalPages > 1 && (
        <section className="py-8 border-t border-border bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Page Info */}
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                  Page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredMovies.length)} of {filteredMovies.length} movies
                </p>
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    // Show first page, last page, current page and adjacent pages
                    const isVisible = 
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      Math.abs(pageNum - currentPage) <= 1;
                    
                    if (!isVisible && index > 0 && index < totalPages - 1 && pageNum !== 2 && pageNum !== totalPages - 1) {
                      return null;
                    }

                    if (index > 0 && pageNum !== 2 && paginatedMovies[0] && 
                        Array.from({ length: totalPages })[index - 1] && 
                        (index - 1) + 1 !== pageNum - 1) {
                      return (
                        <span key={`dots-${index}`} className="text-muted-foreground">
                          ...
                        </span>
                      );
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="min-w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Info Section */}
      {filteredMovies.length > 0 && totalPages === 1 && (
        <section className="py-8 border-t border-border bg-card/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              Showing all {filteredMovies.length} results
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Tamil Cinema Genre Evolution © 2024 | {tamilCinemaMovies.length}+ Movies in Database
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Movies;
