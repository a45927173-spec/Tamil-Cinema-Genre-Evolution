import { Link } from "react-router-dom";
import { Clapperboard } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Clapperboard className="w-6 h-6 text-primary" />
            <span className="font-display text-xl hidden sm:inline text-primary font-bold">Tamil Cinema Genre Evolution</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Movies
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
