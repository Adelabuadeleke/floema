import { map } from 'lodash'
import GSAP from 'gsap'
import Media from '../Media'
import { Plane, Transform } from 'ogl'
import Prefix from 'prefix'
// import map from 'lodash/map'
// import { lerp } from 'utls/math'

export default class {
  constructor ({ gl, scene, sizes, transition }) {
    this.id = 'collections'

    this.group = new Transform()
    this.gl = gl
    this.sizes = sizes
    this.scene = scene
    this.transition = transition

    this.transformPrefix = Prefix('transform')

    this.galleryWrapperElement = document.querySelector('.collections__gallery')
    this.galleryWrapperElement = document.querySelector('.collections__gallery__wrapper')
    this.titlesElement = document.querySelector('.collections__titles')
    this.collectionsElements = document.querySelectorAll('.collection__article')
    this.collectionsElementsActive = document.querySelectorAll('.collection__article--active')
    this.mediasElements = document.querySelectorAll(
      '.collections__gallery__media'
    )

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.scrollCurrent = {
      x: 0,
      y: 0
    }

    this.scroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: 0.1,
      velocity: 1
    }

    this.createGeometry()
    this.createGallery()

    this.onResize({
      sizes: this.sizes
    })

    this.group.setParent(this.scene)
    this.show()
  }

  createGeometry () {
    this.geometry = new Plane(this.gl)
  }

  createGallery () {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
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
    if (this.transition) {
      this.transition.animate(this.medias[0].mesh, _ => {

      })
    }

    map(this.medias, media => media.show())
  }

  hide () {
    map(this.medias, media => media.hide())
  }

  /**
   * Events
   */

  onResize (event) {
    this.scroll.last = this.scroll.target = 0
    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth
    // this.scroll.y = this.y.target = 0
    // this.onResizing = true;

    this.bounds = this.galleryWrapperElement.getBoundingClientRect()

    this.sizes = event.sizes

    this.width = (this.bounds.height / window.innerHeight) * this.sizes.width

    map(this.medias, (media) => media.onResize(event, this.scroll))
    //  window.requestAnimationFrame(_ =>{
    //   this.onResizing = false;
    //  })
  }

  onTouchDown ({ x, y }) {
    this.scroll.last = this.scroll.current
    // this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove ({ x, y }) {
    const distance = x.start - x.end

    this.x.target = this.scroll.last + distance
    // this.y.target = this.scrollCurrent.y + yDistance
  }

  onTouchUp ({ x, y }) {}

  onWheel ({ pixelY }) {
    this.y.target += pixelY
  }

  /**
   * Changed
   */
  onChanged (index) {
    this.index = index
    const selectedCollection = parseInt(this.mediasElements[this.index].getAttribute('data-index'))
    // this.collection = selectedCollection
    map(this.collectionsElements, (element, elementIndex) => {
      if (elementIndex === selectedCollection) {
        element.classList.add(this.collectionsElementsActive)
      } else {
        element.classList.remove(this.collectionsElementsActive)
      }
    })

    this.titlesElement.style[this.transformPrefix] = `translateY(-${25 * selectedCollection}%) translate(-50%, -50%) rotate(90deg)`
  }

  /**
   * Update
   */
  update () {
    this.scroll.target = GSAP.utils.clamp(-this.scroll.limit, 0, this.scroll.target)

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.x.target,
      this.x.lerp
    )

    this.galleryElement.style[this.transformPrefix] = `translateX(${this.scroll.current}px)`

    if (this.scroll.last < this.scroll.current) {
      this.x.direction = 'right'
    } else if (this.scroll.last > this.scroll.current) {
      this.x.direction = 'left'
    }

    this.scroll.last = this.scroll.current

    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top'
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'bottom'
    }

    // this.galleryWidth =
    //   (this.bounds.width / window.innerWidth) * this.sizes.width;
    console.log(this.x.direction)
    const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length)
    // console.log(index)

    if (this.index !== index) {
      this.index = index
      this.onChanged(index)
    }

    map(this.medias, (media, index) => {
      media.update(this.scroll.current, this.index)

      media.mesh.position.y += Math.cos((media.mesh.position.x / this.sizes.width) * Math.PI * 0.1) * 40 - 40
    })
  }

  /**
 * Destroy.
 */

  destroy () {
    this.scene.removeChild(this.group)
  }
}
