import { motion } from "framer-motion";
import { Clapperboard, TrendingUp, BarChart3 } from "lucide-react";

type HeroSectionProps = {
  backgroundSrc?: string;
};

const HeroSection = ({ backgroundSrc }: HeroSectionProps) => {
  const inlineStyle = {
    /* Use site gradient instead of background image */
    background: 'var(--gradient-hero)',
    minHeight: '100vh',
    width: '100vw',
    position: 'relative' as const
  }; 

  return (
    <section 
      className="relative overflow-hidden flex items-center justify-center"
      style={inlineStyle}
    >
      {/* Premium dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/40" />
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl scale-[1.05]" />
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto p-6 md:p-8 lg:p-10"
        >
          <div className="flex justify-center gap-2 mb-6">
            <span className="px-4 py-1.5 bg-primary/20 border border-primary/40 rounded-full text-sm text-primary font-medium shadow-lg">
              20 Years of Kollywood Evolution
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight tracking-tight" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 3px 10px rgba(217,119,6,0.35)' }}>
            Tamil Cinema
            <br />
            <span className="text-gradient-gold text-3xl md:text-5xl lg:text-6xl block mt-1" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>Genre Evolution</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            Explore the complete Tamil cinema database with 300+ movies. Discover how Tamil film genres 
            and audience preferences have transformed from 2004 to 2024 through interactive analytics.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Clapperboard, label: "300+ Films", desc: "Cataloged" },
              { icon: TrendingUp, label: "10 Genres", desc: "Tracked" },
              { icon: BarChart3, label: "20 Years", desc: "Of Data" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 px-6 py-4 bg-white/6 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all shadow-md cursor-pointer"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-primary/20 text-primary">
                  <item.icon className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <p className="font-semibold text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
