# op-converter

A converter to convert OpenApi 3.0 doc to Postman collection.

## Getting Started

### Usage
```sh-session
$ npm install -g op-converter
$ op-converter COMMAND
running command...
$ op-converter --help [COMMAND]
USAGE
  $ op-converter COMMAND
```

## Configuration Options

By default **op-converter** reads all configurable options from `config.json` at the following location

```
Unix: ~/.config/gitcg
Windows: %LOCALAPPDATA%\gitcg
Can be overridden with XDG_CONFIG_HOME
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
