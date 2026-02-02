import { useMemo } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { tamilCinemaMovies } from "@/data/movies";

interface Props {
  yearRange: [number, number];
}

const RevenueTrend = ({ yearRange }: Props) => {
  const data = useMemo(() => {
    const out: Array<{ year: number; revenue: number }> = [];
    for (let y = yearRange[0]; y <= yearRange[1]; y++) {
      const sum = tamilCinemaMovies
        .filter((m) => m.year === y)
        .reduce((s, m) => s + (m.revenue || 0), 0);
      out.push({ year: y, revenue: Math.round(sum / 10000000) }); // in crores
    }
    return out;
  }, [yearRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg p-6 shadow-card h-[400px]"
    >
      <h3 className="font-display text-xl text-foreground mb-4">Revenue Trend (per year)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
          <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" unit="Cr" />
          <Tooltip formatter={(value: any) => `${value} Cr`} />
          <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default RevenueTrend;
