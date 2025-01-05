import GSAP from 'gsap'
import NormalizeWheel from 'normalize-wheel'
import each from 'lodash/each'
import Prefix from 'prefix'

import Highlight from 'animations/Highlight'
import Title from 'animations/Title'
import Paragraph from 'animations/Paragraph'
import Label from 'animations/Label'
import map from 'lodash/map'

import AsyncLoad from 'classes/AsyncLoad'

import { ColorsManager } from 'classes/Colors'

export default class Page {
  constructor ({
    element,
    elements,
    id
  }) {
    this.selector = element
    this.selectorChildren = {
      ...elements,
      animationsHighlights: '[data-animation="heighlight"]',
      animationsTitles: '[data-animation="title"]',
      animationsParagraph: '[data-animation="paragraph"]',
      animationsLabel: '[data-animation="label"]',
      preloaders: '[data-src]'
    }
    this.id = id

    this.onMouseWheelEvent = this.onMouseWheel.bind(this)

    this.transformPrefix = Prefix('transform')

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }
  }

  create () {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = document.querySelectorAll(entry)
        if (this.element[key].length === 0) {
          this.elements[key] = null
        } else if (this.element[key].length === 1) {
          this.elements[key] = document.querySelector(entry)
        }
      }
      console.log(entry, key)
    })

    this.createAnimations()
    this.createPreloaders()
  }

  createAnimations () {
    this.animations = []

    // Titles
    this.animationsTitles = map(this.elements.animationsTitles, element => {
      return new Title({
        element
      })
    })

    this.animations.push(...this.animationsTitles)

    // Highlights
    this.animationsHighlights = map(this.elements.animationsHighlights, element => {
      return new Highlight({
        element
      })
    })

    this.animations.push(...this.animationsTitles)

    // Paragraph
    this.animationsParagraph = map(this.elements.animationsParagraph, element => {
      return new Paragraph({
        element
      })
    })

    this.animations.push(...this.animationsParagraph)

    // Labels
    this.animationsLabel = map(this.elements.animationsLabel, element => {
      return new Label({
        element
      })
    })

    this.animations.push(...this.animationsLabel)
  }

  createPreloaders () {
    this.preloaders = map(this.element.preloaders, element => {
      return new AsyncLoad({ element })
    })
  }

  show () {
    return new Promise(resolve => {
      ColorsManager.change({
        backgroundColor: this.element.getAttribute('data-background'),
        color: this.element.getAttribute('data-color')
      })
      this.animationIn = GSAP.timeline()
      this.animationIn.fromTo(this.element, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      })

      this.animationIn.call(_ => {
        this.addEventListeners()

        resolve()
      })
    })
  }

  hide () {
    return new Promise(resolve => {
      this.removeEventListeners(

      )
      this.animationOut = GSAP.timeline()

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  onMouseWheel (event) {
    const { pixelY } = NormalizeWheel(event)
    // console.log(deltaY)

    this.scroll.target += pixelY
  }

  onRezize () {
    if (this.elements.wrapper) {
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
    }

    each(this.animationsTitles, animation => animation.onRezize())
  }

  update () {
    this.scroll.current = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)
    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    if (this.scroll.target < 0.01) {
      this.scroll.target = 0
    }

    if (this.elements.wrapper) {
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }

  addEventListeners () {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  removeEventListeners () {
    window.addEventListener('mousewheel', this.onMouseWheelEvent)
  }

  /**
   * Destroy
   */
  destroy () {
    this.removeEventListeners()
  }
}
