import GSAP from 'gsap'
import { Mesh, Plane, Program } from 'ogl'

import vertex from 'shaders/plain-vertex.glsl'
import fragment from 'shaders/plain-fragment.glsl'
// eslint-disable-next-line no-unused-vars
// import _ from 'lodash'

export default class {
  constructor ({ gl, scene, sizes, url }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.url = url

    this.geometry = new Plane()

    this.createTexture()
  }

  createTexture () {

    // const image = this.element.querySelector('.collections__gallery__media__image')

    // this.texture = new Texture(this.gl)
    // this.texture = this.media.texture

    // this.image = new window.Image()
    // this.image.crossOrigin = 'anonymous'
    // this.image.src = image.getAttribute('data-src')
    // this.image.onload = (_) => (this.texture.image = this.image)
  }

  createProgram (texture) {
    this.program = new Program({
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: texture }
      }
    })
  }

  createMesh (mesh) {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.scale.x = mesh.scale.x
    this.mesh.scale.y = mesh.scale.y
    this.mesh.scale.z = mesh.scale.z

    this.mesh.position.x = mesh.position.x
    this.mesh.position.y = mesh.position.y
    this.mesh.position.z = mesh.position.z

    this.mesh.setParent(this.scene)

    // this.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.03, Math.PI * 0.03)

    // this.position.x += this.index * this.mesh.scale.x
  }

  /**
   * Elements
   */
  setElement (element) {
    if (element.id === 'collections') {
      const { index, medias } = element
      const media = medias[index]

      this.createProgram(media.texture)
      this.createMesh(media.mesh)

      this.transition = 'details'
    } else {
      this.createProgram(element.texture)
      this.createMesh(element.mesh)

      this.transition = 'collection'
    }
  }

  /**
   * Animations
   */
  animate (element, onComplete) {
    const timeline = GSAP.timeline({
      delay: 0.5
    })
    timeline.to(this.mesh.position, {
      duration: 1.5,
      ease: 'expo.inOut',
      x: element.scale.x,
      y: element.scale.y,
      z: element.scale.z

    }, 0)

    timeline.to(this.mesh.scale, {
      duration: 1.5,
      ease: 'expo.inOut',
      onComplete,
      x: element.position.x,
      y: element.position.y,
      z: element.position.z
    }, 0)

    timeline.call(_ => {
      this.scene.removeChild(this.mesh)
    })
  }
}
