import mongoose from "mongoose";

export const MongoConnect = async () => {
  await mongoose
    .connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "chatapp",
    } as mongoose.ConnectOptions)
    .then(() => {
      console.log("Express is connected to MongoDB!");
    })
    .catch(() => {
      console.error("Express failed to connect to MongoDB!");
    });
};
