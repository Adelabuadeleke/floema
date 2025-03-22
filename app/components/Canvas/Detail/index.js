import { Mesh, Plane, Program } from 'ogl'

import vertex from 'shaders/plain-vertex.glsl'
import fragment from 'shaders/plain-fragment.glsl'
// eslint-disable-next-line no-unused-vars
// import _ from 'lodash'
import GSAP from 'gsap'

export default class {
  constructor ({ gl, scene, sizes, transition }) {
    this.id = 'details'

    this.element = document.querySelector('.collections__gallery__media__image')
    this.gl = gl
    // this.index = index
    this.scene = scene
    this.sizes = sizes
    this.transition = transition

    this.geometry = new Plane(this.gl)

    this.createTexture()
    this.createProgram()
    this.createBounds({ sizes: this.sizes })
    this.createMesh()

    this.show()

    this.onResize({
      sizes: this.sizes
    })
  }

  createTexture () {
    const image = this.element.getAttribute('data-src')

    // this.texture = new Texture(this.gl)
    this.texture = window.TEXTURES[image]

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
        uAlpha: { value: 1 },
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
    if (this.transition) {
      this.transition.animate(this.mesh, _ => {
        this.program.uniforms.uAlpha.value = 1
      })
    } else {
      GSAP.to(this.program.uniforms.uAlpha, {
        value: 1
      })
    }
  }

  hide () {

  }

  /**
   * Events
   */
  onResize (sizes) {
    this.createBounds(sizes)
    this.updateX()
    this.updateY()
  }

  onTouchDown () {

  }

  onTouchMove () {

  }

  onTouchUp () {

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

  updateX () {
    this.x = (this.bounds.left) / window.innerWidth

    this.mesh.position.x =
      -this.sizes.width / 2 +
      this.mesh.scale.x / 2 +
      (this.x) * this.sizes.width
  }

  updateY () {
    this.y = (this.bounds.top) / window.innerHeight

    this.mesh.position.y =
      -this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      (this.y) * this.sizes.height
  }

  update () {
    // if (!this.bounds) return
    this.updateX()
    this.updateY()
  }

  /**
   * Destroy
   */
  destroy () {
    this.scene.removeChild(this.mesh)
  }
}
