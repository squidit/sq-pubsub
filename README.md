# sq-pubsub
> GCloud PubSub wrapper.

<!-- TOC -->

- [sq-pubsub](#sq-pubsub)
  - [Installing](#installing)
  - [Using](#using)
    - [Listening to a subscription](#listening-to-a-subscription)
    - [Unlistening a subscription](#unlistening-a-subscription)
      - [Ack or Nack a message](#ack-or-nack-a-message)
        - [AutoAck](#autoack)
    - [Publish a message](#publish-a-message)

<!-- /TOC -->

## Installing
```sh
$ npm install github:squidit/sq-pubsub --save
```

## Using

```js
const SqPubsub = require('sq-pubsub')
const PubSub = new SqPubsub('project-name', 'path/to/file/credentials.json')
```

If you wish to enable or disable the verbose logging just pass a third parameter with a boolean value:

```js
const PubSub = new SqPubsub('project-name', 'path/to/file/credentials.json', true) // Enables verbose logging
const PubSub = new SqPubsub('project-name', 'path/to/file/credentials.json', false) // Disables verbose logging
```

This defaults to `false`

### Listening to a subscription

```js
PubSub.listenMessages(SUBSCRIPTION, (message, err) => {
  if (!err) {
    console.log(message.data)
  } else if (err) {
    console.error(err)
  }
})
```

The `message` object has the following properties:

* `message.id`: The ID of the message.
* `message.ackId`: ID used to acknowledge the message as received.
* `message.data`: Message contents, which is a buffer, so it's necessary to use `message.data.toString()` to parse the value.
* `message.attributes`: Message atributes.
* `message.timestamp`: Timestamp of when __PubSub__ received the message.

This returns an instance of `subscription`.

### Unlistening a subscription

The `unlisten` function removes all listeners from the subscription.

```js
const subscription = PubSub.listenMessages(SUBSCRIPTION, (message, err) => {
  if (!err) {
    console.log(message.data)
  } else if (err) {
    console.error(err)
  }
})

// Remove listeners
PubSub.unlisten(subscription)
```

#### Ack or Nack a message

It is rather __important__ to mark a message as acknowledged for two reasons:

- Once the message is marked as acknowledged, it is removed from the topic queue
- A listener which has received a message (and haven't yet marked it as _acknowledged_) __cannot__ receive new messages until the last message is acknowledged or the acknowledge timeout has ended.

To acknowledge a message, use the `ack` function. Same thing goes when a message does not need to be acknowledged (called `nack`), using the `nack` function.

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

##### AutoAck

It is also possible to use the `autoAck` flag to automatically acknowledge __all__ messages upon received:

```js
PubSub.listenMessages(SUBSCRIPTION, cb(message, err), true) // autoAck as true (defaults to false)
```

### Publish a message

We need to use the _topic_ instead of the _subscription_:

```js
PubSub.publishMessage(TOPIC, { message: 'test' })
  .then((response) => console.log(response))
  .catch((err) => console.error(err))
```
