import { Sequelize } from "sequelize";

if (
  !process.env.DB_NAME ||
  !process.env.DB_USERNAME ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_HOST
) {
  throw new Error("One or more required environment veriables are missing!!")
}

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successfully");
  })
  .catch((error) => {
    console.log("Database Connection failed", error);
  });
