# sq-pubsub
> GCloud PubSub wrapper.

<!-- TOC -->

- [sq-pubsub](#sq-pubsub)
  - [Instalando](#instalando)
  - [Uso](#uso)
    - [Importação](#importação)
    - [Funções](#funções)
      - [Ouvir um tópico](#ouvir-um-tópico)
        - [Marcar ou não uma mensagem como recebida](#marcar-ou-não-uma-mensagem-como-recebida)
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
    console.log(message.data)
  } else if (err) {
    console.error(err)
  }
})
```

O objeto `message` tem as seguintes propriedades:

* `message.id`: ID da mensagem.
* `message.ackId`: ID usado para receber a mensagem com sucesso
* `message.data`: Conteúdo da mensagem.
* `message.attributes`: Atributos da mensagem
* `message.timestamp`: Timestamp de quando o __PubSub__ recebeu a mensagem

Esta função retorna uma outra função chamada unlisten que tem uma assinatura como a seguinte:

```js
unlisten (subscription, handleMessage, handleError) {
  subscription.removeListener('message', handleMessage)
  subscription.removeListener('error', handleError)
}
```

Se esta função for executada todos os listeners de todas as filas irão ser removidos.

##### Marcar ou não uma mensagem como recebida

É __importante__ marcar uma mensagem como recebida por dois motivos:

- Uma vez que a mensagem é marcada como recebida ela é removida da fila do tópico
- Um listener que recebeu uma mensagem e ainda não a marcou como recebida __não__ pode receber novas mensagens até que a última mensagem seja marcada como recebida com sucesso

Quando uma mensagem deve ser recebida com sucesso, execute a função `ack`. Da mesma forma quando uma mensagem deve receber o sinal de que ela não foi recebida com sucesso (chamado de `nack`) a função `nack` pode ser usada.

```js
PubSub.listenMessages(SUBSCRIPTION, (message, err) => {
  if (!err) {
    console.log(message.data)
    PubSub.ack(message)
  } else if (err) {
    console.error(err)
    PubSub.nack(message)
  }
})
```

#### Publicar uma mensagem

```js
PubSub.publishMessage(TOPIC, { mensagem: 'teste' })
  .then((newMessage) => console.log(newMessage))
  .catch(() => console.error('erro'))
```
