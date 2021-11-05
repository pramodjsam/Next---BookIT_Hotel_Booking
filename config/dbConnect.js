import mongoose from "mongoose";

const dbConnect = () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default dbConnect;
