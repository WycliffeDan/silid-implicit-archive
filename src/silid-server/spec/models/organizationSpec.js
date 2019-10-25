'use strict';

describe('Organization', () => {
  const db = require('../../models');
  const Organization = db.Organization;

  let organization;

  const _valid = {};
  beforeEach(done => {
    db.sequelize.sync({force: true}).then(() => {
      _valid.name = 'Chill Bill International';
//      _valid.email = 'someguy@example.com';
  
      organization = new Organization(_valid);

      done();
    }).catch(err => {
      done.fail(err);
    });
  });

  describe('basic validation', () => {
    it('sets the createdAt and updatedAt fields', done => {
      expect(organization.createdAt).toBe(undefined);
      expect(organization.updatedAt).toBe(undefined);
      organization.save().then(obj => {
        expect(organization.createdAt instanceof Date).toBe(true);
        expect(organization.updatedAt instanceof Date).toBe(true);
        done();
      }).catch(err => {
        done.fail(err);
      });
    });

    describe('name', () => {
      it('requires a name', done => {
        delete _valid.name;
        organization = new Organization(_valid);
        organization.save().then(obj => {
          done.fail('This shouldn\'t haved saved');
        }).catch(err => {
          expect(err.errors.length).toEqual(1);
          expect(err.errors[0].message).toEqual('Organization requires a name');
          done();
        });
      });

      it('does not allow duplicate names', done => {
        organization.save().then(obj => {
          expect(obj.name).toEqual(_valid.name);
          let newOrganization = new Organization(_valid);
          newOrganization.save().then(obj => {
            done.fail('This shouldn\'t have saved');
          }).catch(err => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toEqual('That organization is already registered');
            done();
          });
        }).catch(err => {
          done.fail(err);
        });
      });
    });
  });
});
