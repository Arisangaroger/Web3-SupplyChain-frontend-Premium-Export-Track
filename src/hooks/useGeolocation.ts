"use client";

import { useCallback, useState } from "react";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const capture = useCallback(async (): Promise<GeoPoint> => {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported on this device");
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const point = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setPosition(point);
          setLoading(false);
          resolve(point);
        },
        (err) => {
          const message = err.message || "Unable to capture GPS location";
          setError(message);
          setLoading(false);
          reject(new Error(message));
        },
        { enableHighAccuracy: true, timeout: 15_000 },
      );
    });
  }, []);

  const toCoordinateString = (point: GeoPoint) =>
    `${point.latitude},${point.longitude}`;

  return { position, error, loading, capture, toCoordinateString };
}
