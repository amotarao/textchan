if (!process.env.token) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

require('./src/bot')
