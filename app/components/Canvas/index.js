import GSAP from 'gsap'
import { Camera, Renderer, Transform } from 'ogl'

import About from './About'
import Collections from './Collections'
import Home from './Home'
import Details from './Detail'

import Transition from './Transition'

export default class Canvas {
  constructor ({ template }) {
    this.template = template
    this.x = {
      start: 0,
      distance: 0,
      end: 0
    }

    this.y = {
      start: 0,
      distance: 0,
      end: 0
    }
    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize({
      sizes: this.sizes
    })
    // this.createHome()
  }

  createRenderer () {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true
    })

    this.gl = this.renderer.gl
    document.body.appendChild(this.gl.canvas)
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.position.z = 5
  }

  createScene () {
    this.scene = new Transform()
  }

  /**
   * Home.
   **/
  createHome () {
    this.home = new Home({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  destoyHome () {
    if (!this.home) return

    this.home.destoy()
    this.home = null
  }

  /**
   * About.
   **/
  createAbout () {
    this.about = new About({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes
    })
  }

  destoyAbout () {
    if (!this.about) return

    this.about.destoy()
    this.about = null
  }

  /**
   * Colections.
   **/
  createCollections () {
    this.collections = new Collections({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition
    })
  }

  destoycollections () {
    if (!this.collections) return

    this.collections.destoy()
    this.collections = null
  }

  /**
   * Details
   **/
  createDetails () {
    this.details = new Details({
      gl: this.gl,
      scene: this.scene,
      sizes: this.sizes,
      transition: this.transition
    })
  }

  destoyDetails () {
    if (!this.details) return

    this.details.destoy()
    this.details = null
  }

  /**
   * Events
   **/
  onPreloaded () {
    this.onChangeEnd(this.template)
  }

  onChangeStart (template, url) {
    if (this.about) {
      this.about.hide()
    }

    if (this.collections) {
      this.collections.hide()
    }

    if (this.home) {
      this.home.hide()
    }

    this.isFromCollectionsToDetail = this.template === 'collections' && url.indexOf('detail') > -1
    this.isFromDetailToCollections = this.template === 'detail' && url.indexOf('collections') > -1

    if (this.isFromCollectionsToDetail || this.isFromDetailToCollections) {
      this.transition = new Transition({
        collections: this.collections,
        gl: this.gl,
        scene: this.scene,
        sizes: this.sizes,
        url
      })
    }
  }

  onChangeEnd (template) {
    if (this.transition) {
      this.transition.setElement(this.collections || this.details)
    }

    if (template === 'about') {
      this.createAbout()
    } else {
      this.destoyAbout()
    }

    if (template === 'collections') {
      this.gl.canvas.style.zIndex = 1000
      this.createCollections()
    } else if (this.collections) {
      this.gl.canvas.style.zIndex = ''
      this.destoycollections()
    }

    if (template === 'details') {
      this.createDetails()

      GSAP.delayedCall(0.5, _ => {
        if (this.transition) {
          this.transition.animateDetail(this.details)
        }
      })
    } else if (this.details) {
      this.destoyDetails()
    }

    if (template === 'home') {
      this.createHome()
    } else {
      this.destoyHome()
    }

    this.template = template
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.perspective({
      aspect: window.innerWidth / window.innerHeight
    })

    const fov = (this.camera.fov = Math.PI / 100)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.x
    const width = height * this.camera.aspect

    this.sizes = {
      height,
      width
    }

    const values = {
      sizes: this.sizes
    }

    if (this.about) {
      this.about.onResize(values)
    }

    if (this.collections) {
      this.collections.onResize(values)
    }

    if (this.details) {
      this.details.onTouchMove(values)
    }

    if (this.home) {
      this.home.onResize(values)
    }
  }

  onTouchDown (event) {
    this.isDown = true

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY
    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchDown(values)
    }

    if (this.collections) {
      this.collections.onTouchDown(values)
    }

    if (this.home) {
      this.home.onTouchDown(values)
    }
  }

  onTouchMove (event) {
    if (this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    // this.x.distance = this.x.start - this.x.end
    // this.y.distance = this.y.start - this.y.end
    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchMove(values)
    }

    if (this.collections) {
      this.collections.onTouchMove(values)
    }

    if (this.details) {
      this.details.onTouchMove(values)
    }

    if (this.home) {
      this.home.onTouchMove(values)
    }
  }

  onTouchUp (event) {
    this.isDown = false

    const x = event.touches ? event.changedTouches[0].clientX : event.clientX
    const y = event.touches ? event.changedTouches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    // this.x.distance = this.x.start - this.x.end
    // this.y.distance = this.y.start - this.y.end
    const values = {
      x: this.x,
      y: this.y
    }
    if (this.about) {
      this.about.onTouchUp(values)
    }

    if (this.collections) {
      this.collections.onTouchUp(values)
    }

    if (this.details) {
      this.details.onTouchMove(values)
    }

    if (this.home) {
      this.home.onTouchUp(values)
    }
  }

  onWheel (event) {
    // if (this.about) {
    //   this.about.onWheel(event)
    // }

    if (this.collections) {
      this.collections.onWheel(event)
    }

    if (this.details) {
      this.details.onTouchMove()
    }

    if (this.home) {
      this.home.onWheel(event)
    }
  }

  /**
   * Loops
   **/
  update (scroll) {
    if (this.about) {
      this.about.update(scroll)
    }

    if (this.collections) {
      this.collections.update()
    }

    if (this.details) {
      this.details.onTouchMove()
    }

    if (this.home) {
      this.home.update()
    }

    this.renderer.render({
      camera: this.camera,
      scene: this.scene
    })
  }
}
