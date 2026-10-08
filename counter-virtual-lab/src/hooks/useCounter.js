import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const COUNTER_LIMITS = {
  "7490": 10,
  "7493": 16,
  "74161": 16,
};

function useCounter(
  counterIC = "7490",
  clockSource = "manual"
) {
  const [count, setCount] = useState(0);

  const [pulseCount, setPulseCount] =
    useState(0);

  const intervalRef = useRef(null);

  const limit =
    COUNTER_LIMITS[counterIC] ||
    COUNTER_LIMITS["7490"];


  const generatePulse = useCallback(() => {

    setCount((previous) => {

      const next = previous + 1;

      if (next >= limit) {
        return 0;
      }

      return next;
    });

    setPulseCount((previous) => {
      return previous + 1;
    });

  }, [limit]);


  const resetCounter = useCallback(() => {

    setCount(0);
    setPulseCount(0);

  }, []);


  useEffect(() => {

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (clockSource === "automatic") {

      intervalRef.current = setInterval(() => {
        generatePulse();
      }, 1000);

    }

    return () => {

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

    };

  }, [
    clockSource,
    generatePulse,
  ]);


  const bits = [
    (count >> 0) & 1,
    (count >> 1) & 1,
    (count >> 2) & 1,
    (count >> 3) & 1,
  ];


  return {
    count,
    pulseCount,
    bits,
    isRunning:
      clockSource === "automatic",
    generatePulse,
    resetCounter,
  };
}

export default useCounter;