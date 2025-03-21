import { Request, Response } from "express";
import { Book, BookAttribute } from "../models/book.model";

export const addBook = async (
  req: Request<Record<string, string>, void, BookAttribute | BookAttribute[]>,
  res: Response
) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      if (data.some((book) => !book.title || !book.author || !book.year)) {
        res
          .status(400)
          .json({ error: "All fields are required for each book!" });
        return;
      }

      const newBooks = await Book.bulkCreate(data);
      res.status(201).json(newBooks);
      return;
    }

    const { title, author, year } = data;
    if (!title || !author || !year) {
      res.status(400).json({ error: "All fields are required!" });
      return;
    }

    const newBook = await Book.create({ title, author, year });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ addBook_controller: error });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ getBooks_controllers: error });
  }
};

export const deleteBooks = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    if (book) {
      await book.destroy();
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ deleteBooks_controllers: error });
  }
};
