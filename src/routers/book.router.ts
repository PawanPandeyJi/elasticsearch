import express from "express";
import { addBook } from "../controllers/book.controller";

export const boookRouter = express.Router()

boookRouter.route('/book').post(addBook)

