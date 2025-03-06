import GSAP from 'gsap'
import Component from 'classes/Component'
// import each from 'lodash/each'
import { split } from 'utils/text'
import { Texture } from 'ogl'
// import _ from 'lodash'

export default class Preloader extends Component {
  constructor ({ canvas }) {
    super({
      element: '.preloader',
      elements: {
        title: '.preloader_text',
        number: '.preloader_number',
        numberText: '.preloader__number_text'
        // images: document.querySelectorAll('img')
      }
    })

    this.canvas = canvas

    window.TEXTURES = {}

    // console.log(this.elements.title)

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    split({
      element: this.elements.title,
      expression: '<br>'
    })

    this.elements.titleSpans = this.elements.title.querySelectorAll('span span')

    this.length = 0

    console.log(this.element, this.elements)

    this.createLoader()
  }

  createLoader () {
    const texture = new Texture(this.canvas.gl, {
      generateMipmaps: false
    })

    window.ASSETS.forEach(image => {
      const media = new window.Image()

      media.crossOrigin = 'anonymous'
      media.src = image
      media.onload = _ => {
        texture.image = media
        this.onAssetLoaded()
      }

      window.TEXTURES[image] = texture
      console.log(image)
    })
  }

  onAssetLoaded (image) {
    this.length++

    const percent = this.length / window.ASSETS.length

    this.elements.numberText.innerHTML = `${Math.round(percent * 100)}%`

    if (percent === 1) {
      this.onloaded()
    }
  }

  onloaded () {
    return new Promise(resolve => {
      this.emit('completed')

      this.animateOut = GSAP.timeline({
        delay: 1
      })

      this.animateOut.to(this.elements.titleSpans, {
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
        y: '100%'
      })

      this.animateOut.to(this.elements.numberText, {
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1,
        y: '100%'
      }, '-=1.4')

      this.animateOut.to(this.element, {
        autoAlpha: 0,
        duration: 1
        // ease: 'expo.out',
        // scaleY: 0,
        // transformOrigin: '100% 100%'
      })

      this.animateOut.call(_ => {
        this.destroy()
      })
    })
  }

  destroy () {
    this.element.parentNode.removeChild(this.element)
  }
}
