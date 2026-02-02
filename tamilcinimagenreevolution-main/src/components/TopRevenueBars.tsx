import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { tamilCinemaMovies } from "@/data/movies";

const TopRevenueBars = () => {
  const data = useMemo(() => {
    const top = [...tamilCinemaMovies]
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 6)
      .map((m) => ({ title: m.title, revenue: Math.round((m.revenue || 0) / 10000000) })); // in crores
    return top.reverse(); // reverse for horizontal bar order
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg p-6 shadow-card h-[220px]"
    >
      <h4 className="font-display text-lg text-foreground mb-2">Top Revenue Films</h4>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
          <YAxis type="category" dataKey="title" stroke="hsl(var(--muted-foreground))" width={120} />
          <Tooltip formatter={(v: any) => `${v} Cr`} />
          <Bar dataKey="revenue" fill="hsl(var(--accent))" barSize={12} radius={[4, 4, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default TopRevenueBars;
