import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface YearRangeSliderProps {
  min: number;
  max: number;
  values: [number, number];
  onChange: (values: [number, number]) => void;
}

const YearRangeSlider = ({ min, max, values, onChange }: YearRangeSliderProps) => {
  const [isDragging, setIsDragging] = useState<"start" | "end" | null>(null);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const percentage = (e.clientX - rect.left) / rect.width;
      const newValue = Math.round(min + percentage * (max - min));
      
      const distToStart = Math.abs(newValue - values[0]);
      const distToEnd = Math.abs(newValue - values[1]);
      
      if (distToStart < distToEnd) {
        onChange([Math.min(newValue, values[1] - 1), values[1]]);
      } else {
        onChange([values[0], Math.max(newValue, values[0] + 1)]);
      }
    },
    [min, max, values, onChange]
  );

  const handleThumbDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent, type: "start" | "end") => {
      e.preventDefault();
      setIsDragging(type);

      const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
        const clientX = 
          "touches" in moveEvent 
            ? moveEvent.touches[0].clientX 
            : moveEvent.clientX;
        
        const track = document.getElementById("year-slider-track");
        if (!track) return;
        
        const rect = track.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newValue = Math.round(min + percentage * (max - min));
        
        if (type === "start") {
          onChange([Math.min(newValue, values[1] - 1), values[1]]);
        } else {
          onChange([values[0], Math.max(newValue, values[0] + 1)]);
        }
      };

      const upHandler = () => {
        setIsDragging(null);
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
        document.removeEventListener("touchmove", moveHandler);
        document.removeEventListener("touchend", upHandler);
      };

      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
      document.addEventListener("touchmove", moveHandler);
      document.addEventListener("touchend", upHandler);
    },
    [min, max, values, onChange]
  );

  const range = max - min;
  const tickCount = Math.min(8, Math.max(2, Math.floor(range / 5)));
  const tickStep = Math.max(1, Math.round(range / tickCount));

  const majorTicksSet = new Set<number>();
  majorTicksSet.add(min);
  majorTicksSet.add(max);
  for (let y = min; y <= max; y += tickStep) {
    majorTicksSet.add(y);
  }
  const majorTicks = Array.from(majorTicksSet).sort((a, b) => a - b);

  return (
    <div className="w-full px-4 py-6">
      <div className="relative">
        {/* Track */}
        <div
          id="year-slider-track"
          className="h-2 bg-muted rounded-full cursor-pointer relative"
          onClick={handleTrackClick}
        >
          {/* Active range */}
          <motion.div
            className="absolute h-full bg-primary rounded-full"
            style={{
              left: `${getPercentage(values[0])}%`,
              width: `${getPercentage(values[1]) - getPercentage(values[0])}%`,
            }}
            layoutId="active-range"
          />
        </div>

        {/* Thumbs */}
        {["start", "end"].map((type, index) => (
          <motion.div
            key={type}
            className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full cursor-grab shadow-lg border-2 border-background ${
              isDragging === type ? "cursor-grabbing scale-110" : ""
            }`}
            style={{
              left: `calc(${getPercentage(values[index])}% - 12px)`,
              top: "4px",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.15 }}
            onMouseDown={(e) => handleThumbDrag(e, type as "start" | "end")}
            onTouchStart={(e) => handleThumbDrag(e, type as "start" | "end")}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded text-sm font-medium text-foreground shadow-md">
              {values[index]}
            </div>
          </motion.div>
        ))}

        {/* Year ticks */}
        <div className="mt-6 flex justify-between">
          {majorTicks.map((year) => (
            <div
              key={year}
              className="text-xs text-muted-foreground"
              style={{
                position: "absolute",
                left: `${getPercentage(year)}%`,
                transform: "translateX(-50%)",
              }}
            >
              {year}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearRangeSlider;
