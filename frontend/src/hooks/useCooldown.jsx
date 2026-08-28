import { useEffect, useState } from "react";

const useCooldown = (seconds = 30) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!remaining) return undefined;

    const timer = window.setInterval(() => {
      setRemaining((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remaining]);

  return {
    remaining,
    isCoolingDown: remaining > 0,
    start: () => setRemaining(seconds),
  };
};

export default useCooldown;
