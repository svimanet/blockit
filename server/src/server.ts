import { Database } from "bun:sqlite";
import { Game, gameScoreForm } from "./components/game";
import path from "path";
import { HiscoresModal, type Hiscore } from "./components/hiscores";

const db = new Database("mydb.sqlite");

db.query(`
  create table if not exists hiscores (
    id integer primary key autoincrement,
    name text,
    score integer,
    datetime text
  );
`).run();

const indexFile = Bun.file(path.join(__dirname, "./index.html"));
const styleFile = Bun.file(path.join(__dirname, "./style.css"));
const htmxFile = Bun.file(path.join(__dirname, "../../node_modules/htmx.org/dist/htmx.min.js"));
const gameFile = Bun.file(path.join(__dirname, "../../game/gamedist/main.js"));
const favicon = Bun.file(path.join(__dirname, "./assets/favicon.ico"));

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    const isGet = req.method === "GET";
    const isPost = req.method === "POST";
    console.log(req.url, req.method, req.headers);

    if (isGet) {
      if (url.pathname === "/") return new Response(indexFile);
      if (url.pathname === "/favicon.ico") return new Response(favicon);
      if (url.pathname === "/style.css") return new Response(styleFile);
      if (url.pathname === "/htmx.js") return new Response(htmxFile);
      if (url.pathname === "/game.js") return new Response(gameFile);

      /* GET Game HTML Canvas, Hiscores Form, and Game JS script.*/
      if (url.pathname === "/game") {
        const gameContainer = Game();
        return new Response(gameContainer,
          { status: 200, headers: { "Content-Type": "text/html" }}
        );
      }

      /* GET All hiscores as JSON */
      if (url.pathname === "/api/hiscores") {
        const query = db.query("select * from hiscores;");
        const result = query.all() as { id: number; name: string, score: number, when: Date }[];
        return new Response(JSON.stringify(result),
          { status: 200, headers: { "Content-Type": "application/json" }}
        );
      }

      /* GET Hiscores as a HTML Table */
      if (url.pathname === "/hiscores") {
        const query = db.query("select * from hiscores;");
        const result = query.all() as Hiscore[];
        const table = HiscoresModal(result);
        return new Response(table,
          { status: 200, headers: { "Content-Type": "text/html" }}
        );
      }
    }

    if (isPost) {

      /* POST new hiscore */
      if (url.pathname === "/api/hiscore") {
        const data: FormData = await req.formData();
        const name = data.get('name');
        const score = data.get('score');
        const when = new Date().toISOString();
        db.query(`
          insert into hiscores (
            name, score, datetime
          ) values (
            '${name}', ${score}, '${when}'
          );
        `).run();
        return new Response(`Hiscore added: ${name} ${score} ${when}`);
      }
    }

    return new Response("Not found", { status: 404 });
  },
});


console.log("Server running at http://localhost:3000  ");