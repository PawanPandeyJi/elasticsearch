import { Request, Response } from "express";
import { Book, BookAttribute } from "../models/book.model";
import { performance } from "perf_hooks";
import { client } from "../config/elasticsearch";

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

      const start = performance.now();

      const esBody = newBooks.flatMap((book) => [
        { index: { _index: "books_index", _id: book.id.toString() } },
        book.toJSON(),
      ]);
      await client.bulk({ refresh: true, body: esBody });

      const end = performance.now();
      const elapsedTime = (end - start).toFixed(2);

      res.status(201).json({
        message: `${newBooks.length} books added successfully!`,
        books: newBooks,
        es_sync_time_ms: elapsedTime,
      });
      return;
    }

    const { title, author, year } = data as BookAttribute;
    if (!title || !author || !year) {
      res.status(400).json({ error: "All fields are required!" });
      return;
    }

    const newBook = await Book.create({ title, author, year });

    const start = performance.now();

    await client.index({
      index: "books_index",
      id: newBook.id.toString(),
      body: newBook.toJSON(),
    });

    await client.indices.refresh({ index: "books_index" });

    const end = performance.now();
    const elapsedTime = (end - start).toFixed(2);

    res.status(201).json({
      message: "Book added successfully!",
      book: newBook,
      es_sync_time_ms: elapsedTime,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to add book(s)", details: error });
    return;
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
    const { id } = req.params;
    const book = await Book.findByPk(id);

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    const start = performance.now();

    await book.destroy();

    await client.delete({
      index: "books_index",
      id: id,
    });

    await client.indices.refresh({ index: "books_index" });

    const end = performance.now();
    const elapsedTime = (end - start).toFixed(2);

    res.status(200).json({
      message: `Book [${id}] deleted successfully!`,
      es_sync_time_ms: elapsedTime,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book", details: error });
  }
};

export const updateBooks = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const book = await Book.findByPk(id);

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    await book.update(data);

    const start = performance.now();

    await client.index({
      index: "books_index",
      id: id,
      body: { ...book.toJSON() },
    });

    await client.indices.refresh({ index: "books_index" });

    const end = performance.now();
    const elapsedTime = (end - start).toFixed(2);

    res.status(200).json({
      message: `Book [${id}] updated successfully!`,
      es_sync_time_ms: elapsedTime,
      updatedBook: book,
    });
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to update book", details: error });
    return;
  }
};
