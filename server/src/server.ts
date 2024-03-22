import { Database } from "bun:sqlite";
import path from "path";

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
const htmxFile = Bun.file(path.join(__dirname, "../htmx/htmx.min.js"));
const gameFile = Bun.file(path.join(__dirname, "../../game/gamedist/main.js"));

Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    const isGet = req.method === "GET";
    const isPost = req.method === "POST";
    console.log(req.url, req.method, req.headers);

    if (isGet) {
      if (url.pathname === "/") return new Response(indexFile);
      if (url.pathname === "/style.css") return new Response(styleFile);
      if (url.pathname === "/htmx.js") return new Response(htmxFile);
      if (url.pathname === "/game.js") return new Response(gameFile);

      /* GET Game HTML Canvas, Hiscores Form, and Game JS script, as HTML */
      if (url.pathname === "/game") {

        /* Script element is insert in dom on response, which requests GET "/game.js" */
        const gameScript = (`
          <script id='game-script' src='game.js' type='module'></script>
        `);

        const scoreForm = (`
          <form hx-post="api/hiscore" id="score-form" name="score form">
            <input name="name" type="name" autocomplete="name" required />
            <input name="score" type="number" required />
            <button type="submit" value>submit</button>
          </form>
        `);

        /* game.js appends to #game */
        const gameContainer = (`
          <div id="game-container">
            ${scoreForm}
            ${gameScript}
            <div id="game"/>
          </div>
        `);

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
      interface hiscore { id: number; name: string, score: number, dateime: Date };
      if (url.pathname === "/hiscores") {
        const query = db.query("select * from hiscores;");
        const result = query.all() as hiscore[];

        const tableRows = result.map((row) => {
          return (`
            <tr>
              <td>${row.id}</td>
              <td>${row.name}</td>
              <td>${row.score}</td>
              <td>${row.dateime}</td>
            </tr>
          `);
        });

        const table = `
        <modal>
          <table>
            ${ tableRows.join("") }
          </table>
        </modal>
        `;

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
        const score = data.get('score')
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