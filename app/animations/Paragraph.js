import Animation from 'classes/Animation'
import GSAP from 'gsap'
// import each from 'lodash/each'
import { calculate, split } from 'utils/text'

export default class Paragraph extends Animation {
  constructor (element, elements) {
    super({
      element,
      elements
    })

    this.elementLinesSpans = split({
      element: this.elements,
      append: true
    })
  }

  animateIn () {
    this.timelineIn = GSAP.timeline({
      delay: 0.5
    })
    this.timelineIn.to(this.element, {
      autoAlpha: 1,
      duration: 1
    })

    // each(this.elementLines, (line, index) => {
    //   this.timelineIn.fromTo(line, {
    //     autoAlpha: 0,
    //     y: '100%'
    //   }, {
    //     autoAlpha: 1,
    //     delay: 0.5 + index + 0.1,
    //     duration: 1.5,
    //     ease: 'expo.out',
    //     y: '0%'
    //   }, 0)
    // })
  }

  animateOut () {
    GSAP.set(this.element, {
      autoAlpha: 0
    })
  }

  onResize () {
    this.elementLines = calculate(this.elementLinesSpans)
  }
}
