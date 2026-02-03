import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { tamilCinemaMovies } from "@/data/movies";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Star, Edit3, Check, X, Repeat } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMovieEdits } from "@/hooks/use-movie-edits";
import { useToast } from "@/components/ui/use-toast";

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

  // Editable director & cast helper component
  function EditableDirectorCast({ movie, enriched }: { movie: any; enriched: any | null }) {
    const { edits, setMovieEdit, clearMovieEdit } = useMovieEdits();
    const { toast } = useToast();

    const saved = edits[movie.id] || {};

    const baseCastRaw = (movie.castList && movie.castList.length) ? movie.castList : (enriched?.castList ?? (movie.actor ? movie.actor.split(',').map((s: string) => s.trim()) : []));

    const appliedDirector = saved.director ?? movie.director ?? "";
    const appliedActorSource = saved.actor ?? (Array.isArray(baseCastRaw) ? baseCastRaw.join(", ") : baseCastRaw || "");

    const castList = (appliedActorSource || "").split(',').map((c) => c.trim()).filter((c) => c && c.toLowerCase() !== 'unknown' && c.toLowerCase() !== 'n/a');

    const [editing, setEditing] = useState(false);
    const [directorValue, setDirectorValue] = useState(appliedDirector);
    const [actorValue, setActorValue] = useState(appliedActorSource);

    // sync when not editing
    useEffect(() => {
      if (!editing) {
        setDirectorValue(appliedDirector);
        setActorValue(appliedActorSource);
      }
    }, [appliedDirector, appliedActorSource, editing]);

    const onSave = () => {
      setMovieEdit(movie.id, { director: directorValue.trim(), actor: actorValue.trim() });
      setEditing(false);
      toast({ title: "Saved", description: "Changes saved locally" });
    };

    const onCancel = () => {
      setDirectorValue(appliedDirector);
      setActorValue(appliedActorSource);
      setEditing(false);
    };

    const onReset = () => {
      clearMovieEdit(movie.id);
      setEditing(false);
      toast({ title: "Reset", description: "Local edits cleared" });
    };

    return (
      <>
        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium">Director</label>
              <Input value={directorValue} onChange={(e) => setDirectorValue(e.target.value)} className="mt-1" />
            </div>

            <div>
              <label className="text-xs font-medium">Cast (comma-separated)</label>
              <Textarea value={actorValue} onChange={(e) => setActorValue(e.target.value)} className="mt-1" />
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={onSave} className="gap-1"><Check className="w-4 h-4" /> Save</Button>
              <Button size="sm" variant="ghost" onClick={onCancel} className="gap-1"><X className="w-4 h-4" /> Cancel</Button>
              <Button size="sm" variant="ghost" onClick={onReset} className="gap-1"><Repeat className="w-4 h-4" /> Reset</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">Director:</span>
              <span>{appliedDirector}</span>
              <div className="ml-auto">
                <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1"><Edit3 className="w-4 h-4" /> Edit</Button>
              </div>
            </div>

            {castList.length > 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                <span className="font-medium">Cast:</span> <span>{castList.join(', ')}</span>
              </div>
            )}
          </>
        )}
      </>
    );
  }

  // Build cast list (apply local edits if present)
  const appliedActorSource = edits[movie.id]?.actor ?? (movie.castList && movie.castList.length ? movie.castList.join(', ') : (enriched?.castList ? enriched.castList.join(', ') : (movie.actor ?? "")));
  const castList = (appliedActorSource || "").split(',').map((c) => c.trim()).filter((c) => c && c.toLowerCase() !== 'unknown' && c.toLowerCase() !== 'n/a');
  const imdbId = movie.imdbId || enriched?.imdbId;
  const imdbRating = movie.imdbRating || enriched?.imdbRating;

  const { edits } = useMovieEdits();
  const appliedDirectorHeader = edits[movie.id]?.director ?? movie.director;

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

                  {/* Editable director & cast */}
                  <EditableDirectorCast movie={movie} enriched={enriched} />

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
            <p className="text-muted-foreground mb-2">{movie.genre} · {movie.year} · Directed by {appliedDirectorHeader}</p>

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
            {castList.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Cast</h4>
                <div className="flex flex-wrap gap-2">
                        {castList.map((c, i) => (
                    <div key={i} className="text-sm px-3 py-1 bg-muted/10 rounded">{c}</div>
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
