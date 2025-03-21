import express from "express";
import { createIndex } from "../controllers/elasticsearch.controller";

export const elasticSearchRouter = express.Router()

elasticSearchRouter.route('/create-index').get(createIndex)
    

