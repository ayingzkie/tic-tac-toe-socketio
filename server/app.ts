import "reflect-metadata";
import express from "express";
import socket from "./config/socket";
import { createServer } from "http";
import cors from "cors";
import router from "./routes";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//Mongoose setup start

const mongoDB = process.env.DB_URI || "";
console.log(mongoDB, "@db");

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// Mongoose end;

const server = createServer(app);

const io = socket(server);

app.use(
  cors({
    origin: "*",
  })
);

app.use(router);

app.get("/", (req, res) => {
  res.send("App is running!");
});

app.get("/getRooms", (req, res) => {
  try {
    const initialValue: any[] = [];
    const rooms = Array.from(io.sockets.adapter.rooms).reduce(
      (acc, curr): string[] => {
        if (curr[0].includes("created-")) {
          acc.push({
            name: curr[0],
            count: io.sockets.adapter.rooms.get(curr[0])?.size,
          });
        }

        return acc;
      },
      initialValue
    );

    res.status(200).json({
      rooms,
    });
  } catch (e) {
    console.log(e);
  }
});

server.listen(3000, () => {
  console.log("App is listening on port: " + 3000);
});

export default server;
