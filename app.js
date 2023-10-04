require('dotenv').config()


const express  = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom')

const initApi = (req)=>{
 return Prismic.getApi(process.env.PRISMIC_ENDPOINT,{
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  req
 })
}

const handleLinkResolver = (doc) =>{
 // if(doc.tpye === 'page'){
 //  return '/page/' + doc.uid;

 // } else if(doc.tpye === 'blog_post'){
 //  return '/blog/' + doc.uid
 // }

 return '/'
}

app.use((req, res, next)=>{
 res.locals.ctx = {
  endPoint: process.env.PRISMIC_ENDPOINT,
  linkResolver: handleLinkResolver
 }

 res.locals.PrismicDOM = PrismicDOM;
 next()
})


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