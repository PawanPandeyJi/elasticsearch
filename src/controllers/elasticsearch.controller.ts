import { Request, Response } from "express";
import { client } from "../config/elasticsearch";

export const createIndex = async (
  req: Request<Record<string, string>, void, void>,
  res: Response
) => {
  try {
    const checkIndex = await client.indices.exists({
      index: "books_index",
    });
    if (checkIndex) {
      res.status(403).json({ message: "Index already exist!" });
      return;
    }
    const response = await client.indices.create({
      index: "books_index", 
    });
    res.json(response);
  } catch (error) {
    console.log("createIndex", error);
    res.status(500).json({ createIndex_controller: error });
  }
};

