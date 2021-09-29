import https from "https";
import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import fetch from "cross-fetch";
import path from "path";
import { fileURLToPath } from "url";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    // public folder and serve index.html
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.get("/reset/:email/:exp/:token", {}, async (request, reply) =>
      reply.sendFile("reset.html")
    );

    app.get("/2fa", {}, async (request, reply) => reply.sendFile("2fa.html"));

    app.get("/verify/:email/:token", {}, async (request, reply) => {
      try {
        const { email, token } = request.params;

        const values = { email, token };

        // Disable SSL checking for this query
        const httpsAgent = new https.Agent({
          rejectUnauthorized: false,
        });

        const res = await fetch("https://api.nodeauth.dev/api/verify", {
          method: "POST",
          body: JSON.stringify(values),
          credentials: "include",
          agent: httpsAgent,
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        if (res.status === 200) {
          return reply.redirect("/");
        }
        return reply.code(401).send();
      } catch (e) {
        console.error(e);
        return reply.code(401).send();
      }
    });

    const PORT = 5000;
    await app.listen(PORT);
    console.log(`Server listening at port: ${PORT}`);
  } catch (e) {
    console.error(e);
  }
}

startApp();
