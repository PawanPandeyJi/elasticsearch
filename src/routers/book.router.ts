import express from "express";
import { addBook, getBooks } from "../controllers/book.controller";

export const boookRouter = express.Router()

boookRouter.route('/book').post(addBook)

boookRouter.route('/books').get(getBooks)



