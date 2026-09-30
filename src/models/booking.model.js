import mongoose from "mongoose";
const bookingServiceSchema = new mongoose.Schema({
  service:{type:mongoose.Schema.Types.ObjectId,ref:"Service",required:true},
  quantity:{type:Number,required:true,min:1,default:1}
},{_id:false});
const schema = new mongoose.Schema({
  clientName:{type:String,required:true,trim:true}, clientEmail:{type:String,required:true,trim:true},
  date:{type:String,required:true}, time:{type:String,required:true}, status:{type:String,required:true},
  services:{type:[bookingServiceSchema],default:[]}
},{timestamps:true});
export default mongoose.model("Booking", schema);
