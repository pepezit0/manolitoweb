
import { useState, useEffect } from "react";
import { Clock, CloudRain, Newspaper, Activity } from "lucide-react";
import WeatherWidget from "@/components/WeatherWidget";
import NewsWidget from "@/components/NewsWidget";
import DailyFactWidget from "@/components/DailyFactWidget";
import RelaxModeButton from "@/components/RelaxModeButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const formattedDate = currentTime.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-6 md:px-6">
      <header className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl md:text-2xl font-semibold">Panel de Control</h1>
          <div className="text-right">
            <p className="text-lg font-medium">{formattedTime}</p>
            <p className="text-sm text-muted-foreground capitalize">{formattedDate}</p>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <CloudRain className="h-5 w-5 mr-2" />
              Meteorología - Lalín
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeatherWidget />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Newspaper className="h-5 w-5 mr-2" />
              Noticias Deza-Tabeirós
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NewsWidget />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Activity className="h-5 w-5 mr-2" />
              Dato curioso del día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyFactWidget />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Clock className="h-5 w-5 mr-2" />
              Modo Relax
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RelaxModeButton />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
