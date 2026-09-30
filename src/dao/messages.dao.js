import Message from "../models/message.model.js";
class MessagesDAO {
  async create(data) { const doc=await Message.create(data); return doc.toObject(); }
  getAll() { return Message.find().lean(); }
  getById(id) { return Message.findById(id).lean(); }
}
export default MessagesDAO;
