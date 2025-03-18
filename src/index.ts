import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {sequelize} from "./config/database";
import { checkConnection } from "./config/elasticsearch";

const app = express();


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
