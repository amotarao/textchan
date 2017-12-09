const Botmock = require('botkit-mock')
const assert = require('assert')
const myController = require('../src/controller')

describe('controller test', function () {

  beforeEach(function () {
    this.controller = Botmock({})
    this.bot = this.controller.spawn({type: 'slack'})
    myController(this.controller)
  })

  it('test', function () {
    return this.bot.usersInput(
      [
        {
          user: 'someUserId',
          channel: 'someChannel',
          messages: [
            {
              text: 'test',
              isAssertion: true
            }
          ]
        }
      ]
    ).then(function (message) {
      return assert.equal(message.text, 'test!!')
    })
  })

  it('create', function () {
    return this.bot.usersInput(
      [
        {
          user: 'someUserId',
          channel: 'someChannel',
          messages: [
            {
              text: 'create 絵文字',
              isAssertion: true
            }
          ]
        }
      ]
    ).then(function (messageObj) {
      var message = {
        filename: messageObj.filename,
        title: messageObj.title
      }
      return assert.equal(message, {
        filename: '絵文字.png',
        title: '絵文字'
      })
    })
  })

  it('create with color, font', function () {
    return this.bot.usersInput(
      [
        {
          user: 'someUserId',
          channel: 'someChannel',
          messages: [
            {
              text: 'create 色明朝。 red "YuMincho"',
              isAssertion: true
            }
          ]
        }
      ]
    ).then(function (messageObj) {
      var message = {
        filename: messageObj.filename,
        title: messageObj.title
      }

      return assert.equal(message, {
        filename: '色明朝。.png',
        title: '色明朝。'
      })
    })
  })
})
