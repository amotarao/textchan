module.exports = (controller) => {
  controller.hears('test', ['direct_message', 'direct_mention', 'mention'], require('./task/test'))
  controller.hears('create(.*)', ['direct_message', 'direct_mention', 'mention'], require('./task/create'))
}
