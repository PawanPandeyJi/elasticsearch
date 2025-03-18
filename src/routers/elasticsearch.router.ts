import express from "express";

export const elasticSearchRouter = express.Router()

elasticSearchRouter.route('/create-index').get(createIndex)

