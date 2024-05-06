import express from "express";
import mongoose from "mongoose";
import admin from "./src/Routes/index.js";
import dotenv from "dotenv";
import errorHandler from "./src/errorHandler/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 9000;

dotenv.config();

function MongoDbConnection() {
  try {
    mongoose.connect("mongodb://localhost:27017/DemoSite", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.once("open", () => {
      console.log("Connected to Mongo");
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Enable CORS
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-with,Content-Type,Accept,Authorization"
      );

      if (req.method == "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({});
      }
      next();
    });

    app.use("/api", admin);
    app.use(errorHandler);
  } catch (err) {
    console.log(err, "err");
  }
}
MongoDbConnection();

app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});
