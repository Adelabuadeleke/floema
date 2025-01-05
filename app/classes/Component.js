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
  }

  addEventListeners () {

  }

  removeEventListeners () {

  }
}
