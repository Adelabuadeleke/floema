import { Camera, Renderer, Transform } from 'ogl'

import Home from './Home'
import About from './About'

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

    this.onResize()
    this.onChangeEnd(this.template)
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
   * Events
   **/
  onChangeStart () {
    if (this.home) {
      this.home.hide()
    }
    if (this.about) {
      this.about.hide()
    }
  }

  onChangeEnd (template) {
    if (template === 'home') {
      this.createHome()
    } else {
      this.destoyHome()
    }

    if (template === 'about') {
      this.createAbout()
    } else {
      this.destoyAbout()
    }
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

    if (this.home) {
      this.home.onTouchUp(values)
    }
  }

  onWheel (event) {
    if (this.about) {
      this.about.onWheel(event)
    }

    if (this.home) {
      this.home.onWheel(event)
    }
  }

  /**
   * Loops
   **/
  update () {
    if (this.about) {
      this.about.update()
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
