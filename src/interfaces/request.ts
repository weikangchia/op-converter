interface Request {
  name: string;
  request: {
    method: string;
    header: Array<string>;
    url: {
      host: Array<string>;
      path: Array<string>;
      query: Array<any>;
      variable: Array<any>;
    };
  };
}

export = Request;
