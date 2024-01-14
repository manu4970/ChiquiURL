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
  const allUrls = (await client.query('Select * from urls ORDER BY id')).rows
  return res.render('index', { allUrls: allUrls })
})

app.get('/urls', async (req, res) => {
  client.query('Select * from urls', (err, result) => {
    if (!err) {
      return res.send(result.rows)
    } else {
      return console.log(err)
    }
  })
  // eslint-disable-next-line no-unused-expressions
  client.end
  return
})

app.post('/urls', async (req, res) => {
  const url = req.body.longUrl
  const shortUrl = shortId.generate()
  // console.log(url)
  const insertQuery = `insert into urls (long_url, short_url) values('${url}', '${shortUrl}')`

  client.query(insertQuery, (err, result)=>{
    if(!err){
        console.log('Insertion was successful')
        return res.redirect('/')
    }
    else{ console.log(err.message) }
  })
  client.end;
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = req.params.shortUrl
  const query = `select * from urls where short_url='${shortUrl}'`
  client.query(query, (err, result) => {
    if (!err) {
      if (result.rows.length > 0) {
        return res.redirect(result.rows[0].long_url)
      } else {
        return res.status(404).send('Not Found')
      }
    } else {
      return console.log(err)
    }
  })
  client.end
  return
})


app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})


