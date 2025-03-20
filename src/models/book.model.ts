import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { client } from "../config/elasticsearch";

export type BookAttribute = {
  id: string;
  title: string;
  author: string;
  year: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type BookCreationAttribute = Omit<BookAttribute, "id">;

export class Book
  extends Model<BookAttribute, BookCreationAttribute>
  implements BookAttribute
{
  public id!: string;
  public title!: string;
  public author!: string;
  public year!: string;

  public readonly createAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    tableName: "books",
  }
);

Book.afterCreate(async (book) => {
  const es_response = await client.index({
    index: "books_index",
    id: book.id.toString(),
    body: book.toJSON(),
  });
  console.log(`📌 Book [${book.id}] added to Elasticsearch`, es_response);
  console.log(`🔎 Full Elasticsearch Response:`, JSON.stringify(es_response, null, 2));
});


Book.afterBulkCreate(async (books) => {
  for (const book of books) {
    await client.index({
      index: "books_index",
      id: book.id.toString(),
      body: book.toJSON(),
    });
    console.log(`📌 Book [${book.id}] added to Elasticsearch`);
  }
});
Book.afterDestroy(async (book) => {
  await client.delete({
    index: "books_index",
    id: book.id.toString(),
  });
  console.log(`📌 Book [${book.id}] removed from Elasticsearch`);
});
