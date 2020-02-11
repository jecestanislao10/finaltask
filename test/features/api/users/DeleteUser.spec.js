const request = require('supertest');
const { expect } = require('chai');
const { getUserId } = require('test/support/userHelper');
const { getToken } = require('test/support/tokenFactory');
const mochaAsync = require('test/support/mochaAsync');

describe('API :: DELETE /api/users/:id', () => {
  context('when credentials are invalid', () => {  
    it('returns 401', mochaAsync(async () => {
      let res = await request('localhost:' + process.env.PORT)
        .get(`/api/users/${getUserId()}`);

      const obj = JSON.parse(res.text);
      expect(obj.status).to.equal(401);                            
    }));
    context('when user is not found', () => {
      it('returns 404 with NotFoundError', mochaAsync(async () => {
        let res = await request('localhost:' + process.env.PORT)
          .delete(`/api/users/${getUserId()+'wrong'}`)
          .set('Authorization', 'bearer ' + getToken())
          .expect(404);
    
        const obj = JSON.parse(res.text); 
        expect(obj.type).to.equal('NotFoundError');
      }));
    });

  });


  context('when credentials are valid', () => {  
    it('deletes user data with message', mochaAsync(async () => {
      let res = await request('localhost:' + process.env.PORT)
        .delete(`/api/users/${getUserId()}`)
        .set('Authorization', 'bearer ' + getToken());
      const obj = JSON.parse(res.text);
      expect(obj.status).to.equal(200);      
      expect(obj.details.message).to.equal('Successfully deleted!');                
    })
    );
  });    
});