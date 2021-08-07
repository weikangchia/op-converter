# OpenAPI 3.0 to Postman 2.1 Collections Converter

op-converter is a customizable converter for OpenAPI 3.0 to Postman 2.1 Collections.

## Getting Started

### Usage
```sh-session
$ npm install -g op-converter
$ op-converter --help
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
MIT License
Copyright © 2021 Wei Kang weikangchia@gmail.com
