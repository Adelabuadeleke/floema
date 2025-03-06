import { map } from 'lodash'
// import GSAP from 'gsap'
// import Media from '../Media'
import { Plane, Transform } from 'ogl'
import Gallery from './Gallery'
// import { lerp } from 'utls/math'

export default class {
  constructor ({ gl, scene, sizes }) {
    this.group = new Transform()

    this.gl = gl
    this.sizes = sizes

    this.createGeometry()
    this.createGalleries()

    this.group.setParent(scene)
    this.show()
    // this.mediasElements = document.querySelectorAll(
    //   '.home__gallery__media__image'
    // )

    // this.x = {
    //   current: 0,
    //   target: 0,
    //   lerp: 0.1
    // }

    // this.y = {
    //   current: 0,
    //   target: 0,
    //   lerp: 0.1
    // }

    // this.scrollCurrent = {
    //   x: 0,
    //   y: 0
    // }

    // this.scroll = {
    //   x: 0,
    //   y: 0
    // }
  }

  createGeometry () {
    this.geometry = new Plane(this.gl)
  }

  createGalleries () {
    this.galleriesElements = document.querySelectorAll('.about__gallery')

    this.galleries = map(this.galleriesElements, (element, index) => {
      return new Gallery({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.scene,
        sizes: this.sizes
      })
    })
  }

  /**
   * Animations
   */
  show () {
    map(this.galleries, gallery => gallery.show())
  }

  hide () {
    map(this.galleries, gallery => gallery.hide())
  }

  /**
   * Events
   */

  onResize (event) {
    map(this.galleries, gallery => gallery.onResize(event))
  }

  onTouchDown (event) {
    map(this.galleries, gallery => gallery.onTouchDown(event))
  }

  onTouchMove (event) {
    map(this.galleries, gallery => gallery.onTouchMove(event))
  }

  onTouchUp (event) {
    map(this.galleries, gallery => gallery.onTouchUp(event))
  }

  onWheel ({ pixelX, pixelY }) {
    this.x.target += pixelX
    this.y.target += pixelY
  }

  /**
   * Update
   */
  update (scroll) {
    map(this.galleries, gallery => gallery.update(scroll))
  }

  /**
  * Destroy
  */
  destroy () {
    map(this.galleries, gallery => gallery.destroy())
  }
}
