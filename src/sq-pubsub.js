const PubSub = require('@google-cloud/pubsub')

class SQPubSub {
  constructor (GceProjectName, GceKeyFileName) {
    this._pubsub = PubSub({
      projectId: GceProjectName,
      keyFileName: GceKeyFileName
    })
  }

  listenMessages (subscriptionName, cb, autoAck = false) {
    console.log(`Listening ${subscriptionName}...`)
    let subscription = this._pubsub.subscription(subscriptionName)

    const handleMessage = (message) => {
      if (autoAck) this.ack(message) // Se a flag de acknowledge estiver ativa então já manda a notificação
      cb(message, null)
    }

    const handleError = (err) => { cb(null, err) }

    subscription.on('message', handleMessage)
    subscription.on('error', handleError)

    return subscription
  }

  publishMessage (topicName, data) {
    const publisher = this._pubsub.topic(topicName).publisher()
    return publisher.publish(Buffer.from(JSON.stringify(data)))
  }

  unlisten (subscription) {
    subscription.removeListener('message', subscription._events.message)
    subscription.removeListener('error', subscription._events.error)
    return this
  }

  ack (message) {
    console.log(`Message #${message.id} acknowledged with AckID ${message.ackId}`)
    return message.ack()
  }

  nack (message) {
    console.log(`Message #${message.id} has been marked as not acknowledged by the user`)
    return message.nack()
  }
}

module.exports = SQPubSub
