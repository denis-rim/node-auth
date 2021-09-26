import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import path from "path";
import {fileURLToPath} from "url";

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

    const PORT = 5000
    await app.listen(PORT);
    console.log(`Server listening at port: ${PORT}`);
  } catch (e) {
    console.error(e)
  }
}

startApp();