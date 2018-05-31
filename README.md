# smallGroup

Koa2 based web service scaffolding

## Installation

```sh
$ docker build -t smallgroup:local .
$ docker run -d -p 8080:8080 --name smallgroup smallgroup:local
```

For HTTPS and HTTP2 support you can generate a certificate and key using :
```sh
$ mkdir certs

# SAN list MUST start with a ',' (comma without the quotes).
$ SAN=,DNS:www.example.com \
      openssl req -newkey rsa:2048 -x509 -nodes -keyout certs/localhost-privkey.pem \
      -new -out certs/localhost-cert.pem \
      -subj /CN=localhost -reqexts SAN -extensions SAN \
      -config <(cat /System/Library/OpenSSL/openssl.cnf \
          <(printf "[SAN]\nsubjectAltName=DNS:localhost${SAN}")) \
      -sha256

$ docker run -d -p 8080:8080 -v ${PWD}/certs:certs --name abricot abricot:local
```

## Usage

```sh
$ curl localhost:8080/ping
pong

$ cat version.json 
{"empty": "object"}
$ curl localhost:8080/version
{"empty":"object"}

$ curl localhost:8080/health     
{"status":"up","server":{"name":"smallGroup","version":"1.0.0","hostname":"c05925e6d6a4"}}

```

### Configuration
[Node-config](https://github.com/lorenwest/node-config) is the configuration manager used
by *smallGroup*. `config/default.json` contains the base configuration of the application, these 
value can be overwritten by the ones from the `config/NODE_ENV.json` where `NODE_ENV` is an
environment variable describing the environement the node is in. The upper most level of 
configuration are environment variables defined in the `config/custom_enviromnent_variable.json`


```json
{
  "server": {
    "port": 8080,
    "cluster": 0
  },
  "log": {
    "level": "info"
  }
}

```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write license
