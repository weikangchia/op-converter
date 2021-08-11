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
    name: flags.string({ char: 'n', description: 'name for your postman collection' }),
    openApiFile: flags.string({ char: 'f', description: 'path to your OpenAPI 3.0 JSON file' }),
    baseUrl: flags.string({ description: 'base url' }),
    config: flags.string({ description: 'custom config file name (default is config.json)' }),
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

    const folders: { [key: string]: Folder } = {};

    Object.keys(openApi.paths).forEach((requestPath: string) => {
      const openApiRequest = openApi.paths[requestPath];

      const requestMethod = this.extractMethodFrom(openApiRequest);

      const requestPathInArray = this.breakdownRequestPathToArrayFrom(requestPath, config.path);
      const transformedPathInArray = this.transformVariableInPathArray(requestPathInArray);

      let queryParameters = [];

      if ('parameters' in openApiRequest[requestMethod]) {
        queryParameters = this.extractQueryFrom(openApiRequest[requestMethod].parameters);
      }

      let requestBody = {};
      if ('requestBody' in openApiRequest[requestMethod]) {
        const refArray =
          openApiRequest[requestMethod].requestBody.content['application/json']?.schema['$ref']?.split('/');

        if (refArray && refArray.length > 0) {
          requestBody = this.extractRequestBody(openApi.components.schemas[refArray[refArray.length - 1]]);
        }
      }

      const tag = openApiRequest[requestMethod].tags[0];
      if (!(tag in folders)) {
        const tagObject = openApi.tags?.find((currentTag: any) => currentTag.name === tag);

        folders[tag] = {
          name: tag,
          description: tagObject ? tagObject.description : '',
          item: [],
        };
      }

      folders[tag].item?.push({
        name: openApi.paths[requestPath][requestMethod].operationId,
        request: {
          method: requestMethod.toUpperCase(),
          header: [],
          url: {
            host: [flags.baseUrl],
            path: transformedPathInArray,
            query: queryParameters,
          },
          body: requestBody,
          description: openApi.paths[requestPath][requestMethod].description,
        },
      });
    });

    Object.values(folders).forEach((folder: any) => postmanTemplate.item?.push(folder));

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
          value: '',
          description: parameter.description,
        };
      });
  }
}

export = OpConverter;
