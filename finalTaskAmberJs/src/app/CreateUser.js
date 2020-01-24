const { Operation } = require('@amberjs/core');
const User = require('src/domain/User');
const functionCollections = require('./helper/functionHandler');

class CreateUser extends Operation {
  constructor({ UserRepository }) {
    super();
    this.UserRepository = UserRepository;
  }

  async execute(data) {
    const { SUCCESS, VALIDATION_ERROR } = this.events;
    
    try {
      const user = new User(data);

      const result = new functionCollections(user);
      const errors = result.validationFunctions();
      

      if(errors){
        const error = new Error;
        error.message = errors;
        throw error;  
        
      }

      const newUser = await this.UserRepository.add(user.toJSON());

      this.emit(SUCCESS, newUser);
    } catch(error) {
      this.emit(VALIDATION_ERROR, {
        type: 'VALIDATION ERROR',
        details: error.message
      });      
    }
  }
}

CreateUser.setEvents(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'NOT_FOUND']);

module.exports = CreateUser;
