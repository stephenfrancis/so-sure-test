const express = require('express')
require('dotenv').config()

const app = express()
const port = process.env.NODE_PORT

app.get('/', (req, res) => res.send('Hello World - So-sure-itw !'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
