import MessagesDAO from "../dao/messages.dao.js";
class MessagesRepository {
  constructor(){this.dao=new MessagesDAO();}
  create(data){return this.dao.create(data);} getAll(){return this.dao.getAll();} getById(id){return this.dao.getById(id);}
}
export default MessagesRepository;
