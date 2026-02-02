import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { genreColors } from "@/data/moviesData";
import { tamilCinemaMovies } from "@/data/movies";

interface GenreChartProps {
  yearRange: [number, number];
}

const GenreChart = ({ yearRange }: GenreChartProps) => {
  const genres = Object.keys(genreColors) as Array<keyof typeof genreColors>;

  const filteredData = useMemo(() => {
    const output: Array<Record<string, any>> = [];
    for (let y = yearRange[0]; y <= yearRange[1]; y++) {
      const moviesForYear = tamilCinemaMovies.filter((m) => m.year === y);
      const total = moviesForYear.length;

      const counts = genres.reduce((acc, g) => {
        const count = moviesForYear.filter((m) => m.genre === g).length;
        acc[g] = total > 0 ? (count / total) * 100 : 0;
        return acc;
      }, {} as Record<string, number>);

      output.push({ year: y, ...counts });
    }
    return output;
  }, [yearRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[400px] bg-card rounded-lg p-6 shadow-card"
    >
      <h3 className="font-display text-xl text-foreground mb-4">
        Genre Distribution Over Time
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={filteredData}>
          <defs>
            {genres.map((genre) => (
              <linearGradient
                key={genre}
                id={`gradient-${genre}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={genreColors[genre]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor={genreColors[genre]}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <XAxis
            dataKey="year"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => (
              <span className="text-muted-foreground text-sm">{value}</span>
            )}
          />
          {genres.map((genre) => (
            <Area
              key={genre}
              type="monotone"
              dataKey={genre}
              stackId="1"
              stroke={genreColors[genre]}
              fill={`url(#gradient-${genre})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default GenreChart;
