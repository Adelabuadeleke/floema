import Button from 'classes/Button'
import Page from 'classes/Page'

export default class Home extends Page {
  constructor () {
    super({
      id: 'home',
      element: '.home',
      elements: {
        navigation: document.querySelector('.navigation'),
        link: '.home__link'
      }
    })
  }

  create () {
    super.create()

    this.link = new Button({
      element: this.element.link
    })

    // this.elements.link.addEventListener('click', _ => console.log('you clicked me...!'))
  }

  destroy () {
    super.destroy()

    this.link.removeEventListeners()
  }
}
