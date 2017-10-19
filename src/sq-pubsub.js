const PubSub = require('@google-cloud/pubsub')

/**
 * Main pubsub class
 *
 * @public
 * @param {String} GceProjectName Project name on GCE
 * @param {String} GceKeyFileName Project JSON credentials file path
 * @class
 */
class SQPubSub {
  /**
   * Creates a new instance of pubsub
   *
   * @param {String} GceProjectName Project name on GCE
   * @param {String} GceKeyFileName Project JSON credentials file path
   * @constructor
   * @see {@link https://github.com/squidit/sq-pubsub#using|Documentation}
   */
  constructor (GceProjectName, GceKeyFileName) {
    this._pubsub = PubSub({
      projectId: GceProjectName,
      keyFileName: GceKeyFileName
    })
  }

  /**
   * Listen to messages on a particular subscription
   *
   * @param {String} subscriptionName Name of the subscription
   * @param {Function} cb Callback function with the signature: `cb(message, err)`
   * @param {bool} autoAck Should the message be acknowledged upon receival? Defaults to false
   * @see {@link https://github.com/squidit/sq-pubsub#listening-to-a-subscription|Documentation}
   * @see {@link https://github.com/squidit/sq-pubsub#autoack|AutoAck Documentation}
   * @public
   */
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

  /**
   * Publishes a new message to a topic
   * @param {String} topicName Topic name on Pubsub
   * @param {any} data Data to be sent
   * @see {@link https://github.com/squidit/sq-pubsub#publish-a-message|Documentation}
   * @public
   */
  publishMessage (topicName, data) {
    const publisher = this._pubsub.topic(topicName).publisher()
    return publisher.publish(Buffer.from(JSON.stringify(data)))
  }

  /**
   * Removes all listeners from a subscription
   * @param {Object} subscription Subscription object returned by ListenMessages
   * @public
   * @see {@link https://github.com/squidit/sq-pubsub#unlistening-a-subscription|Documentation}
   */
  unlisten (subscription) {
    subscription.removeListener('message', subscription._events.message)
    subscription.removeListener('error', subscription._events.error)
    return this
  }

  /**
   * Acknowledges a message as received
   * @param {Object} message Message object returned by the callback
   * @public
   * @see {@link https://github.com/squidit/sq-pubsub#ack-or-nack-a-message|Documentation}
   */
  ack (message) {
    console.log(`Message #${message.id} acknowledged with AckID ${message.ackId}`)
    return message.ack()
  }

  /**
   * Not acknowledges a message as received
   * @param {Object} message Message object returned by the callback
   * @public
   * @see {@link https://github.com/squidit/sq-pubsub#ack-or-nack-a-message|Documentation}
   */
  nack (message) {
    console.log(`Message #${message.id} has been marked as not acknowledged by the user`)
    return message.nack()
  }
}

module.exports = SQPubSub
