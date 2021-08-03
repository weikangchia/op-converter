import { Command, flags } from '@oclif/command';
import { promises as fs } from 'fs';
import Folder = require('./interfaces/folder');
import Postman = require('./interfaces/postman');

import { read } from './configReader';

import path = require('path');

class OpConverter extends Command {
  static description = 'OpenApi 3.0 to Postman converter';
  static postmanSchema = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';

  static flags = {
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: 'collection name' }),
    openApiFile: flags.string({ char: 'f', description: 'path to OpenApi file' }),
    hostVariable: flags.string({ description: 'host variable e.g. {{ALLOTMENT_URL}}' }),
    config: flags.string({ description: 'path to config' }),
  };

  async run() {
    const { flags } = this.parse(OpConverter);

    const config = read(path.join(this.config.configDir, flags.config || 'config.json'));

    const postmanTemplate: Postman = {
      info: {
        name: '',
        schema: OpConverter.postmanSchema,
      },
      item: [],
    };

    postmanTemplate.info.name = String(flags.name);
    postmanTemplate.event = config.events;
    postmanTemplate.auth = config.auth;

    const openApiRaw = await fs.readFile(String(flags.openApiFile));
    const openApi = JSON.parse(openApiRaw.toString());

    const folder: Folder = {
      name: '',
      item: [],
    };

    folder.name = openApi.info.title;

    const requests: any = [];

    Object.keys(openApi.paths).forEach((requestPath: string) => {
      const openApiRequest = openApi.paths[requestPath];

      const requestMethod = this.extractMethodFrom(openApiRequest);

      let modifiedRequestPath = requestPath;

      const requestPathInArray = this.breakdownRequestPathToArrayFrom(requestPath, config.path);
      const transformedPathInArray = this.transformVariableInPathArray(requestPathInArray);
      const queryParameters = this.extractQueryFrom(openApiRequest[requestMethod].parameters);

      let requestBody = {};
      if ('requestBody' in openApiRequest[requestMethod]) {
        const refArray = openApiRequest[requestMethod].requestBody.content['application/json'].schema['$ref'].split(
          '/',
        );
        requestBody = this.extractRequestBody(openApi.components.schemas[refArray[refArray.length - 1]]);
      }

      requests.push({
        name: openApi.paths[requestPath][requestMethod].operationId,
        request: {
          method: requestMethod.toUpperCase(),
          header: [],
          url: {
            host: [flags.hostVariable],
            path: transformedPathInArray,
            query: queryParameters,
          },
          body: requestBody,
          description: openApi.paths[requestPath][requestMethod].description,
        },
      });
    });

    folder.item = requests;

    postmanTemplate.item?.push(folder);

    console.log(JSON.stringify(postmanTemplate));
  }

  extractMethodFrom(request: any): string {
    return Object.keys(request)[0];
  }

  breakdownRequestPathToArrayFrom(requestPath: string, pathConfig: any): Array<string> {
    if (requestPath == null || requestPath.length == 0) {
      return [];
    }

    if (pathConfig.enableReplacePrefix) {
      const replacePrefix = pathConfig.replacePrefix;
      const replacePrefixWith = pathConfig.replacePrefixWith;

      if (requestPath.startsWith(replacePrefix)) {
        requestPath = requestPath.replace(replacePrefix, replacePrefixWith);
      }
    }

    if (requestPath.startsWith('/')) {
      requestPath = requestPath.substr(1);
    }

    if (requestPath.endsWith('/')) {
      requestPath = requestPath.substr(0, requestPath.length - 1);
    }

    return requestPath.split('/');
  }

  extractRequestBody(schema: any): any {
    const requestBodyRaw: any = {};

    Object.keys(schema.properties).forEach((property: string) => (requestBodyRaw[property] = null));

    return {
      mode: 'raw',
      raw: JSON.stringify(requestBodyRaw, null, 2),
      options: {
        raw: {
          language: 'json',
        },
      },
    };
  }

  transformVariableInPathArray(requestPathArray: Array<string>): Array<string> {
    return requestPathArray.map((requestPath: string) => {
      if (requestPath.length > 1 && requestPath.startsWith('{') && requestPath.endsWith('}')) {
        requestPath = `:${requestPath.substring(1, requestPath.length - 1)}`;
      }

      return requestPath;
    });
  }

  extractQueryFrom(parameters: any): any {
    return parameters
      .filter((parameter: any) => 'in' in parameter && parameter.in === 'query')
      .map((parameter: any) => {
        return {
          key: parameter.name,
          value: parameter.required ? String(parameter.example) : '',
          description: parameter.description,
        };
      });
  }
}

export = OpConverter;
