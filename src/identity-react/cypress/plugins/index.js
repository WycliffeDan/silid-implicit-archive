const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor')

module.exports = on => {
  on('file:preprocessor', cypressTypeScriptPreprocessor)


  /**
   * 2019-11-25 https://stackoverflow.com/questions/52070262/cypress-pipe-console-log-and-command-log-to-output
   *
   * Log to stdout in headless tests
   */
  on('task', {
    log (message) {
      console.log(message);
      return null;
    }
  });
}


