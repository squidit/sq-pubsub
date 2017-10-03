const PubSub = require('@google-cloud/pubsub')
const { GCLOUD_PROJECT } = process.env

const pubsub = PubSub({
  projectId: GCLOUD_PROJECT
})

function listenMessages (subscriptionName, cb) {
  console.log(`Listening ${subscriptionName}...`)
  let subscription = pubsub.subscription(subscriptionName)

  const handleMessage = (message) => {
    message.ack()

    const aux = JSON.parse(message.data.toString())
    cb(null, aux)
  }

  const handleError = (err) => {
    cb(err)
  }

  subscription.on('message', handleMessage)
  subscription.on('error', handleError)

  return () => {
    subscription.removeListener('message', handleMessage)
    subscription.removeListener('error', handleError)
    subscription = undefined
  }
}

function publishMessage (topicName, data) {
  const publisher = pubsub.topic(topicName).publisher()
  return publisher.publish(Buffer.from(JSON.stringify(data)))
}

module.exports = {
  listenMessages,
  publishMessage
}
