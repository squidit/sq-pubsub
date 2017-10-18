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
      message.ack()
      cb(JSON.parse(message.data.toString()), null)
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

}

module.exports = SQPubSub
