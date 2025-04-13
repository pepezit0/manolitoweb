import Parser from "rss-parser";
import { writeFile } from "fs/promises";
import { join } from "path";
import { scheduleJob } from "node-schedule";

const parser = new Parser();

async function fetchNews() {
  try {
    const feed = await parser.parseURL(
      "https://news.google.com/rss/search?q=lalin&hl=es&gl=ES&ceid=ES:es"
    );

    const items = feed.items.slice(0, 5).map(item => ({
      title: item.title || "Sin título",
      date: item.pubDate || new Date().toISOString(),
      url: item.link || "#",
    }));

    // Rellenar con placeholders si hay menos de 5 noticias
    while (items.length < 5) {
      items.push({
        title: "No hay más noticias disponibles",
        date: new Date().toISOString(),
        url: "#",
      });
    }

    const outputPath = join(process.cwd(), "public/news.json");
    await writeFile(outputPath, JSON.stringify(items, null, 2));
    console.log("news.json actualizado con éxito");
  } catch (error) {
    console.error("Error al obtener noticias:", error);
  }
}

// Ejecutar inmediatamente
fetchNews();

// Programar ejecución diaria a las 12:00
scheduleJob("0 12 * * *", fetchNews);