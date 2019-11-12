const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { WebClient } = require('@slack/web-api');

const port = Number(process.argv[2])
if (!Number.isInteger(port) || port < 1 || port > Math.pow(2,16)) {
  console.error('First argument must be a valid port')
  process.exit(1)
}

const web = new WebClient();

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/add-to-slack', async (req, res) => {
  console.log('add-to-slack called')
  res.render('oauth', { code: req.query.code })
})

app.post('/getTokens', async (req, res) => {
  console.log('getTokens called')
  const params = {
    client_id: req.body.clientId,
    client_secret: req.body.clientSecret,
    code: req.body.code
  }
  const access = await web.oauth.access(params).catch(err => console.error(err))
  res.render('tokens', { access })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
