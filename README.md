# sq-pubsub
> GCloud PubSub wrapper.

## Instalando 
```sh
$ npm install github:squidit/sq-pubsub --save 
```

## Usando
`require('sq-pubsub');`

### Funções

```js
listenMessages(SUBSCRIPTION, (err, message) => {
  if (!err) {
    console.log(message)
  } else if (err) {
    console.error(err)
  }
})
```

```js
publishMessage(TOPIC, { mensagem: 'teste' })
  .then((newMessage) => console.log(newMessage))
  .catch(() => console.error('erro'))
```

## Configurações
Use o .env ou exporte para as variáveis de ambiente:

- GCLOUD_PROJECT

### Exemplo .env:
```sh
GCLOUD_PROJECT=squid-apis
```