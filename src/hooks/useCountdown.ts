'use client';

import { useState, useEffect, useCallback } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

interface UseCountdownOptions {
  onExpire?: () => void;
  interval?: number;
}

export function useCountdown(
  targetDate: string | Date,
  options: UseCountdownOptions = {}
): CountdownTime {
  const { onExpire, interval = 1000 } = options;

  const calculateTimeLeft = useCallback((): CountdownTime => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        totalSeconds: 0,
      };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      totalSeconds,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.isExpired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, interval, onExpire]);

  return timeLeft;
}

export function formatCountdownUnit(value: number, padLength: number = 2): string {
  return String(value).padStart(padLength, '0');
}
