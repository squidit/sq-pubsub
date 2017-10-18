const PubSub = require('@google-cloud/pubsub')

class SQPubSub {
  constructor (GceProjectName, GceKeyFileName) {
    this._pubsub = PubSub({
      projectId: GceProjectName,
      keyFileName: GceKeyFileName
    })
  }

  listenMessages (subscriptionName, cb) {
    console.log(`Listening ${subscriptionName}...`)
    let subscription = this._pubsub.subscription(subscriptionName)

    const handleMessage = (message) => {
      cb(message, null)
    }

    const handleError = (err) => { cb(null, err) }

    subscription.on('message', handleMessage)
    subscription.on('error', handleError)

    return this.unlisten(subscription, handleMessage, handleError)
  }

  publishMessage (topicName, data) {
    const publisher = this._pubsub.topic(topicName).publisher()
    return publisher.publish(Buffer.from(JSON.stringify(data)))
  }

  unlisten (subscription, handleMessage, handleError) {
    subscription.removeListener('message', handleMessage)
    subscription.removeListener('error', handleError)
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
