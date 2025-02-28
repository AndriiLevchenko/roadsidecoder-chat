import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`, {
            useNewUrlParser: true,
            useUnifiedTopology: true

        })
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
        process.exit();
    }
}

export default connectDB;
// module.exports = connectDB;