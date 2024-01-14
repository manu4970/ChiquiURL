const client = require('./db.js')
const bodyParser = require('body-parser')
require('dotenv').config()
const express = require('express')
const shortId = require('shortid')

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack)
  } else {
    console.log('DB Connected 👍')
  }
})

app.get('/', async (req, res) => {
  res.render('index')
  console.log()
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

app.post('/urls', async (req, res) => {
  const url = req.body.longUrl
  const shortUrl = shortId.generate()
  // console.log(url)
  const insertQuery = `insert into urls (long_url, short_url) 
                       values('${url}', '${shortUrl}')`

  await client.query(insertQuery, (err, result) => {
    if (!err) {
      res.send('Insertion was successful')
    } else { console.log(err.message) }
  })
  // eslint-disable-next-line no-unused-expressions
  client.end
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})


