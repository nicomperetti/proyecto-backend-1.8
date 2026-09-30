import mongoose from "mongoose";
const schema = new mongoose.Schema({
  user:{type:String,required:true,trim:true}, message:{type:String,required:true,trim:true}
},{timestamps:true});
export default mongoose.model("Message", schema);
