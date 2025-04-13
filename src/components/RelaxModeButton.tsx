import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const cunadoPhrases = [
  "Trabajar pa’ qué, si la vida es pa’ disfrutarla en chanclas.",
  "El curro es como una dieta: todos dicen que es sano, pero te mata por dentro.",
  "Ocho horas en la oficina… ¡Eso no es vida, eso es una condena!",
  "El que madruga, amanece con ojeras. ¡Vive tranqui, cuñado!",
  "Trabajar es de enfermos, yo estoy sano como una lechuga.",
  "La nómina no paga la felicidad, pero una siesta sí.",
  "Si el trabajo es salud, que curren los enfermos, ¿no?",
  "Horario fijo, vida rota. ¡Suelta el boli y coge la cervecita!",
  "El jefe dice ‘esfuerzo’, yo digo ‘siesta’. Cada uno con lo suyo.",
  "Trabajar tanto pa’ pagar facturas… ¡Mejor apago la luz y vivo en paz!",
  "La oficina es un virus: te atrapa y no te suelta. ¡Vacúnate con relax!",
  "El curro es como el gimnasio: todos van, pero nadie quiere estar ahí.",
  "Levantarse temprano pa’ trabajar es antinatural, ¡que lo hagan las gallinas!",
  "Si el trabajo dignifica, yo debo de ser el más vago con honra.",
  "El lunes es un invento pa’ amargarnos. ¡Viva el finde eterno!",
  "Trabajar pa’ vivir o vivir pa’ trabajar… Yo elijo la hamaca.",
  "El estrés del curro envejece más que el sol. ¡A la sombra, cuñado!",
  "Una reunión de dos horas es un delito contra la humanidad.",
  "El salario no compensa las ganas de estar en el sofá con palomitas.",
  "Trabajar es de locos, ¡que lo haga el que no tenga Netflix!"
];

const RelaxModeButton = () => {
  const [isLateNight, setIsLateNight] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      setIsLateNight(hours >= 23 || hours < 6);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRelaxMode = () => {
    setLoading(true);
    
    if (isLateNight) {
      toast({
        title: "Modo Relax",
        description: "¡Oye, cuñado, que a estas horas TikTok no mola! Échate a dormir hasta las 6, ¿eh?",
        duration: 5000,
        className: "max-w-md p-6 text-base border-2 border-white bg-background/90 shadow-lg",
      });
      
      setLoading(false);
    } else {
      const randomPhrase = cunadoPhrases[Math.floor(Math.random() * cunadoPhrases.length)];
      
      toast({
        title: "Modo Relax",
        description: `"${randomPhrase}"`,
        duration: 4000,
        className: "max-w-md p-6 text-base border-2 border-white bg-background/90 shadow-lg",
      });
      
      setTimeout(() => {
        setLoading(false);
        window.location.href = "https://www.tiktok.com";
      }, 4000);
    }
  };

  return (
    <div className="text-center">
      <Button 
        className="w-full"
        variant="default" 
        size="lg"
        disabled={loading}
        onClick={handleRelaxMode}
      >
        {loading ? "Cargando..." : "Entrar en modo Relax"}
      </Button>
      
      <p className="mt-2 text-xs text-muted-foreground">
        {isLateNight 
          ? "Es tarde, descansa hasta las 6:00" 
          : "Activa el modo relax pa’ una frase de cuñado"}
      </p>
    </div>
  );
};

export default RelaxModeButton;