import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { tamilCinemaMovies } from "@/data/movies";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Star } from "lucide-react";

const MovieDetail = () => {
  const { id } = useParams();
  const movie = tamilCinemaMovies.find((m) => m.id === id);
  const [enriched, setEnriched] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    if (!movie) return;
    // Try fetch from public path (safer — Vite won't pre-resolve missing files)
    fetch('/movies.enriched.json')
      .then((r) => {
        if (!r.ok) throw new Error('no file');
        return r.json();
      })
      .then((data) => {
        if (mounted) setEnriched(data[movie.id] ?? null);
      })
      .catch(() => {
        // ignore if file not found or fetch failed
      });
    return () => { mounted = false; };
  }, [movie]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-semibold mb-4">Movie not found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the movie you're looking for.</p>
          <Link to="/movies">
            <Button variant="ghost">Back to Movies</Button>
          </Link>
        </main>
      </div>
    );
  }

  // merged fields (movie props take priority)
  const synopsis = movie.synopsis || enriched?.synopsis;
  const runtimeMinutes = movie.runtimeMinutes || enriched?.runtimeMinutes;
  const languages = movie.languages || enriched?.languages;
  const castList = (movie.castList && movie.castList.length) ? movie.castList : (enriched?.castList ?? (movie.actor ? movie.actor.split(',').map(s => s.trim()) : []));
  const imdbId = movie.imdbId || enriched?.imdbId;
  const imdbRating = movie.imdbRating || enriched?.imdbRating;
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <Card className="rounded-xl overflow-hidden">
              <div className="relative w-full aspect-[2/3] bg-gradient-to-br from-primary/20 via-accent/10 to-muted overflow-hidden flex items-stretch justify-center">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover object-center block"
                />
              </div>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/10 text-primary border-primary/20">{movie.genre}</Badge>
                  <div className="flex items-center gap-2">
                    {movie.rating && (
                      <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground rounded-full px-2 py-1">
                        <Star className="w-4 h-4" />
                        <span className="text-sm font-semibold">{movie.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.year}</span>
                  </div>

                  {movie.director && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Director:</span> <span>{movie.director}</span>
                    </div>
                  )}

                  {movie.actor && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Cast:</span> <span>{movie.actor}</span>
                    </div>
                  )}

                  {movie.revenue && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Box Office:</span> <span>₹{movie.revenue.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Link to="/movies">
                    <Button variant="ghost">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back to Movies
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-muted-foreground mb-2">{movie.genre} · {movie.year} · Directed by {movie.director}</p>

            <div className="flex items-center gap-4 mb-4 text-sm">
              {runtimeMinutes && <div className="text-muted-foreground">{runtimeMinutes} min</div>}
              <div className="text-muted-foreground">{(languages && languages.join(', ')) || 'Tamil'}</div>
              <div className="text-muted-foreground">⭐ {movie.rating}{imdbRating ? ` · ${imdbRating}` : ''}</div>
              {movie.revenue && <div className="text-muted-foreground">₹{movie.revenue.toLocaleString()}</div>}
            </div>

            {synopsis ? (
              <p className="mb-6">{synopsis}</p>
            ) : (
              <p className="mb-6 text-muted-foreground">Synopsis not available for this movie.</p>
            )}

            {/* Cast */}
            {((movie.castList && movie.castList.length) || movie.actor) && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Cast</h4>
                <div className="flex flex-wrap gap-2">
                        {castList.map((c, i) => (
                    <div key={i} className="text-sm px-3 py-1 bg-muted/10 rounded">{c.trim()}</div>
                  ))}
                </div>
              </div>
            )}


          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetail;
