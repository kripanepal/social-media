const express = require('express')
const app = express()
app.use(express.json())
app.use(require('cors')())
const port = process.env.PORT||5000
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const { mongouri } = require('./config/keys')
require('./modals/usermodal')
require('./modals/postmodal')

app.use(require('./routes/auth'))

app.use(require('./routes/posts'))

app.use(require('./routes/user'))
mongoose.connect(mongouri, { useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex:true }, (err) => {
    console.log('connected to the database')
    if (err) { console.log(err) }
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port, () => {
    console.log("server has started on port 5000")
})