import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors'
import {sequelize} from "./config/database";
import { checkConnection } from "./config/elasticsearch";
import { elasticSearchRouter } from "./routers/elasticsearch.router";
import { boookRouter } from "./routers/book.router";

const app = express();
app.use(express.json())

const corsPolicy = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,HEAD",
  credentials: true
}

app.use(cors(corsPolicy))


app.use(elasticSearchRouter)
app.use(boookRouter)

checkConnection();

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.log("Error while sync database", error);
  });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
