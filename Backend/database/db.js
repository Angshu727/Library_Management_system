import mongoose, { mongo } from "mongoose";

export const connectDB = () => {

    mongoose.connect(process.env.MONGODB_URL,{
        dbName:"library_management_system"
    }).then(()=>{
        console.log(`Connected to database successfully`);
    }).catch((err)=>{
        console.log(`Error while connecting to database ${err}`);
    });

};