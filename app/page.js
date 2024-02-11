"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import { DateTime } from "luxon";
import { IANAZone } from "luxon";
import React from "react";

import dynamic from "next/dynamic";

export default function Home() {
  const [currentTime, setCurrentTime] = useState(null);
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isNight, setIsNight] = useState(false);
  const [timezone, setTimezone] = useState("");
  const [country, setCountry] = useState("");
  const [sunriseTime, setSunriseTime] = useState(null);
  const [sunsetTime, setSunsetTime] = useState(null);
  const handleCityChange = (event) => {
    setCity(event.target.value);
    toast.dismiss();
  };

  const handleFetchWeather = () => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=ec35b4d54a274f524fa567c861ac8792`;

    axios
      .get(api)
      .then((response) => {
        const { main, name, weather, timezone, sys } = response.data;
        const { temp } = main;
        setTemperature(temp);
        setCityName(name);
        setCurrentWeather(weather[0].main);
        const offsetHours = -timezone / 3600;
        const sign = offsetHours >= 0 ? "+" : "-";
        const zoneIdentifier = `Etc/GMT${sign}${Math.abs(offsetHours)}`;
        const zone = IANAZone.create(zoneIdentifier);
        const currentDateTime = DateTime.now().setZone(zone);
        setCurrentTime(currentDateTime);
        console.log(zone);
        setTimezone(zone.name);
        setCountry(sys.country);

        const { sunrise, sunset } = sys;
        const sunriseTime = DateTime.fromSeconds(sunrise).setZone(zone);
        const sunsetTime = DateTime.fromSeconds(sunset).setZone(zone);

        // Update state with sunrise and sunset
        setSunriseTime(sunriseTime);
        setSunsetTime(sunsetTime);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        if (city == "") {
          toast.error("The city name can't be empty.", {
            position: "top-right", // toast position
            theme: "dark", // toast theme
            autoClose: 5000, // toast display time
          });
        } else {
          toast.warning("City not found. Please enter a valid city name.", {
            position: "top-right", // toast position
            theme: "dark", // toast theme
            autoClose: 5000, // toast display time
          });
        }
      });
  };

  const getWeatherImage = (description) => {
    switch (description) {
      case "Snow":
        return "/snow.png";
      case "Clear":
        return isNight ? "/clearNight.png" : "/clear.png";
      case "Rain":
        return "/rain.png";
      case "Clouds":
        return "/clouds.png";
      case "Mist":
        return isNight ? "/fogNight.png" : "/fog.png";
      case "Fog":
        return isNight ? "/fogNight.png" : "/fog.png";
      case "Haze":
        return isNight ? "/fogNight.png" : "/fog.png";
      case "Thunderstorm":
        return "/thunder.png";
      case "Smoke":
        return "/smoke.png";
      case "Drizzle":
        return "/drizzle.png";
      case "Dust":
        return "/dust.png";
      case "Sand":
        return "/dust.png";
      case "Ash":
        return "/ash.png";
      case "Squall":
        return "/squall.png";
      case "Tornado":
        return "/tornado.png";
    }
  };

  //enter key event handler
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleFetchWeather();
    }
  };

  //check if it is night or day
  useEffect(() => {
    console.log(timezone);
    const now = DateTime.now().setZone(timezone);
    console.log(now);
    const hour = now.hour;
    console.log(hour);
    setIsNight(hour >= 20 || hour < 6);
  }, [timezone]);
  return (
    <main className="h-screen flex items-center justify-center flex-col  ">
      <h1 className="flex font-extrabold text-white mb-2 2xl:text-8xl text-7xl animate__animated animate__fadeInDown ">
        Weather
      </h1>
      <div className="2xl:h-72 h-60 min-w-fit w-11/12 2xl:w-4/12 lg:w-6/12  rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 scale-95  ">
        <div className="h-full w-full bg-gray-800 flex items-center rounded-lg justify-center  ">
          {cityName && (
            <div className="flex-col mr-14 ml-2 ">
              <Image
                src={getWeatherImage(currentWeather)}
                width={96}
                height={96}
                alt="Weather Icon"
                className="mx-auto mb-2 animate__animated animate__zoomIn"
              />
              <h1 className="text-white 2xl:text-4xl lg:text-3xl md:text-xl text-xl font-semibold whitespace-nowrap animate__animated animate__fadeInDown ml-1 ">
                {cityName}, {country}
              </h1>

              {temperature !== null ? (
                <h1 className="text-white 2xl:text-2xl text-base lg:mt-2 animate__animated animate__fadeInDown">
                  🌡️{temperature.toFixed(1)}°C
                </h1>
              ) : (
                <p className="text-white"></p>
              )}
              <h1 className="text-white 2xl:text-base ml-1 text-sm animate__animated animate__fadeInDown">
                {currentWeather}
              </h1>
              <h1 className="text-white 2xl:text-base ml-2 text-sm animate__animated animate__fadeInDown">
                🕒Time: {currentTime.toLocaleString(DateTime.TIME_SIMPLE)}
              </h1>
              {sunriseTime && (
                <>
                  <div className="flex flex-row">
                    <h1 className="text-white 2xl:text-base ml-2 text-sm animate__animated animate__fadeInDown">
                      ☀ {sunriseTime.toLocaleString(DateTime.TIME_SIMPLE)}
                    </h1>
                    <h1 className="text-white 2xl:text-base ml-2 text-sm animate__animated animate__fadeInDown">
                      🌙 {sunsetTime.toLocaleString(DateTime.TIME_SIMPLE)}
                    </h1>
                  </div>
                </>
              )}
            </div>
          )}
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onKeyPress={handleKeyPress}
            onChange={handleCityChange}
            className="mt-0 animate__animated animate__fadeInDown flex 2xl:text-base text-sm  w-4/12 h-8 bg-gray-600 text-white pl-1 rounded-l-lg outline-none transition duration-500 focus:outline-purple focus:border-purple-500 focus:bg-gray-200 focus:text-black focus:duration-500  "
          />
          <button onClick={handleFetchWeather} className="mr-2">
            {" "}
            <Image
              src="/search.svg"
              width={32}
              height={32}
              alt="Picture of the author"
              className="bg-blue-500 hover:bg-blue-300 rounded-r-lg animate__animated animate__fadeInDown h-8 mr-2  "
            />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 mr-2 font-bold text-sm pointer-events-none">
        Copyright © 2023 Michał Obrębski. All Rights Reserved
      </div>
      <ToastContainer />
    </main>
  );
}
