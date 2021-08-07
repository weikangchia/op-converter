# OpenAPI 3.0 to Postman 2.1 Collections Converter

**op-converter** is a customizable converter for OpenAPI 3.0 to Postman 2.1 Collections.

## Getting Started

### Pre-requisites

- Install [node](https://nodejs.org/en/download/)
- Install op-converter
  ```
  npm install -g op-converter
  ```

### Usage
```sh-session
USAGE:
    op-converter

OPTIONS:
    - f, --openApiFile=openApiFile    path to OpenAPI file
    - h, --help                       show CLI help
    - n, --name=name                  collection name
    --config=config                   custom config file name (default is config.json)
    --hostVariable=hostVariable.      host variable e.g. {{ALLOTMENT_URL}}
```

**Examples**
```
op-converter -f ./openapi.json -n "My Collection" --hostVariable="{{ALLOTMENT_URL}}" > postman.json
```

## Configuration Options

By default **op-converter** reads all configurable options from `config.json` at the following location

```
Unix: ~/.config/op-converter
Windows: %LOCALAPPDATA%\gitcg
```

Below are the available configurable options.

- [path](#path)
  - [enableReplacePrefix](#enableReplacePrefix)
  - [replacePrefix](#replacePrefix)
  - [replacePrefixWith](#replacePrefixWith)
- [auth](#auth)
- [events](#events)

### path

| Name        | Value           |
| ------------- |-------------|
| type      | object |
| mandatory | false |

Example
```json
{
  "path": {}
}
```

#### enableReplacePrefix


| Name        | Value           |
| ------------- |-------------|
| type      | boolean |
| parent    | path |
| mandatory | false |
| mandatory siblings | replacePrefix, replacePrefixWith |

Example
```json
{
  "path": {
    "enableReplacePrefix": true,
    "replacePrefix": "/v1",
    "replacePrefixWith": ""
  }
}
```

#### replacePrefix


| Name        | Value           |
| ------------- |-------------|
| type      | string |
| parent    | path |
| mandatory | false |
| mandatory siblings | enableReplacePrefix, replacePrefixWith |

Example
```json
{
  "path": {
    "enableReplacePrefix": true,
    "replacePrefix": "/v1",
    "replacePrefixWith": ""
  }
}
```

#### replacePrefixWith


| Name        | Value           |
| ------------- |-------------|
| type      | string |
| parent    | path |
| mandatory | false |
| mandatory siblings | enableReplacePrefix, replacePrefix |

Example
```json
{
  "path": {
    "enableReplacePrefix": true,
    "replacePrefix": "/v1",
    "replacePrefixWith": ""
  }
}
```

### auth

Postman Auth field

| Name        | Value           |
| ------------- |-------------|
| type      | object |
| mandatory | false |

Example
```json
{
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{CURRENT_ACCESS_TOKEN}}",
        "type": "string"
      }
    ]
  }
}
```

### events

Postman event field

| Name        | Value           |
| ------------- |-------------|
| type      | array |
| mandatory | false |

Example
```json
{
  "events": [
    {
      "listen": "test",
      "script": {
        "exec": [
          ""
        ],
        "type": "text/javascript"
      }
    }
  ]
}
```

## License

Distributed under the MIT License. See [LICENSE](license.md) for more information.

## Contributing
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

## Contact

Wei Kang - weikangchia@gmail.com
