// Import like this will load code and run immediately
import "./env.js";
import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import path from "path";
import { fileURLToPath } from "url";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

console.log(process.env.MONGO_URL);

async function startApp() {
  try {
    // public folder and serve index.html
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    await app.listen(3000);
    console.log("Server listening at port: 3000");
  } catch (e) {
    console.log(e);
  }
}

startApp();
