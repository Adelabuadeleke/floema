import each from 'lodash/each'

import About from 'pages/About'
import Collections from 'pages/Collections'
import Detail from 'pages/Detail'
import Home from 'pages/Home'
import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'

class App {
  constructor () {
    this.createContent()

    this.createNavigation()
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

    this.page.hide()
  }

  async onChange (url) {
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

      this.page = this.pages(this.template)
      this.page.create()

      this.onResize()

      // this.page.show()
      // console.log(text)

      this.addLinkListeners()
    } else {
      console.log('Error')
    }
  }

  onResize () {
    if (this.page && this.page.update) {
      this.page.onResize()
    }
  }

  udpate () {
    if (this.page && this.page.update) {
      this.page.update()
    }

    this.frame = window.requestAnimationFrame(this.udpate.bind(this))
  }

  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()
        const { href } = link

        this.onChange()
        console.log(event, href)
      }
    })
  }
}

App()
