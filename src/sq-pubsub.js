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
   * @param {bool} verbose Enables or disables verbose logging (defaults to false)
   * @constructor
   * @see https://github.com/squidit/sq-pubsub#using
   */
  constructor (GceProjectName, GceKeyFileName, verbose = false) {
    this._pubsub = PubSub({
      projectId: GceProjectName,
      keyFileName: GceKeyFileName
    })
    this._verbose = verbose
  }

  /**
   * Internal log structure
   * @param {String} message Message to be logged
   * @private
   */
  _logger (message) {
    if (this._verbose) return console.log(message)
    return
  }

  /**
   * Listen to messages on a particular subscription
   *
   * @param {String} subscriptionName Name of the subscription
   * @param {Function} cb Callback function with the signature: `cb(message, err)`
   * @param {bool} autoAck Should the message be acknowledged upon receival? Defaults to false
   * @see https://github.com/squidit/sq-pubsub#listening-to-a-subscription
   * @see https://github.com/squidit/sq-pubsub#autoack|AutoAck
   * @public
   */
  listenMessages (subscriptionName, cb, autoAck = false) {
    this._logger(`Listening ${subscriptionName}...`)
    let subscription = this._pubsub.subscription(subscriptionName)

    const handleMessage = (message) => {
      if (autoAck) this.ack(message) // If ack message is true then autoAck
      cb(message, null)
    }

    const handleError = (err) => {
      cb(null, err)}

    subscription.on('message', handleMessage)
    subscription.on('error', handleError)

    return subscription
  }

  /**
   * Publishes a new message to a topic
   * @param {String} topicName Topic name on Pubsub
   * @param {any} data Data to be sent
   * @see https://github.com/squidit/sq-pubsub#publish-a-message
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
   * @see https://github.com/squidit/sq-pubsub#unlistening-a-subscription
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
   * @see https://github.com/squidit/sq-pubsub#ack-or-nack-a-message
   */
  ack (message) {
    this._logger(`Message #${message.id} acknowledged with AckID ${message.ackId}`)
    return message.ack()
  }

  /**
   * Not acknowledges a message as received
   * @param {Object} message Message object returned by the callback
   * @public
   * @see https://github.com/squidit/sq-pubsub#ack-or-nack-a-message
   */
  nack (message) {
    this._logger(`Message #${message.id} has been marked as not acknowledged by the user`)
    return message.nack()
  }
}

module.exports = SQPubSub
