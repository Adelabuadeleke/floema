import { map } from 'lodash'
import GSAP from 'gsap'
import Media from '../Media'
import { Plane, Transform } from 'ogl'
// import { lerp } from 'utls/math'

export default class {
  constructor ({ gl, scene, sizes }) {
    this.group = new Transform()
    this.scene = scene
    this.galleryElement = document.querySelector('.home__gallery')

    this.gl = gl
    this.sizes = sizes
    this.mediasElements = document.querySelectorAll(
      '.home__gallery__media__image'
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
      x: 0,
      y: 0
    }

    this.speed = {
      target: 0,
      current: 0,
      lerp: 0.1
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
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20
    })
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
    map(this.medias, media => media.show())
  }

  hide () {
    map(this.medias, media => media.hide())
  }

  /**
   * Events
   */

  onResize (event) {
    this.scroll.x = this.x.target = 0
    this.scroll.y = this.y.target = 0
    // this.onResizing = true;

    this.galleryBounds = this.galleryElement.getBoundingClientRect()

    this.sizes = event.sizes

    this.gallerySizes = {
      height:
        (this.galleryBounds.width / window.innerWidth) * this.sizes.height,
      width:
        (this.galleryBounds.height / window.innerHeight) * this.sizes.width
    }

    map(this.medias, (media) => media.onResize(event, this.scroll))
    //  window.requestAnimationFrame(_ =>{
    //   this.onResizing = false;
    //  })
  }

  onTouchDown ({ x, y }) {
    // this.speed.target = 1
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove ({ x, y }) {
    this.speed.target = 0.1

    const xDistance = x.start - x.end
    const yDistance = y.start - y.end

    this.x.target = this.scrollCurrent.x + xDistance
    this.y.target = this.scrollCurrent.y + yDistance
  }

  onTouchUp ({ x, y }) {
    this.speed.target = 1
  }

  onWheel ({ pixelX, pixelY }) {
    this.x.target += pixelX
    this.y.target += pixelY
  }

  /**
   * Update
   */
  update () {
    // if (!this.galleryBounds) return

    this.speed.current = GSAP.utils.interpolate(
      this.speed.current,
      this.speed.target,
      this.speed.lerp
    )

    this.x.current = GSAP.utils.interpolate(
      this.x.current,
      this.x.target,
      this.x.lerp
    )
    this.y.current = GSAP.utils.interpolate(
      this.y.current,
      this.y.target,
      this.y.lerp
    )

    this.scroll.x = this.x.current
    this.scroll.y = this.y.current

    if (this.scroll.x < this.x.current) {
      this.x.direction = 'right'
    } else if (this.scroll.x > this.x.current) {
      this.x.direction = 'left'
    }

    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top'
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'bottom'
    }

    // this.galleryWidth =
    //   (this.galleryBounds.width / window.innerWidth) * this.sizes.width;
    console.log(this.x.direction)

    map(this.medias, (media, index) => {
      const offsetX = this.sizes.width * 0.6
      const scaleX = media.mesh.scale.x / 2

      if (this.x.direction === 'left') {
        const x = media.mesh.position.x + scaleX

        if (x < -offsetX) {
          media.extra.x += this.gallerySizes.width
          this.mesh.rotation.Z = GSAP.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03
          )
        }
      } else if (this.x.direction === 'right') {
        const x = media.mesh.position.x - scaleX

        if (x > -offsetX) {
          media.extra.x -= this.gallerySizes.width
          this.mesh.rotation.Z = GSAP.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03
          )
        }
      }

      const scaleY = media.mesh.scale.y / 2
      const offsetY = this.sizes.height * 0.6
      if (this.y.direction === 'top') {
        const y = media.mesh.position.y + scaleY

        if (y < -offsetY) {
          media.extra.y += this.gallerySizes.height
          media.mesh.rotation.Z = GSAP.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03
          )
        }
      } else if (this.y.direction === 'bottom') {
        const y = media.mesh.position.y - scaleY

        if (y > -offsetY) {
          media.extra.y -= this.gallerySizes.height
          media.mesh.rotation.Z = GSAP.utils.random(
            -Math.PI * 0.03,
            Math.PI * 0.03
          )
        }
      }
      // }
      media.update(this.scroll, this.speed.current)
    })
  }

  /**
 * Destroy.
 */

  destroy () {
    this.scene.removeChild(this.group)
  }
}
