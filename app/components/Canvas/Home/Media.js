import { Mesh, Program } from 'ogl'

import vertex from 'shaders/home-vertex.glsl'
import fragment from 'shaders/home-fragment.glsl'
// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
import GSAP from 'gsap'

export default class {
  constructor ({ element, geometry, gl, index, scene, sizes }) {
    this.element = element
    this.geometry = geometry
    this.gl = gl
    this.index = index
    this.scene = scene
    this.sizes = sizes

    this.extra = {
      x: 0,
      y: 0
    }

    this.createTexture()
    this.createProgram()
    this.createMesh()
    this.createBounds({
      sizes: this.sizes
    })
  }

  createTexture () {
    // this.texture = new Texture(this.gl)
    const image = this.element

    this.texture = window.TEXTURES[image.getAttribute('data-src')]

    this.image.crossOrigin = 'anonymous'
    this.image.src = this.element.getAttribute('data-src')
    this.image.onload = (_) => (this.texture.image = this.image)
  }

  createProgram () {
    this.program = new Program({
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
        uSpeed: { value: 0 },
        uViewportSizes: { value: [this.sizes.width, this.sizes.height] },
        tMap: { value: this.texture }
      }
    })
  }

  createMesh () {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)

    this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)

    this.position.x += this.index * this.mesh.scale.x
  }

  createBounds ({ sizes }) {
    this.bounds = this.element.getBoundingClientRect()
    this.updateScale(sizes)
    this.updateX()
    this.updateY()
  }

  /**
   * Animations
   */
  show () {
    GSAP.from(this.program.uniforms.uAlpha, {
      value: 0
    }, {
      value: 0.4
    })
  }

  hide () {
    GSAP.from(this.program.uniforms.uAlpha, {
      value: 0
    })
  }

  /**
   * Events
   */
  onResze (sizes, scroll) {
    this.extra = {
      x: 0,
      y: 0
    }
    this.createBounds(sizes)
    this.updateX(scroll && scroll.x)
    this.updateY(scroll && scroll.y)
  }

  /**
   * Loop
   */
  updateScale (sizes) {
    this.width = this.bounds.width / window.innerWidth
    this.height = this.bounds.height / window.innerHeight

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height

    this.mesh.position.x =
      -this.sizes.width / 2 + this.mesh.scale.x / 2 + this.x * this.sizes.width
    this.mesh.position.y =
      -this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      this.y * this.sizes.height
    console.log(this.height, this.width)
  }

  updateX (x = 0) {
    this.x = (this.bounds.left + x) / window.innerWidth

    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      (this.x + x) * this.sizes.width +
      this.extra.x
  }

  updateY (y = 0) {
    this.y = (this.bounds.top + y) / window.innerHeight

    this.mesh.position.y =
      -this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      (this.y + y) * this.sizes.height +
      this.extra.y
  }

  update (scroll, speed) {
    // if (!this.bounds) return
    this.updateX(scroll.x)
    this.updateY(scroll.y)

    this.program.uSpeed.value = speed
  }
}
