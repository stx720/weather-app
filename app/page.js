"use client";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { DateTime, IANAZone } from "luxon";

// --- Icons ---
const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const SunUp = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#FBbf24" />
        <stop offset="1" stopColor="#F59e0b" />
      </linearGradient>
    </defs>
    <path
      d="M12 4V8M6.34 9.66L9.17 12.49M17.66 9.66L14.83 12.49"
      stroke="#FBbf24"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 18H20M12 18V13M9 16L12 13L15 16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
    <circle cx="12" cy="12" r="4" fill="url(#g1)" fillOpacity="0.2" />
  </svg>
);
const SunDown = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#F97316" />
        <stop offset="1" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <path
      d="M12 4V8M4 18H20M12 13V18M9 15L12 18L15 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.5"
    />
    <circle cx="12" cy="10" r="4" fill="url(#g2)" />
  </svg>
);
const Clock = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#3B82F6" strokeWidth="2" />
    <path
      d="M12 7V12L15 15"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2" fill="#3B82F6" />
  </svg>
);
const Thermometer = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#EF4444" />
        <stop offset="1" stopColor="#B91C1C" />
      </linearGradient>
    </defs>
    <path
      d="M14 14.76V3.5A2.5 2.5 0 0 0 9 3.5v11.26a4.5 4.5 0 1 0 5 0z"
      stroke="white"
      strokeWidth="2"
    />
    <path
      d="M11.5 8V16"
      stroke="url(#g3)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle cx="11.5" cy="17.5" r="2" fill="#EF4444" />
  </svg>
);

const Slot = ({ v1, v2, on }) => (
  <div
    className="relative overflow-hidden inline-block align-top"
    style={{ height: "1.2em", minWidth: "1px" }}
  >
    <div
      className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{ transform: on ? "translateY(0)" : "translateY(-50%)" }}
    >
      <div className="h-[1.2em] flex items-center justify-center whitespace-nowrap leading-none">
        {v1}
      </div>
      <div className="h-[1.2em] flex items-center justify-center whitespace-nowrap leading-none">
        {v2}
      </div>
    </div>
  </div>
);

export default function Page() {
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNight, setNight] = useState(false);
  const [celsius, setCelsius] = useState(true);
  const [fmt24, setFmt24] = useState(true);

  const getImg = (type) => {
    const m = {
      Snow: "/snow.png",
      Rain: "/rain.png",
      Drizzle: "/drizzle.png",
      Thunderstorm: "/thunder.png",
      Clouds: "/clouds.png",
      Smog: "/smoke.png",
      Dust: "/dust.png",
      Tornado: "/tornado.png",
      Mist: isNight ? "/fogNight.png" : "/fog.png",
      Fog: isNight ? "/fogNight.png" : "/fog.png",
      Clear: isNight ? "/clearNight.png" : "/clear.png",
    };
    return m[type] || m.Clear;
  };

  const search = async (e) => {
    e?.preventDefault();
    if (!q?.trim()) return toast("Enter a city name! 🌍", { icon: "⚠️" });
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${q.trim()}&units=metric&appid=ec35b4d54a274f524fa567c861ac8792`,
        { validateStatus: (s) => s < 500 },
      );
      if (res.status === 404) {
        setLoading(false);
        return toast.error("City not found 😔");
      }
      if (res.status !== 200) {
        setLoading(false);
        return toast.error("Something went wrong ⚠️");
      }

      const d = res.data;
      const hours = d.timezone / 3600;
      const zone = `Etc/GMT${hours >= 0 ? "-" : "+"}${Math.abs(hours)}`; // IANA sign flip
      let zoneName = "UTC";
      try {
        zoneName = IANAZone.create(zone).name;
      } catch {}

      const now = DateTime.now().setZone(zoneName);

      setData({
        name: d.name,
        country: d.sys.country,
        temp: {
          c: Math.round(d.main.temp),
          f: Math.round(d.main.temp * 1.8 + 32),
        },
        feels: {
          c: Math.round(d.main.feels_like),
          f: Math.round(d.main.feels_like * 1.8 + 32),
        },
        desc: d.weather[0].description,
        main: d.weather[0].main,
        zone: zoneName,
        time: {
          current: now.toISO(),
          sunrise: DateTime.fromSeconds(d.sys.sunrise)
            .setZone(zoneName)
            .toISO(),
          sunset: DateTime.fromSeconds(d.sys.sunset).setZone(zoneName).toISO(),
        },
      });
      setNight(now.hour >= 20 || now.hour < 6);
    } catch (err) {
      toast.error("Network error ⚠️");
    } finally {
      setLoading(false);
    }
  };

  const getTime = (iso) => {
    if (!iso || !data) return ["--:--", "--:--"];
    const dt = DateTime.fromISO(iso).setZone(data.zone);
    return [dt.toFormat("HH:mm"), dt.toFormat("h:mm a")];
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="text-center mb-10 w-full max-w-2xl relative z-10 animate-fade-in-up">
        <h1
          className="party-glow-text text-6xl md:text-8xl font-bold tracking-tighter mb-2"
          data-text="Weather"
        >
          Weather
        </h1>
        <p className="text-white/60 text-xs tracking-[0.3em] font-light uppercase">
          Real-time Forecasts
        </p>
      </div>

      <form
        onSubmit={search}
        className="search-container z-20 mb-8 w-full max-w-md animate-fade-in-up delay-100"
      >
        <input
          type="text"
          placeholder="Search for a city..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="search-input"
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <SearchIcon />
          )}
        </button>
      </form>

      {data && (
        <div
          key={data.name}
          className="glass-card w-full max-w-md p-6 md:p-8 animate-pop-in relative z-10 origin-center"
        >
          <div className="flex justify-end items-center gap-2 mb-2 absolute top-6 right-6 z-20">
            <button className="slot-btn" onClick={() => setCelsius(!celsius)}>
              <Slot v1="°C" v2="°F" on={celsius} />
            </button>
            <button
              className="slot-btn"
              style={{ minWidth: "50px" }}
              onClick={() => setFmt24(!fmt24)}
            >
              <Slot v1="24H" v2="12H" on={fmt24} />
            </button>
          </div>

          <div className="h-8 mb-4"></div>

          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-4xl font-bold text-white mb-1 tracking-tight">
                {data.name}
                <span className="ml-2 text-xl font-light text-white/50">
                  {data.country}
                </span>
              </h2>
              <p className="text-white/80 capitalize text-lg tracking-wide">
                {data.desc}
              </p>
            </div>
            <div className="relative -top-0 -right-2 animate-[float-y_4s_ease-in-out_infinite]">
              <Image
                src={getImg(data.main)}
                width={120}
                height={120}
                alt={data.main}
                className="drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                priority
              />
            </div>
          </div>

          <div className="text-center mb-10 relative flex justify-center">
            <h3 className="font-display text-[7rem] md:text-[8rem] leading-none font-bold text-white drop-shadow-2xl flex items-center justify-center">
              <Slot
                v1={data.temp.c + "°"}
                v2={data.temp.f + "°"}
                on={celsius}
              />
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 flex items-center gap-4 border border-white/5">
              <Clock />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">
                  Local Time
                </p>
                <div className="font-mono text-xl text-white font-medium">
                  <Slot
                    v1={getTime(data.time.current)[0]}
                    v2={getTime(data.time.current)[1]}
                    on={fmt24}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 flex items-center gap-4 border border-white/5">
              <Thermometer />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">
                  Feels Like
                </p>
                <div className="font-mono text-xl text-white font-medium">
                  <Slot
                    v1={data.feels.c + "°"}
                    v2={data.feels.f + "°"}
                    on={celsius}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 flex items-center gap-4 border border-white/5">
              <SunUp />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">
                  Sunrise
                </p>
                <div className="font-mono text-xl text-white font-medium">
                  <Slot
                    v1={getTime(data.time.sunrise)[0]}
                    v2={getTime(data.time.sunrise)[1]}
                    on={fmt24}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 flex items-center gap-4 border border-white/5">
              <SunDown />
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-1">
                  Sunset
                </p>
                <div className="font-mono text-xl text-white font-medium">
                  <Slot
                    v1={getTime(data.time.sunset)[0]}
                    v2={getTime(data.time.sunset)[1]}
                    on={fmt24}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-4 text-white/10 text-[10px] uppercase tracking-widest text-center w-full pointer-events-none">
        © {new Date().getFullYear()} Weather App
      </footer>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "rgba(20,20,30,0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            borderRadius: "16px",
            fontSize: "14px",
            padding: "12px 16px",
          },
          containerStyle: { zIndex: 99999 },
        }}
      />
    </main>
  );
}
