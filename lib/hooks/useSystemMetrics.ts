"use client";

import { useAtom } from 'jotai';
import { systemMetricsAtom } from '../store/atoms';
import { formatDistanceToNow } from 'date-fns';

export function useSystemMetrics() {
  const [metrics] = useAtom(systemMetricsAtom);

  const formatUptime = () => {
    const date = new Date();
    date.setSeconds(date.getSeconds() - metrics.uptime);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getBatteryStatus = () => {
    if (metrics.battery > 75) return 'optimal';
    if (metrics.battery > 50) return 'good';
    if (metrics.battery > 25) return 'low';
    return 'critical';
  };

  const getTemperatureStatus = () => {
    if (metrics.temperature < 50) return 'normal';
    if (metrics.temperature < 70) return 'elevated';
    if (metrics.temperature < 85) return 'high';
    return 'critical';
  };

  return {
    ...metrics,
    formattedUptime: formatUptime(),
    batteryStatus: getBatteryStatus(),
    temperatureStatus: getTemperatureStatus(),
  };
}