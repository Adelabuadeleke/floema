import { Mesh, Program } from 'ogl'
import GSAP from 'gsap'

import vertex from 'shaders/plain-vertex.glsl'
import fragment from 'shaders/plain-fragment.glsl'
// eslint-disable-next-line no-unused-vars
import _ from 'lodash'
// import GSAP from 'gsap'

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

    this.extra = {
      x: 0,
      y: 0
    }

    this.createBounds({
      sizes: this.sizes
    })
  }

  createTexture () {
    const image = this.element.querySelector('img')

    // this.texture = new Texture(this.gl)
    this.texture = window.TEXTURES[image.getAttribute('data-src')]

    this.image = new window.Image()
    this.image.crossOrigin = 'anonymous'
    this.image.src = image.getAttribute('data-src')
    this.image.onload = (_) => (this.texture.image = this.image)
  }

  createProgram () {
    this.program = new Program({
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 0 },
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

    // this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)

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
      value: 1
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
  onResize (sizes, scroll) {
    this.extra = 0
    // this.extra = {
    //   x: 0,
    //   y: 0
    // }
    this.createBounds(sizes)
    this.updateX(scroll)
    this.updateY(0)
  }

  /**
   * Loop
   */
  updateRotation () {
    this.mesh.rotation.z = GSAP.utils.mapRange(-this.sizes.width / 2, this.sizes.width / 2, Math.PI * 0.1, -Math.PI * 0.1, this.mesh.position.x)
  }

  updateScale (sizes) {
    this.width = this.bounds.width / window.innerWidth
    this.height = this.bounds.height / window.innerHeight

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
    const scale = GSAP.utils.mapRange(0,
      this.sizes.width / 2, 0.1, 0, Math.abs(this.mesh.position.x))

    this.mesh.rotation.x += scale
    this.mesh.rotation.y += scale

    // this.mesh.position.x =
    //   -this.sizes.width / 2 + this.mesh.scale.x / 2 + this.x * this.sizes.width

    // this.mesh.position.y =
    //   -this.sizes.height / 2 -
    //   this.mesh.scale.y / 2 -
    //   this.y * this.sizes.height
    // console.log(this.height, this.width)
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
      (this.y + y) * this.sizes.height

    this.mesh.position.y += Math.cos((this.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 - 40
  }

  update (scroll) {
    // if (!this.bounds) return

    this.updateRotation()
    this.updateScale()
    this.updateX(scroll.x)
    this.updateY(scroll.y)
  }
}
