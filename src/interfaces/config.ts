import Event = require('./event');

interface Config {
  path: {
    enableReplacePrefix?: boolean;
    replacePrefix?: string;
    replacePrefixWith?: string;
  };
  auth: any;
  events: Array<Event>;
}

export = Config;
