# sq-pubsub
> GCloud PubSub wrapper.

<!-- TOC -->

- [sq-pubsub](#sq-pubsub)
  - [Instalando](#instalando)
  - [Uso](#uso)
    - [Importação](#importação)
    - [Funções](#funções)
      - [Ouvir uma subscription](#ouvir-uma-subscription)
      - [Deixar de ouvir uma subscription](#deixar-de-ouvir-uma-subscription)
        - [Marcar ou não uma mensagem como recebida](#marcar-ou-não-uma-mensagem-como-recebida)
          - [AutoAck](#autoack)
      - [Publicar uma mensagem](#publicar-uma-mensagem)

<!-- /TOC -->

## Instalando
```sh
$ npm install github:squidit/sq-pubsub --save
```

## Uso

### Importação

```js
const SqPubsub = require('sq-pubsub')
const PubSub = new SqPubsub('nome-do-projeto', 'caminho/para/arquivo/credentials.json')
```

### Funções

#### Ouvir uma subscription

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
* `message.data`: Conteúdo da mensagem. Isto é um Buffer, então é necessário que o usuário utilize `message.data.toString()` para modificar o valor.
* `message.attributes`: Atributos da mensagem
* `message.timestamp`: Timestamp de quando o __PubSub__ recebeu a mensagem

Esta função retorna a instancia da subscription.

#### Deixar de ouvir uma subscription

A função `unlisten` remove todos os subscribers do pubsub.

```js
const subscription = PubSub.listenMessages(SUBSCRIPTION, (message, err) => {
  if (!err) {
    console.log(message.data)
  } else if (err) {
    console.error(err)
  }
})

// Remove os listeners
PubSub.unlisten(subscription)
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

###### AutoAck

Da mesma forma é possível utilizar a flag `autoAck` para automaticamente receber __todas__ as mensagens da subscription automaticamente:

```js
PubSub.listenMessages(SUBSCRIPTION, cb(message, err), true) // Parâmetro autoAck como true (padrão é false)
```

#### Publicar uma mensagem

Nesta parte é necessário usar o _tópico_ do pubsub ao invés da subscription.

```js
PubSub.publishMessage(TOPIC, { mensagem: 'teste' })
  .then((newMessage) => console.log(newMessage))
  .catch(() => console.error('erro'))
```
