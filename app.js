require('dotenv').config()

const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const path = require('path')
const port = 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())
app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
// const PrismicDOM = require('prismic-dom')
const PrismicH = require('@prismicio/helpers')
const fetch = require('node-fetch')
// const { error } = require('console')
// const e = require('express')

const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
  })
}

const HandleLinkResolver = (doc) => {
  console.log(doc.type)
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'collections') {
    return '/collections'
  }

  if (doc.type === 'about') {
    return '/about'
  }

  // Default to homepage
  return '/'
}

app.use((req, res, next) => {
  res.locals.ctx = {
    endPoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: HandleLinkResolver
  }

  res.locals.Link = HandleLinkResolver
  res.locals.PrismicH = PrismicH
  res.locals.Numbers = (index) => {
    return index === 0
      ? 'One'
      : index === 1
        ? 'Two'
        : index === 2
          ? 'Three'
          : index === 3
            ? 'Four'
            : ''
  }
  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.locals.basedir = app.get('views')

const handleRequest = async (api) => {
  const [home, about, preloader, navigation, meta] = await Promise.all([
  // api.getSingle('meta'),
    api.getSingle('h'),
    api.getSingle('about'),
    api.getSingle('preloader'),
    api.getSingle('navigation'),
    api.getSingle('meta')

  ])
  //  const home = await api.getSingle('h')
  // //  const metadata = await api.getSingle('meta')
  //  const about = await api.getSingle('about')
  const collections = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks: 'product.image'
  })
  const assets = []

  // home.data.gallery.forEach((item)=>[
  //  console.log(item)
  //  // assets.push(item.img.url)
  // ])

  //   collections.forEach((collection) => {
  //   collection.data.list.forEach((item) => {
  //     assets.push(item.product.data.image.url);
  //   });
  // });

  about.data.gallery.forEach((item) => [
    assets.push(item.image.url)
  ])

  about.data.body.forEach((section) => {
    if (section.slice_type === 'gallery') {
      section.items.forEach((item) => {
        // console.log(item.image.url)
        assets.push(item.image.url)
      })
    }
  })

  return {
    assets,
    preloader,
    meta,
    home,
    collections,
    about,
    navigation
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  // console.log(defaults.metadata)
  res.render('pages/home', {
    ...defaults
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  // console.log(defaults.about.data.body?.description)
  res.render('pages/about', {
    ...defaults
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('h')
  // console.log('')
  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })
  // console.log(product.data.highlights)
  res.render('pages/detail', {
    ...defaults,
    product,
    home
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  //  console.log(defaults.collections.results[0].data.products)
  res.render('pages/collections', {
    ...defaults
  })
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
