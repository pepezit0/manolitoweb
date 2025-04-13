import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Terminal } from "lucide-react";

interface NewsItem {
  title: string;
  date: string;
  url: string;
}

const NewsWidget = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch("/news.json");
        if (!response.ok) {
          throw new Error("Error al cargar el archivo de noticias");
        }
        const allNews: NewsItem[] = await response.json();

        const sortedNews = allNews
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);

        setNews(sortedNews);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(":: Error 404 :: No se pudieron cargar las noticias.");
        setLoading(false);
      }
    };

    fetchNews();

    const interval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        fetchNews();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-400 p-4 border border-red-400/30 bg-red-400/10 rounded-md">
        <Terminal size={16} />
        <span className="font-mono text-sm">{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="text-xs text-muted-foreground font-mono mb-2">$ sudo fetch_noticias --region=deza-tabeiros...</div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground font-mono mb-2">$ cat /var/log/noticias/deza_tabeiros.log | tail -5</div>
      {news.map((item, index) => (
        <div 
          key={index} 
          className="border-b border-border pb-3 last:border-0 last:pb-0 transition-colors hover:bg-secondary/30 rounded-sm px-2 py-1 -mx-2"
        >
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block group"
          >
            <h3 className="text-sm font-medium leading-tight mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="font-mono">{new Date(item.date).toLocaleDateString("es-ES")}</span>
              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

export default NewsWidget;