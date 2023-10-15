require('dotenv').config()


const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom')
const PrismicH = require('@prismicio/helpers')
const fetch = require('node-fetch')

const initApi = (req)=>{
 return Prismic.createClient(process.env.PRISMIC_ENDPOINT,{
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  req,
  fetch
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

 res.locals.PrismicH = PrismicH;
 next()
})


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.locals.basedir = app.get('views')

const handleRequest = async(api) =>{
 // const [metadata, home, about] = await Promise.all([
 //  api.getSingle('meta'),
 //  api.getSingle('h'),
 //  api.getSingle('about'),
 // ])
 const home = await api.getSingle('h')
 // const metadata = await api.getSingle('meta')
 const about = await api.getSingle('about')
  const assets = [];

  // home.data.gallery.forEach((item)=>[
  //  console.log(item)
  //  // assets.push(item.img.url)
  // ])

  about.data.gallery.forEach((item)=>[
   assets.push(item.image.url)
  ])

  about.data.body.forEach((section)=>{
   if(section.slice_type === 'gallery'){
    section.items.forEach((item)=>{
     // console.log(item.image.url)
     assets.push(item.image.url)
    })
   }
  })

 return{
  assets,
  // metadata,
  home,
  // collections,
  about
 }


}


app.get('/', async(req, res)=>{
 const api = await initApi(req)
 const defaults = await handleRequest(api)

 res.render('pages/home',{
  ...defaults
 })
})

app.get('/about', async(req, res)=>{
 const api = await initApi(req)
 const defaults = await handleRequest(api)
 // console.log(defaults.about.data.body?.description)
  res.render('pages/about', {
   ...defaults
  })
})

app.get('/detail/:id', async(req, res)=>{
 const api = await initApi(req)
 const defaults = await handleRequest(api)

 const product = await api.getByUID('product', req.params.uid,{
  fetchLinks:'collection.title'
 })

 res.render('pages/detail', {
  ...defaults,
  product
 })
})

app.get('/collections', async(req, res)=>{
 const api = await initApi(req)
 const defaults = await handleRequest(api)

 res.render('pages/collections',{
  ...defaults
 })
})

app.listen(port, ()=>{
 console.log(`listening on port ${port}`)
})