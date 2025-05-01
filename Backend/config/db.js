import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://richardkawenze22:ritchie7553@wafumi.au27j.mongodb.net/blockchain')
        .then(() => console.log("DB Connected Successfully"))
        .catch((err) => console.error("DB Connection Failed:", err));
};
