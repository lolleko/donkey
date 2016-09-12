/**
 * Simple resize handle that can be placed between 2 elements to make them resizable.
 * Works best in flex layouts.
 */
class ResizeHandle extends HTMLElement {
  attachedCallback () {
    if (!this.dataset.mode) {
      this.dataset.direction = 'col'
    }

    this.classList.add('resize-handle')

    this.addEventListener('mousedown', this, false)
  }

  handleEvent (e) {
    switch (e.type) {
      case 'mousedown':
        this.onMouseDown(e)
        break
      case 'mousemove':
        this.onMouseMove(e)
        break
      case 'mouseup':
        this.onMouseUp(e)
        break
    }
  }

  onMouseDown (e) {
    this.startWidth = this.offsetWidth
    this.startHeight = this.offsetHeight
    document.addEventListener('mousemove', this, false)
    document.addEventListener('mouseup', this, false)
  }

  onMouseMove (e) {
    if (this.dataset.direction === 'col') {
      this.previousElementSibling.style.width = (this.startWidth + e.clientX) + 'px'
    } else if (this.dataset.direction === 'row') {
      this.previousElementSibling.style.height = (this.startHeight + e.clientY) + 'px'
    }
  }

  onMouseUp (e) {
    document.removeEventListener('mousemove', this, false)
    document.removeEventListener('mouseup', this, false)
  }
}

module.exports = document.registerElement('resize-handle', ResizeHandle)
