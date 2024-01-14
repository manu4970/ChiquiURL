const client = require('./db.js')
const bodyParser = require('body-parser')
require('dotenv').config()
const express = require('express')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.json())
const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/urls', (req, res) => {
  client.query('Select * from urls', (err, result) => {
    if (!err) {
      res.send(result.rows)
    } else {
      console.log(err)
    }
  })
  // eslint-disable-next-line no-unused-expressions
  client.end
})

app.post('/urls', (req, res) => {
  const url = req.body
  const insertQuery = `insert into urls (long_url, short_url) 
                       values('${url.long_url}', '${url.short_url}')`

  client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send('Insertion was successful')
    } else { console.log(err.message) }
  })
  // eslint-disable-next-line no-unused-expressions
  client.end
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('DB Connected 👍')
  }
})
