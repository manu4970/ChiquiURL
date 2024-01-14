const { Client } = require('pg')
require('dotenv').config()

const client = new Client({
  host: process.env.DBHOSTNAME,
  port: 5432,
  database: process.env.DBNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  ssl: {
    rejectUnauthorized: false
  }
})

// client.connect((err) => {
//   if (err) {
//     console.error('connection error', err.stack)
//   } else {
//     console.log('connected')
//   }
// })

// client.query('SELECT * FROM urls', (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     // console.log(res.rows)
//   }
//   client.end()
// })

module.exports = client
