'use strict';

describe('Agent', function() {
  const db = require('../../models');
  const Agent = db.Agent;

  let agent;

  const _valid = {};
  beforeEach(function(done) {
    db.sequelize.sync({force: true}).then(() => {
      _valid.name = 'Some Guy';
      _valid.email = 'someguy@example.com';
  
      agent = new Agent(_valid);

      done();
    }).catch(err => {
      done.fail(err);
    });
  });

  describe('basic validation', function() {
    const valid = {};
    beforeEach(function(done) {
       done();
    });

    it('sets the createdAt and updatedAt fields', function(done) {
      expect(agent.createdAt).toBe(undefined);
      expect(agent.updatedAt).toBe(undefined);
      agent.save().then(function(obj) {
        expect(agent.createdAt instanceof Date).toBe(true);
        expect(agent.updatedAt instanceof Date).toBe(true);
        done();
      }).catch(err => {
        done.fail(err);
      });
    });
  });
});
