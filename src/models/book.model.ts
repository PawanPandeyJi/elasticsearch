import { Model, DataType, DataTypes } from "sequelize";
import { sequelize } from "../config/database";
import { client } from "../config/elasticsearch";

export type BookAttribute = {
  id: string;
  title: string;
  author: string;
  year: number;
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
  public year!: number;

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
      type: DataTypes.NUMBER,
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
    await client.index({
      index: "books_index",
      id: book.id.toString(),
      body: book.toJSON(),
    });
    console.log(`📌 Book [${book.id}] added to Elasticsearch`);
  });
  
  Book.afterDestroy(async (book) => {
    await client.delete({
      index: "books_index",
      id: book.id.toString(),
    });
    console.log(`📌 Book [${book.id}] removed from Elasticsearch`);
  });
