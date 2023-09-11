"use client";

import { useState, useEffect } from 'react'
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { fetchWithToken } from "@/utils/ApiUtils";

export function WeatherForecast() {
    const [data, setData] = useState<{temperatureC: number}>({temperatureC: 0})
    const [isLoading, setLoading] = useState(true)
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
      if(isAuthenticated){
        fetchWithToken('/api/WeatherForecast')
            .then((data) => {
                setData(data)
                setLoading(false)
            })
      }
    }, [isAuthenticated])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>

    return (
        <div>
            <h1>{data.temperatureC}</h1>
        </div>
    )
}