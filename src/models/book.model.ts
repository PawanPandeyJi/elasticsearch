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









// Book.afterCreate(async (book) => {
//   try {
//     const es_response = await client.index({
//       index: "books_index",
//       id: book.id.toString(),
//       body: book.toJSON(),
//     });
//     console.log(`📌 Book [${book.id}] added to Elasticsearch`, es_response);
//   } catch (error) {
//     console.error("❌ Error indexing book in Elasticsearch:", error);
//   }
// });

// Book.afterBulkCreate(async (books) => {
//   try {
//     for (const book of books) {
//       const es_response = await client.index({
//         index: "books_index",
//         id: book.id.toString(),
//         body: book.toJSON(),
//       });
//       console.log(`📌 Book [${book.id}] added to Elasticsearch bulk`,es_response);
//     }
//   } catch (error) {
//     console.error("❌ Error indexing book in Elasticsearch bulk:", error);
//   }
// });

// Book.afterDestroy(async (book) => {
//   try {
//     const es_response = await client.delete({
//       index: "books_index",
//       id: book.id.toString(),
//     });
//     console.log(`✅ Book [${book.id}] removed from Elasticsearch`, es_response);
//   } catch (error) {
//     console.error("❌ Error removing book from Elasticsearch:", error);
//   }
// });
