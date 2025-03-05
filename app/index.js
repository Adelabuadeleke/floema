import each from 'lodash/each'
import NormalizeWheel from 'normalize-wheel'

import Canvas from 'components/Canvas'
import Navigation from 'components/Navigation'
import Preloader from 'components/Preloader'

import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
import Home from 'pages/Home'

class App {
  constructor () {
    this.createContent()

    this.createNavigation()
    // this.createCanvas()
    this.createPreloader()
    this.createPages()

    this.addEventListeners()
    this.addLinkListeners()
    this.update()
  }

  createNavigation () {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPreloader () {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createCanvas () {
    this.canvas = new Canvas({
      template: this.template
    })
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')

    console.log(this.template)
  }

  createPages () {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      detail: new Detail(),
      home: new Home()
    }

    this.page = this.pages[this.template]
    this.page.create()

    // this.page.show()

    this.navigation.onChange(this.template)
  }

  onPreloaded () {
    // this.preloader.hide()
    this.preloader.destroy()

    this.onResize()

    this.page.show()
  }

  async onChange (url) {
    this.canvas.onChangeStart(this.template)
    // console.log(url)
    await this.page.hide()

    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')

      div.innerHTML = html

      const divContents = div.querySelector('.content')

      this.template = divContents.getAttribute('data-template')
      this.navigation.onChange(this.template)

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContents.innerHTML

      this.canvas.onChangeEnd(this.template)

      this.page = this.pages(this.template)
      this.page.create()

      this.onResize()

      this.page.show()
      // console.log(text)

      this.addLinkListeners()
    } else {
      console.log('Error')
    }
  }

  onResize () {
    if (this.canvas && this.onResize) {
      this.canvas.onResize()
    }

    window.requestAnimationFrame((_) => {
      if (this.page && this.page.update) {
        this.page.onResize()
      }
    })
  }

  onTouchDown (event) {
    if (this.canvas && this.onResize) {
      this.canvas.onTouchDown(event)
    }
  }

  onTouchMove (event) {
    if (this.canvas && this.onResize) {
      this.canvas.onTouchMove()
    }
  }

  onTouchUp (event) {
    if (this.canvas && this.onResize) {
      this.canvas.onTouchUp()
    }
  }

  onWheel (event) {
    const normalizeWheel = NormalizeWheel(event)

    if (this.canvas && this.onResize) {
      this.canvas.onWheel(normalizeWheel)
    }

    if (this.page && this.page.update) {
      this.page.onWheel(normalizeWheel)
    }
  }

  udpate () {
    if (this.canvas && this.onResize) {
      this.canvas.update()
    }

    if (this.page && this.page.update) {
      this.page.update()
    }

    this.frame = window.requestAnimationFrame(this.udpate.bind(this))
  }

  addEventListeners () {
    window.addEventListener('mousewheel', this.onWheel.bind(this))
    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, (link) => {
      link.onclick = (event) => {
        event.preventDefault()
        const { href } = link

        this.onChange()
        console.log(event, href)
      }
    })
  }
}

// eslint-disable-next-line no-new
new App()
