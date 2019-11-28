const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')
const db = require('./database');

module.exports = (on, config) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);

  /**
   * 2019-11-25 https://stackoverflow.com/questions/52070262/cypress-pipe-console-log-and-command-log-to-output
   *
   * Log to stdout in headless tests
   */
  on('task', {
    log (message) {
      console.log(message);
      return null;
    },

    query(queryStr) {
        console.log('QUERYING');
        console.log(queryStr);
//      return null;
      db.sequelize.query(queryStr).then(([results, metadata]) => {
        console.log('RESULTS');
        console.log(results, metadata);
        return results;
      });
    },
  });
}


