import mongoose from "mongoose";

export function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const uri = process.env.MONGODB_URI;
        return mongoose.connect(uri);
    }
}

// import mongoose from "mongoose";

// const connectDb = (handler) => async (req, res) => {
//   if (mongoose.connections[0].readyState) {
//     return handler(req, res);
//   }
//   await mongoose.connect(process.env.MONGO_URI);
//   return handler(req, res);
// };
// export default connectDb;