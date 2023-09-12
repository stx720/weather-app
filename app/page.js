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
import citiesData from "./api/cities.json";
import Autosuggest from "react-autosuggest";

export default function Home() {
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [isNight, setIsNight] = useState(false);
  const [timezone, setTimezone] = useState("");
  const [country, setCountry] = useState("");
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const handleCityChange = (event) => {
    setCity(event.target.value);
    toast.dismiss();
  };

  const handleFetchWeather = (selectedCity = city) => {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=ec35b4d54a274f524fa567c861ac8792`;

    axios
      .get(api)
      .then((response) => {
        const { main, name, weather, timezone, sys } = response.data;
        const { temp } = main;
        setTemperature(temp);
        setCityName(name);
        setCurrentWeather(weather[0].main);
        const zone = IANAZone.create(`Etc/GMT${-timezone / 3600}`);
        setTimezone(zone.name);
        setCountry(sys.country);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        toast.warning("City not found. Please enter a valid city name.", {
          position: "top-right", // toast position
          theme: "dark", // toast theme
          autoClose: 5000, // toast display time
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
    const now = DateTime.now().setZone(timezone); // used luxon to check the timezone
    const hour = now.hour;
    setIsNight(hour >= 20 || hour < 6);
  }, [timezone]);

  //autosuggest section

  const citySuggestions = citiesData.map((city) => ({
    name: `${city.name}, ${city.country}`,
    id: city.id,
  }));
  const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  const onSuggestionsFetchRequested = ({ value }) => {
    setTimeout(() => {
      const inputValue = value.trim().toLowerCase();
      const inputLength = inputValue.length;

      const filteredSuggestions =
        inputLength === 0
          ? []
          : citySuggestions.filter(
              (suggestion) =>
                suggestion.name.toLowerCase().slice(0, inputLength) === inputValue
            );
            const uniqueSuggestions = Array.from(new Set(filteredSuggestions.map((suggestion) => suggestion.name))).map((name) => {
              return filteredSuggestions.find((suggestion) => suggestion.name === name);
            }); //

            setSuggestions(uniqueSuggestions.slice(0, 3));
    }, 500);
  };
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setValue(suggestion.name);
    setSuggestions([]);
    setCity(suggestion.name); // Set the selected city as the current input value
    handleFetchWeather(suggestion.name); // Pass the full suggestion as an argument to the fetch function
  };

  const renderInputComponent = (inputProps) => (
    <input
      {...inputProps}
      className="animate__animated animate__fadeInDown flex 2xl:text-base text-sm w-full h-8 bg-gray-600 text-white pl-1 rounded-l-lg outline-none transition duration-500 focus:outline-purple focus:border-purple-500 focus:bg-gray-200 focus:text-black focus:duration-500"
    />
  );

  const inputProps = {
    placeholder: "Search city...",
    value: city,

    onChange: (event, { newValue }) => {
      setCity(newValue);
      handleCityChange;
      toast.dismiss();
    },
    onKeyPress: handleKeyPress,
  };

  return (
    <main className="h-screen flex items-center justify-center flex-col  ">
      <h1 className="flex font-extrabold text-white mb-2 2xl:text-8xl text-7xl animate__animated animate__fadeInDown ">
        Weather
      </h1>
      <div className="2xl:h-72 h-60 w-11/12 2xl:w-4/12 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1  ">
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
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={(suggestion) => suggestion.name}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            renderInputComponent={renderInputComponent}
            // Dodaj styl CSS na kontenerze sugestii
            shouldRenderSuggestions={() => true} // Pokazuj sugestie nawet jeśli pole jest puste
            containerProps={{
              style: {
                position: "relative",
              },
            }}
            theme={{
              container: {
                position: "relative",
                width: "100%", // Ustaw szerokość na 100% lub inną odpowiednią wartość
                height: "200px", // Ustaw stałą wysokość na kontenerze sugestii
              },
              suggestionsList: {
                position: "absolute",
                listStyle: "none",
                width: "100%",
                borderStyle: "solid",
                margin: 0,
                padding: 0,
                zIndex: 1,
                border: "2px solid black", // Dodaj odpowiednie style do listy sugestii
                backgroundColor: "white", // Dodaj odpowiedni kolor tła
                overflowY: "auto", // Dodaj pionowy pasek przewijania, jeśli jest potrzebny
                borderRadius : "10px",
              },
              suggestion: {
                padding: "10px", // Dodaj odpowiednie style do pojedynczej sugestii
                border: "1px solid black",
                cursor: "pointer",
              },
            }}
          />
          <button onClick={handleFetchWeather} className="mr-2">
            {" "}
            <Image
              src="/search.svg"
              width={32}
              height={32}
              alt="Picture of the author"
              className="bg-blue-500 hover:bg-blue-300 rounded-r-lg animate__animated animate__fadeInDown h-8   "
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
