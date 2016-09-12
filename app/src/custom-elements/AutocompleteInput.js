/**
 * This class uses awesomplete.js's code as base.
 * See url for original code and license:
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * MIT license
 *
 * MODIFIED by https://github.com/lolleko
 *
 * This class creates an input that features a autocomplete list.
 * The possible ussgestions can be set via the values property.
 * It is possible to use an array aswell as an function taht returns an array.
 *
 * NOTE: TL;DR Can be used as a normal input element.
 *       It's hacked to behave like an input element,
 *       it acutally isn't since extending HTMLInputElement causes weird issues.
 *       It only supports the setting of the value attribute.
 *       All input related events will be fired.
 *       TODO: Should be reimplemented once
 *             electron upgrades to chrome 54
 */

class AutocompleteInput extends HTMLElement {

  createdCallback () {
    this.classList.add('dropdown-container')

    this.values = []
    this.minChars = 1
    this.maxItems = 128
    this.autoFirst = true
    this.index = -1

    var input = document.createElement('input')
    input.classList.add('autocomplete-input-fake')
    input.addEventListener('input', this, false)
    input.addEventListener('blur', this, false)
    input.addEventListener('keydown', this, false)

    this.appendChild(input)
    this.input = input
  }

  get selected () {
    return this.index > -1
  }

  set value (value) {
    this.input.value = value
  }

  get value () {
    return this.input.value
  }

  focus () {
    this.input.focus()
  }

  select () {
    this.input.select()
  }

  close (o) {
    if (!this.opened) {
      return
    }

    this.removeChild(this.ul)
    this.ul = null
    this.index = -1
    this.opened = false
  }

  open () {
    this.opened = true
    if (this.autoFirst && this.index === -1) {
      this.goto(0)
    }
    this.ul.style.position = 'absolute'
  }

  createList () {
    var ul = document.createElement('ul')
    ul.addEventListener('mousedown', this, false)
    ul.classList.add('autocomplete-list')
    ul.classList.add('dropdown-select')
    ul.style.width = this.input.offsetWidth + 'px'

    this.appendChild(ul)
    this.ul = ul
  }

  next () {
    var count = this.ul.children.length

    this.goto(this.index < count - 1 ? this.index + 1 : -1)
  }

  previous () {
    var count = this.ul.children.length

    this.goto(this.selected ? this.index - 1 : count - 1)
  }

  // Should not be used, highlights specific item without any checks!
  goto (i) {
    var lis = this.ul.children

    if (this.selected) {
      lis[this.index].dataset.selected = false
    }

    this.index = i

    var container = this.ul
    var element = lis[this.index]

    if (element) {
      // Determine container top and bottom
      let cTop = container.scrollTop
      let cBottom = cTop + container.clientHeight

      // Determine element top and bottom
      let eTop = element.offsetTop
      let eBottom = eTop + element.clientHeight

      // Check if out of view
      if (eTop < cTop) {
        container.scrollTop -= (cTop - eTop)
      } else if (eBottom > cBottom) {
        container.scrollTop += (eBottom - cBottom)
      }
    }

    if (i > -1 && lis.length > 0) {
      lis[i].dataset.selected = true
    }
  }

  selectSuggestion (selected, origin) {
    if (selected) {
      this.index = this.siblingIndex(selected)
    } else {
      selected = this.ul.children[this.index]
    }

    if (selected) {
      var suggestion = this.suggestions[this.index]

      this.replace(suggestion)
      // dispatch input event (since it will not be fired if we set the value directly)
      var inputEvent = new Event('input', {
        'bubbles': true,
        'cancelable': true
      })
      this.input.dispatchEvent(inputEvent)
    }
  }

  evaluate (forceAll) {
    var me = this
    var value = this.value

    var values
    if (typeof this.values === 'function') {
      values = this.values()
    } else {
      values = this.values
    }

    if (value.length >= this.minChars && values.length > 0) {
      this.index = -1

      if (forceAll) {
        this.suggestions = values
          .sort(me.sort)
          .slice(0, me.maxItems)

        this.suggestions.forEach(function (text, index) {
          if (value === text.value) {
            var match = me.suggestions.splice(index, 1)
            me.suggestions.unshift(match[0])
          }
        })
      } else {
        this.suggestions = values
          .filter(function (item) {
            return me.filter(item, value)
          })
          .sort(me.sort)
          .slice(0, me.maxItems)

        var lcp = this.longestCommonPrefix(this.suggestions)
        if (lcp !== '' && !this.suggestions.includes(lcp) && lcp.toLowerCase() !== this.input.value.toLowerCase()) {
          this.suggestions.unshift(lcp)
        }
      }

      if (this.suggestions.length !== 0) {
        if (!this.ul) {
          // create list if no exists
          this.createList()
        }
        // Populate list with options that match
        this.ul.innerHTML = ''
        this.suggestions.forEach(function (text) {
          me.ul.appendChild(me.item(text, value))
        })
        this.open()
      } else {
        this.close({
          reason: 'nomatches'
        })
      }
    } else {
      this.close({
        reason: 'nomatches'
      })
    }
  }

  regExpEscape (s) {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  siblingIndex (el) {
    var current = el

    var i = 0
    while (current.previousElementSibling) {
      current = current.previousElementSibling
      i++
    }

    return i
  }

  handleEvent (e) {
    switch (e.type) {
      case 'input':
        this.onInput(e)
        break
      case 'blur':
        this.onBlur(e)
        break
      case 'keydown':
        this.onKeyDown(e)
        break
      case 'mousedown':
        this.onMouseDown(e)
        break
    }
  }

  onInput (e) {
    this.evaluate()
  }

  onBlur (e) {
    this.close({
      reason: 'blur'
    })
  }

  onKeyDown (e) {
    var c = e.keyCode

    // If the dropdown `ul` is in view, then act on keydown for the following keys:
    // Enter / Esc / Up / Down
    if (this.opened) {
      if (c === 13 && this.selected) { // Enter
        e.preventDefault()
        this.selectSuggestion()
      } else if (c === 27) { // Esc
        this.close({
          reason: 'esc'
        })
      } else if (c === 38 || c === 40) { // Down/Up arrow
        e.preventDefault()
        this[c === 38 ? 'previous' : 'next']()
      }
    }
  }

  onMouseDown (e) {
    var li = e.target

    if (li !== this.ul) {
      while (li && !/li/i.test(li.nodeName)) {
        li = li.parentNode
      }

      if (li && e.button === 0) { // Only select on left click
        e.preventDefault()
        this.selectSuggestion(li, e.target)
      }
    }
  }

  // Overwrite for different behaviour
  sort (a, b) {
    if (a.length !== b.length) {
      return a.length - b.length
    }

    return a < b ? -1 : 1
  }

  filter (text, input) {
    return this.filterStartsWith(text, input)
  }

  item (text, input) {
    var html = input === '' ? text : text.replace(RegExp(this.regExpEscape(input.trim()), 'gi'), '<mark>$&</mark>')
    var item = document.createElement('li')
    item.dataset.selected = false
    item.innerHTML = html
    return item
  }

  replace (text) {
    this.input.value = text
  }

  // Static awesomplete methods and variables
  filterContains (text, input) {
    return RegExp(this.regExpEscape(input.trim()), 'i').test(text)
  }

  filterStartsWith (text, input) {
    return RegExp('^' + this.regExpEscape(input.trim()), 'i').test(text)
  }

  longestCommonPrefix (strs) {
    if (strs.length === 0) {
      return ''
    }
    var A = strs.concat().sort()
    var a1 = A[0]
    var a2 = A[A.length - 1]
    var l = a1.length
    var i = 0
    while (i < l && a1.charAt(i) === a2.charAt(i)) {
      i++
    }
    return a1.substring(0, i)
  }

}

module.exports = document.registerElement('autocomplete-input', AutocompleteInput)
