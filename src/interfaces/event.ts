interface Event {
  listen: string;
  script: {
    type: string;
    exec: Array<string>;
  };
}

export = Event;
