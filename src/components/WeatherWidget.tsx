import { useEffect, useState } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, LucideProps } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherDay {
  date: string; // ISO date (ej. "2025-04-13")
  dayName: string; // ej. "Lunes"
  dateLabel: string; // ej. "13/4"
  condition: string; // ej. "Despejado"
  tempMax: number; // ej. 19.2
  tempMin: number; // ej. 11.0
  icon: React.FC<LucideProps>;
  iconColor: string; // Color para el ícono
}

const DAYS_TO_SHOW = 4;
const DAYS_TO_FETCH = 7;

const WeatherWidget: React.FC = () => {
  const [weatherDays, setWeatherDays] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=42.66&longitude=-8.11&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe/Madrid"
      );
      if (!response.ok) {
        throw new Error("Error al cargar el tiempo");
      }
      const data = await response.json();

      const days: WeatherDay[] = data.daily.time.map((date: string, index: number) => {
        const code = data.daily.weathercode[index];
        const tempMax = Number(data.daily.temperature_2m_max[index]);
        const tempMin = Number(data.daily.temperature_2m_min[index]);
        let condition: string;
        let icon: React.FC<LucideProps>;
        let iconColor: string;

        if (code === 0) {
          condition = "Despejado";
          icon = Sun;
          iconColor = "text-yellow-400"; // Amarillo para sol
        } else if (code >= 1 && code <= 3) {
          condition = "Nublado";
          icon = Cloud;
          iconColor = "text-gray-400"; // Gris para nubes
        } else if (code >= 51 && code <= 65) {
          condition = "Lluvia";
          icon = CloudRain;
          iconColor = "text-blue-400"; // Azul para lluvia
        } else if (code >= 71 && code <= 77) {
          condition = "Nieve";
          icon = CloudSnow;
          iconColor = "text-white"; // Blanco para nieve
        } else if (code >= 80) {
          condition = "Tormenta";
          icon = CloudLightning;
          iconColor = "text-purple-400"; // Púrpura para tormenta
        } else {
          condition = "Desconocido";
          icon = Cloud;
          iconColor = "text-gray-400";
        }

        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString("es-ES", { weekday: "long" });
        const dateLabel = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

        return { date, dayName, dateLabel, condition, tempMax, tempMin, icon, iconColor };
      });

      setWeatherDays(days.slice(0, DAYS_TO_SHOW));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("No se pudo cargar el tiempo");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    const checkDayChange = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setWeatherDays(prev => {
          if (prev.length <= 1) {
            fetchWeather();
            return prev;
          }
          const newDays = prev.slice(1);
          if (newDays.length < DAYS_TO_SHOW && prev.length < DAYS_TO_FETCH) {
            fetchWeather();
          }
          return newDays;
        });
      }
    };

    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="weather-widget p-4 border rounded-md">
        <h3 className="text-sm font-mono mb-2">$ weather --region=lalin</h3>
        <p className="text-red-400 text-xs">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="weather-widget p-4 border rounded-md">
        <h3 className="text-sm font-mono mb-2">$ weather --region=lalin</h3>
        <div className="flex gap-3">
          {[...Array(DAYS_TO_SHOW)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget p-4 border rounded-md">
      <h3 className="text-sm font-mono mb-2">$ weather --region=lalin</h3>
      <div className="flex gap-3">
        {weatherDays.map((day, index) => (
          <a
            key={index}
            href="https://www.meteogalicia.gal/web/predicion/concellos/36024/0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center border-2 border-gray-500 rounded-lg p-3 w-28 h-28 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <span className="capitalize truncate">{day.dayName.slice(0, 3)}</span>
            <span className="text-xs text-gray-400">{day.dateLabel}</span>
            <day.icon size={24} className={`my-1 ${day.iconColor}`} />
            <span>
              {day.tempMax.toFixed(0)}°/{day.tempMin.toFixed(0)}°
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;