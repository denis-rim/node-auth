// Import like this will load code and run immediately
import "./env.js";
import { fastify } from "fastify";
import fastifyStatic from "fastify-static";
import fastifyCookie from "fastify-cookie";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./db.js";
import { registerUser } from "./accounts/register.js";
import { authorizeUser } from "./accounts/authorize.js";
import { logUserIn } from "./accounts/logUserIn.js";

// ESM specific features
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = fastify();

async function startApp() {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });

    // public folder and serve index.html
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });

    app.post("/api/register", {}, async (request, reply) => {
      try {
        const userId = await registerUser(
          request.body.email,
          request.body.password
        );
      } catch (e) {
        console.error(e);
      }
    });

    app.post("/api/authorize", {}, async (request, reply) => {
      try {
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        );

        if (isAuthorized) {
          await logUserIn(userId, request, reply);
        }

        // Generate auth token

        // Set cookies
        reply
          .setCookie("testCookie", "the value is this", {
            path: "/",
            domain: "localhost",
            httpOnly: true,
          })
          .send({
            data: "test",
          });
      } catch (e) {
        console.error(e);
      }
    });

    app.get("/test", {}, (request, reply) => {
      console.log(request.headers["user-agent"]);
      reply.send({
        data: "hello test",
      });
    });

    await app.listen(3000);
    console.log("Server listening at port: 3000");
  } catch (e) {
    console.log(e);
  }
}

connectDB().then(() => {
  startApp();
});
