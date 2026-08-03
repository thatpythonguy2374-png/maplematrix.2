import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 17,
    minutes: 35,
    seconds: 25
  });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let {
          hours,
          minutes,
          seconds
        } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset to 24 hours when timer reaches 0
          return {
            hours: 23,
            minutes: 59,
            seconds: 59
          };
        }
        return {
          hours,
          minutes,
          seconds
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };
  return (
    <div 
      className="py-2.5 px-4 md:px-6" 
      style={{ background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%, rgba(255,255,255,0) 100%)' }}
    >
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        <Clock className="w-3.5 h-3.5 text-primary/80 flex-shrink-0" aria-hidden="true" />
        <span className="text-xs sm:text-sm text-foreground tracking-wide">
          Limited time offer ends in
        </span>
        <div 
          className="flex items-center gap-0.5 font-mono text-foreground/90"
          role="timer"
          aria-live="polite"
          aria-label={`${formatNumber(timeLeft.hours)} hours, ${formatNumber(timeLeft.minutes)} minutes, ${formatNumber(timeLeft.seconds)} seconds remaining`}
        >
          <span className="bg-foreground/[0.08] backdrop-blur-sm px-1.5 py-0.5 rounded text-[11px] sm:text-xs min-w-[1.75rem] text-center font-medium tabular-nums">
            {formatNumber(timeLeft.hours)}
          </span>
          <span className="text-foreground/40 text-[10px] sm:text-xs" aria-hidden="true">:</span>
          <span className="bg-foreground/[0.08] backdrop-blur-sm px-1.5 py-0.5 rounded text-[11px] sm:text-xs min-w-[1.75rem] text-center font-medium tabular-nums">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className="text-foreground/40 text-[10px] sm:text-xs" aria-hidden="true">:</span>
          <span className="bg-foreground/[0.08] backdrop-blur-sm px-1.5 py-0.5 rounded text-[11px] sm:text-xs min-w-[1.75rem] text-center font-medium tabular-nums">
            {formatNumber(timeLeft.seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};
export default CountdownTimer;