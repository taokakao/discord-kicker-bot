class Logger {
  constructor(prefix) {
    this.prefix = prefix;
  }

  log(message) {
    console.log(`[${(new Date()).toUTCString()}] [${this.prefix}] ${message}`);
  }
}

module.exports = Logger;
