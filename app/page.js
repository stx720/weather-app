"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const [city, setCity] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const handleFetchWeather = () => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ec35b4d54a274f524fa567c861ac8792`;

    axios
      .get(api)
      .then((response) => {
        const { main, name } = response.data;
        const { temp } = main;
        setTemperature(temp);
        setCityName(name);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };

  return (
    <main className="h-screen flex items-center justify-center">
      <div className="h-72 w-4/12 rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
        <div className=" h-full w-full bg-gray-800 flex items-center justify-center ">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={handleCityChange}
            className="flex w-4/12 h-8 bg-gray-500 text-white pl-1"
          />
          <button onClick={handleFetchWeather}>
            {" "}
            <Image
              src="/search.svg"
              width={32}
              height={32}
              alt="Picture of the author"
              className="bg-white"
            />
          </button>
          <div className="flex-col">
            <h1 className="text-white">{cityName}</h1>
            {temperature !== null ? (
              <h1 className="text-white">Temperature: {temperature}°C</h1>
            ) : (
              <p className="text-white"></p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
