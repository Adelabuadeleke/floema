import EventEmitter from 'events'
import each from 'lodash/each'

export default class Component extends EventEmitter {
  constructor ({
    element,
    elements

  }) {
    super()
    this.selector = element
    this.selectorChildren = {
      ...elements
    }

    this.create()
    this.addEventListeners()
  }

  create () {
    if (this.selector instanceof window.HTMLElement) {
      this.element = this.selector
    } else {
      this.element = document.querySelector(this.selector)
    }
    this.elements = {}

    each(this.selectorChildren, (entry, key) => {
      // console.log('entry', document.querySelectorAll(entry))
      // console.log('entry --> el', document.querySelectorAll(entry) instanceof window.HTMLElement)
      // console.log('entry --> NodeList', document.querySelectorAll(entry) instanceof window.NodeList)
      // console.log('entry --> Array', Array.isArray(document.querySelectorAll(entry)))
      // console.log('key', key)
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        console.log('instance', entry)
        this.elements[key] = entry
      } else {
        console.log('none---->', entry)
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          console.log('=== 0')
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          console.log('=== 1')
          this.elements[key] = document.querySelector(entry)
          console.log('elements', this.elements)
        }
      }
    })
  }

  addEventListeners () {

  }

  removeEventListeners () {

  }
}
