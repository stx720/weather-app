"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

export default function Home() {
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const handleFetchWeather = () => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ec35b4d54a274f524fa567c861ac8792`;

    axios
      .get(api)
      .then((response) => {
        const { main, name, weather } = response.data;
        const { temp } = main;
        setTemperature(temp);
        setCityName(name);
        setCurrentWeather(weather[0].main);
        console.log(weather);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
      });
  };

  const getWeatherImage = (description) => {
    switch (description) {
      case "Snow":
        return "/snow.png";
      case "Clear":
        return "/clear.png";
      case "Rain":
        return "/rain.png";
      case "Clouds":
        return "/clouds.png";
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleFetchWeather(); // Wywołaj funkcję pobierania pogody po naciśnięciu Enter
    }
  };

  return (
    <main className="h-screen flex items-center justify-center flex-col">
      <h1 className="flex font-extrabold text-white  2xl:text-8xl md:text-8xl sm:text-5xl  ">
        Weather
      </h1>
      <div className="h-72 2xl:w-4/12 md:w-7/12 sm:w-9/12  rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
        <div className=" h-full w-full bg-gray-800 flex items-center rounded-lg justify-center ">
          <div className="flex-col mr-10">
            {currentWeather && (
              <Image
                src={getWeatherImage(currentWeather)}
                width={96}
                height={96}
                alt="Weather Icon"
                className="mx-auto mb-2"
              />
            )}
            <h1 className="text-white text-4xl whitespace-nowrap">
              {cityName}
            </h1>
            {temperature !== null ? (
              <h1 className="text-white text-2xl mt-2">
                {temperature.toFixed(1)}°C
              </h1>
            ) : (
              <p className="text-white"></p>
            )}
          </div>

          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onKeyPress={handleKeyPress}
            onChange={handleCityChange}
            className="flex w-4/12 h-8 bg-gray-600 text-white pl-1 rounded-l-lg outline-none transition focus:outline-purple focus:border-purple-500 focus:bg-gray-200 focus:text-black  "
          />
          <button onClick={handleFetchWeather} className="mr-2">
            {" "}
            <Image
              src="/search.svg"
              width={32}
              height={32}
              alt="Picture of the author"
              className="bg-violet-400 hover:bg-violet-500 rounded-r-lg    "
            />
          </button>
        </div>
      </div>

      <div class="absolute bottom-0 right-0 mr-2 font-bold text-sm pointer-events-none">
        Copyright © 2023 Michał Obrębski. All Rights Reserved
      </div>
    </main>
  );
}
