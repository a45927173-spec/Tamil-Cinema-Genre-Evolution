import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { tamilCinemaMovies } from "@/data/movies";

interface Props {
  yearRange: [number, number];
}

const RatingsDistribution = ({ yearRange }: Props) => {
  const data = useMemo(() => {
    // buckets 0-10 step 1
    const buckets = Array.from({ length: 11 }, (_, i) => ({ bucket: `${i}`, count: 0 }));
    const filtered = tamilCinemaMovies.filter((m) => m.year >= yearRange[0] && m.year <= yearRange[1]);
    filtered.forEach((m) => {
      const r = Math.round(m.rating || 0);
      const idx = Math.max(0, Math.min(10, r));
      buckets[idx].count += 1;
    });
    return buckets.map((b) => ({ ...b }));
  }, [yearRange]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg p-6 shadow-card h-[220px]"
    >
      <h4 className="font-display text-lg text-foreground mb-2">Ratings Distribution</h4>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
          <YAxis type="category" dataKey="bucket" stroke="hsl(var(--muted-foreground))" />
          <Tooltip />
          <Bar dataKey="count" fill="hsl(var(--primary))" barSize={12} radius={[4, 4, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default RatingsDistribution;
