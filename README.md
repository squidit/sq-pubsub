# sq-pubsub
> GCloud PubSub wrapper.

<!-- TOC -->

- [sq-pubsub](#sq-pubsub)
  - [Instalando](#instalando)
  - [Uso](#uso)
    - [Importação](#importação)
    - [Funções](#funções)
      - [Ouvir um tópico](#ouvir-um-tópico)
      - [Publicar uma mensagem](#publicar-uma-mensagem)

<!-- /TOC -->

## Instalando
```sh
$ npm install github:squidit/sq-pubsub --save
```

## Uso

### Importação

```js
const sq_pubsub = require('sq-pubsub')
const PubSub = new sq_pubsub('nome-do-projeto', 'caminho/para/arquivo/credentials.json')
```

### Funções

#### Ouvir um tópico

```js
PubSub.listenMessages(SUBSCRIPTION, (message, err) => {
  if (!err) {
    console.log(message)
  } else if (err) {
    console.error(err)
  }
})
```

Esta função retorna uma outra função chamada unlisten que tem uma assinatura como a seguinte:

```js
unlisten (subscription, handleMessage, handleError) {
  subscription.removeListener('message', handleMessage)
  subscription.removeListener('error', handleError)
}
```

Se esta função for executada todos os listeners de todas as filas irão ser removidos.

#### Publicar uma mensagem

```js
PubSub.publishMessage(TOPIC, { mensagem: 'teste' })
  .then((newMessage) => console.log(newMessage))
  .catch(() => console.error('erro'))
```