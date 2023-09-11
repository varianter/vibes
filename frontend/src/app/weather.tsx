"use client";

import { useState, useEffect } from "react";

export function WeatherForecast() {
  const [data, setData] = useState<{ temperatureC: number }>({
    temperatureC: 0,
  });
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/WeatherForecast")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      <h1>{data.temperatureC}</h1>
    </div>
  );
}
