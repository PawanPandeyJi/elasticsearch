import express from "express";
import { addBook, deleteBooks, getBooks } from "../controllers/book.controller";

export const boookRouter = express.Router()

boookRouter.route('/book').post(addBook)

boookRouter.route('/books').get(getBooks)

boookRouter.route('/books/:id').delete(deleteBooks)



