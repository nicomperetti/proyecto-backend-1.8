import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name:{type:String,required:true,trim:true}, description:{type:String,required:true,trim:true},
  duration:{type:Number,required:true,min:0}, price:{type:Number,required:true,min:0},
  category:{type:String,required:true,trim:true}, available:{type:Boolean,required:true}
},{timestamps:true});
export default mongoose.model("Service", schema);
