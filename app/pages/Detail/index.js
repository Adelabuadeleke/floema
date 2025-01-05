import Button from 'classes/Button'
import Page from 'classes/Page'

export default class Detail extends Page {
  constructor () {
    super({
      id: 'detail',
      element: '.detail',
      elements: {
        button: '.detail__button'
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
