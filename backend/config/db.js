import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connUri = process.env.MONGO_URL || "mongodb://localhost:27017/food-del";
        await mongoose.connect(connUri);
        console.log("DB Connected");
    } catch (error) {
        console.log("DB Connection Error:", error.message);
    }
};