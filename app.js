require('dotenv').config()


const express  = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom')




app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.get('/', (req, res)=>{
 res.render('pages/home')
})

app.get('/about', (req, res)=>{
 res.render('pages/about')
})

app.get('/detail/:id', (req, res)=>{
 res.render('pages/detail')
})

app.get('/collections', (req, res)=>{
 res.render('pages/collections')
})

app.listen(port, ()=>{
 console.log(`listening on port ${port}`)
})