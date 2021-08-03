import Folder = require('./folder');
import Info = require('./info');
import Event = require('./event');

interface Postman {
  info: Info;
  auth?: any;
  event?: Array<Event>;
  item?: Array<Folder>;
}

export = Postman;
