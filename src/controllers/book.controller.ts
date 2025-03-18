import { Request, Response } from "express";
import { Book, BookAttribute } from "../models/book.model";

export const addBook = async (
  req: Request<Record<string, string>, void, BookAttribute>,
  res: Response
) => {
  try {
    const { title, author, year } = req.body;
    if (!title || !author || !year) {
       res.status(400).json({ error: "All fields are required!" });
       return
    }

    const newBook = await Book.create({ title, author, year });
    res.status(201).json(newBook);
  } catch (error) {
    console.log("addBook", error);
    res.status(500).json({ "addBook_controller": error });
  }
};
