"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify"; // Importuj toast z react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "animate.css";
import { DateTime } from "luxon";

export default function Home() {
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isNight, setIsNight] = useState(false);
  const [timezone, setTimezone] = useState("");
  const [country, setCountry] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const handleCityChange = (event) => {
    setCity(event.target.value);
    toast.dismiss();
  };

  const removeAnimationClasses = () => {
    setIsAnimating(false);
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
        console.log(weather);
        setIsAnimating(true);
        setTimezone(timezone);
        setCountry(sys.country);
        

        setTimeout(removeAnimationClasses, 1000);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        toast.warning("City not found. Please enter a valid city name.", {
          position: "top-right", // Pozycja toastu
          autoClose: 5000, // Czas wyświetlania w milisekundach (5 sekund)
        });
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
      case "Thunderstorm":
        return "/thunder.png";
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
    const now = DateTime.now().setZone(timezone); // Użyj luxon do ustawienia strefy czasowej
    const hour = now.hour;
    setIsNight(hour >= 20 || hour < 6);
  }, [timezone]); 

  return (
    <main className="h-screen flex items-center justify-center flex-col  ">
      <h1 className="flex font-extrabold text-white mb-2 2xl:text-8xl text-7xl animate__animated animate__fadeInDown ">
        Weather
      </h1>
      <div className="h-72 w-11/12 2xl:w-4/12 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1  ">
        <div className=" h-full w-full bg-gray-800 flex items-center rounded-lg justify-center ">
          {cityName && (
            <div className="flex-col mr-10 ">
              <Image
                src={getWeatherImage(currentWeather)}
                width={96}
                height={96}
                alt="Weather Icon"
                className="mx-auto mb-2 animate__animated animate__zoomIn"
              />
              <h1 className="text-white 2xl:text-4xl text-base whitespace-nowrap animate__animated animate__fadeInDown ml-1 ">
                {cityName}, {country}
              </h1>

              {temperature !== null ? (
                <h1 className="text-white 2xl:text-2xl text-base mt-2 animate__animated animate__fadeInDown ml-1">
                  {temperature.toFixed(1)}°C
                </h1>
              ) : (
                <p className="text-white"></p>
              )}
              <h1 className="text-white 2xl:text-base text-sm animate__animated animate__fadeInDown ml-1">
                {currentWeather}
              </h1>
            </div>
          )}
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onKeyPress={handleKeyPress}
            onChange={handleCityChange}
            className="animate__animated animate__fadeInDown flex 2xl:text-base text-sm w-4/12 h-8 bg-gray-600 text-white pl-1 rounded-l-lg outline-none transition focus:outline-purple focus:border-purple-500 focus:bg-gray-200 focus:text-black  "
          />
          <button onClick={handleFetchWeather} className="mr-2">
            {" "}
            <Image
              src="/search.svg"
              width={32}
              height={32}
              alt="Picture of the author"
              className="bg-violet-400 hover:bg-violet-500 rounded-r-lg animate__animated animate__fadeInDown   "
            />
          </button>
        </div>
      </div>

      <div class="absolute bottom-0 right-0 mr-2 font-bold text-sm pointer-events-none">
        Copyright © 2023 Michał Obrębski. All Rights Reserved
      </div>
      <ToastContainer />
    </main>
  );
}
