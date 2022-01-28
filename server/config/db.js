import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.once("open", function () {
      console.log("connection established");
    });
  } catch (error) {
    console.log(`MongoDB Error: , ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
