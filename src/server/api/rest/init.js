// RestApi setup
const express = require('express')
const app = express()
const restPort = 3000

function init(sessionsStore){
    app.get('/session', (req, res) => {
        res.send('Hello World!')
      })
      
      app.listen(restPort, () => {
        console.log(`Example app listening at http://localhost:${restPort}`)
      })
}

module.exports.init = init;