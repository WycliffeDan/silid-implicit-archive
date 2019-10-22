# transcriber-auth
Transcriber-auth is a lambda service written in NodeJS utilizing [Express](https://expressjs.com/), [SequelizeJS](http://docs.sequelizejs.com/), and [Serverless](https://serverless.com/). To prevent vendor lock-in, it is written as a traditional NodeJS application and not customized for running in AWS Lambda's design pattern (```exports.handler = async function```). If you are familiar with basic Express design patterns (```app.get(), app.post()```, etc), you should be able to edit transcriber-auth application with ease.
# API Endpoints
  ```
  // Organization Endpoints
  // Create
  app.post("/api/organization",checkJwt , organizationController.create);
  // Read
  app.get("/api/organization/:id(\\d+)/", checkJwt , organizationController.read);
  app.get("/api/organizations/", checkJwt , organizationController.readAll);
  app.get("/api/organization/:uniquekey", checkJwt , organizationController.readKey);
  // Update
  app.put("/api/organization/:id", checkJwt , organizationController.update);
  // Delete
  app.delete("/api/organization/:id", checkJwt , organizationController.delete);

  // Membership Endpoints
  // Create
  app.post("/api/membership",checkJwt , membershipContoller.create);
  // Read
  app.get("/api/membership/:id(\\d+)/", checkJwt , membershipContoller.read);
  app.get("/api/memberships/", checkJwt , membershipContoller.readAll);
  // app.get("/api/membership/:uniquekey", checkJwt ,membershipContoller.readKey);
  // Update
  app.put("/api/membership/:id", checkJwt , membershipContoller.update);
  // Delete
  app.delete("/api/membership/:id", checkJwt , membershipContoller.delete);
  
  // App Endpoints
  // Create
  app.post("/api/app", checkJwt , appController.create);
  // Read
  app.get("/api/app/:id(\\d+)/", checkJwt , appController.read);
  app.get("/api/apps/", checkJwt , appController.readAll);
  app.get("/api/app/:uniquekey", checkJwt , appController.readKey);
  // Update
  app.put("/api/app/:id", checkJwt , appController.update);
  // Delete
  app.delete("/api/app/:id", checkJwt , appController.delete);

  // User Endpoints
  // Create
  app.post("/api/user", checkJwt , userController.create);
  // Read
  app.get("/api/user/:id(\\d+)/", checkJwt , userController.read);
  app.get("/api/users/", checkJwt , userController.readAll);
  app.get("/api/user/:authid", checkJwt ,userController.readKey);
  // Update
  app.put("/api/user/:id", checkJwt , userController.update);
  // Delete
  app.delete("/api/user/:id", checkJwt , userController.delete);

  // Goal Endpoints
  // Create
  app.post("/api/goal", checkJwt , goalController.create);
  // Read
  app.get("/api/goal/:id(\\d+)/", checkJwt , goalController.read);
  app.get("/api/goals/", checkJwt , goalController.readAll);
  // Update
  app.put("/api/goal/:id", checkJwt , goalController.update);
  // Delete
  app.delete("/api/goal/:id", checkJwt , goalController.delete);
```
# Installation
Install the node packages:
```
npm install
```
Overwrite the default config/config.json file with actual rds credentials to pass to sequelize (void if running ```sequelize init```).

Create a  serverless.env.yaml file in the home directory with the actual rds credentials to pass to serverless.

# Running Locally 
In order to develop locally a few changes need to be made. Modify the ```app.js``` file by uncommenting out the following:

```
// app.listen(process.env.PORT || 3000, function() {
//     console.log('Running on port 3000');
// });
```
Lastly, comment out the last line:
```
module.exports.handler = serverless(app);
```
You should now be able to run locally by executing:
```
npm start
```
# Local Development
There are currenly four services which fall under the identity service project: [auth-portal](https://github.com/sillsdev/auth-portal), [auth-next](https://github.com/sillsdev/auth-next), [auth-account](https://github.com/sillsdev/auth-account), and [transcriber-auth](https://github.com/sillsdev/transcriber-auth) (backend api).
## auth-portal
In order to run locally in collaboration with other login services, a flag of `&local=true` must be present in the query string of the url for [auth-portal](https://github.com/sillsdev/auth-portal). This enables local callbacks for the signup service ([auth-next](https://github.com/sillsdev/auth-next)) at [http://localhost:3001](http://localhost:3001).
## auth-next

Running [auth-next](https://github.com/sillsdev/auth-next) locally can be achieved by overwriting the api endpoints (currently in stepper.tsx) to the correct localhost port designation.

## auth-account

Running [auth-account](https://github.com/sillsdev/auth-account) locally can be achieved by overwriting the api endpoints to the correct localhost port designation.

## transcriber-auth
Running `nodemon app.js` is handy; be sure to convert the express server from javascript module in app.js. 

## Example

Running auth-portal at [http://localhost:3000](http://localhost:3000), running auth-next at [http://localhost:3001](http://localhost:3001), and running transcriber-auth at [http://localhost:3002](http://localhost:3002) from each respective repository.

# Deployment
Run the serverless command:
```
serverless deploy
```
or optionally run the deploy shell script.
```
sh deploy.sh
```
# Architecture
In addition to the Node application being deployed, the serverless framework grants the ability to attach CloudFormation scripts along with the deployment. All of this can be seen in the serverless.yml file. F.e. the database is being deployed via this method:
```
   transcriberauthrdscluster:
      Type: AWS::RDS::DBInstance
      Properties:
        Engine: Postgres
        DBName: transcriberauthdb
        MasterUsername: ${file(./serverless.env.yaml):production.MasterUsername}
        MasterUserPassword: ${file(./serverless.env.yaml):production.MasterUserPassword}
        DBInstanceClass: db.t3.micro
        AllocatedStorage: 10
        VPCSecurityGroups:
        - "Fn::GetAtt": transcriberauthdatasg.GroupId
        DBSubnetGroupName:
          Ref: transcriberauthdatasubnet
```
# Sequelize
It may be necessary to re-initialize the folder structure. In this case, verify the ```.sequelizerc``` file is present in the root directory of the project and then run:
```
sequelize init
```
Note: This will overwrite credentials stored in server/config/config.json from config/constant.js