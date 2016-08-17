/**
 * This class uses awesomplete.js's code as base.
 * See url for original code and license:
 * @author Lea Verou http://leaverou.github.io/awesomplete
 * MIT license
 *
 * MODIFIED by https://github.com/lolleko
 */

class AutocompleteInput {
    constructor(options) {
        this._list = options.values ||  [];
        this._minChars = options.minChars ||  1;
        this._maxItems = options.maxItems || 128;
        this._autoFirst = options.autoFirst ||  true;
        this._index = -1;

        this.createElement();

		console.log(this);
    }

    createElement() {

        var container = document.createElement('div');
        container.classList.add('awesomplete');

        var input = document.createElement('input');

        input.setAttribute("autocomplete", "off");
        input.setAttribute("aria-autocomplete", "list");

        input.addEventListener('input', this, false);
        input.addEventListener('blur', this, false);
        input.addEventListener('keydown', this, false);

        var ul = document.createElement('ul');
        ul.setAttribute("hidden", true);

        ul.addEventListener('mousedown', this, false);

        var status = document.createElement('span');
        status.classList.add('visually-hidden');
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'assertive');
        status.setAttribute('aria-relevant', 'additions');

        container.appendChild(input);
        container.appendChild(ul);
        container.appendChild(status);

        this._element = container;
        this._element.input = input;
        this._element.ul = ul;
        this._element.status = status;
    }

    get selected() {
        return this._index > -1;
    }

    get opened() {
        return !this._element.ul.hasAttribute("hidden");
    }

    get element() {
        return this._element;
    }

    get input() {
        return this._element.input;
    }

    get list() {
        return this._list;
    }

    set list(list) {
        this._list = list;
    }

    close(o) {
        if (!this.opened) {
            return;
        }

        this._element.ul.setAttribute("hidden", "");
        this._index = -1;
    }

    open() {
        this._element.ul.removeAttribute("hidden");

        if (this._autoFirst && this._index === -1) {
            this.goto(0);
        }
    }

    next() {
        var count = this._element.ul.children.length;

        this.goto(this._index < count - 1 ? this._index + 1 : -1);
    }

    previous() {
        var count = this._element.ul.children.length;

        this.goto(this.selected ? this._index - 1 : count - 1);
    }

    // Should not be used, highlights specific item without any checks!
    goto(i) {
        var lis = this._element.ul.children;

        if (this.selected) {
            lis[this._index].setAttribute("aria-selected", "false");
        }

        this._index = i;

        var container = this._element.ul;
        var element = lis[this._index];

        if (element) {
            //Determine container top and bottom
            let cTop = container.scrollTop;
            let cBottom = cTop + container.clientHeight;

            //Determine element top and bottom
            let eTop = element.offsetTop;
            let eBottom = eTop + element.clientHeight;

            //Check if out of view
            if (eTop < cTop) {
                container.scrollTop -= (cTop - eTop);
            } else if (eBottom > cBottom) {
                container.scrollTop += (eBottom - cBottom);
            }
        }

        if (i > -1 && lis.length > 0) {
            lis[i].setAttribute("aria-selected", "true");
            this._element.status.textContent = lis[i].textContent;
        }
    }

    select(selected, origin) {
        if (selected) {
            this._index = this.siblingIndex(selected);
        } else {
            selected = this._element.ul.children[this._index];
        }

        if (selected) {
            var suggestion = this._suggestions[this._index];

            this.replace(suggestion);
            //dispatch input event (since it will not be fired if we set the valeu directly)
            var inputEvent = new Event('input', {
                'bubbles': true,
                'cancelable': true
            });
            this._element.input.dispatchEvent(inputEvent);
            this.close({
                reason: "select"
            });
        }
    }

    evaluate() {
        var me = this;
        var value = this._element.input.value;

        if (value.length >= this._minChars && this._list.length > 0) {
            this.index = -1;
            // Populate list with options that match
            this._element.ul.innerHTML = "";

            this._suggestions = this._list
                .map(function(item) {
                    return new Suggestion(item, value);
                })
                .filter(function(item) {
                    return me.filter(item, value);
                })
                .sort(me.sort)
                .slice(0, me._maxItems);

            this._suggestions.forEach(function(text) {
                me._element.ul.appendChild(me.item(text.toString(), value));
            });

            if (this._element.ul.children.length === 0) {
                this.close({
                    reason: "nomatches"
                });
            } else {
                this.open();
            }
        } else {
            this.close({
                reason: "nomatches"
            });
        }
    }

    regExpEscape(s) {
        return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
    }

    siblingIndex(el) {
        for (var i = 0; el = el.previousElementSibling; i++);
        return i;
    }

    handleEvent(e) {
        switch (e.type) {
            case 'input':
                this.onInput(e);
                break;
            case 'blur':
                this.onBlur(e);
                break;
            case 'keydown':
                this.onKeyDown(e);
                break;
            case 'mousedown':
                this.onMouseDown(e);
                break;
        }
    }

    onInput(e) {
        this.evaluate();
    }

    onBlur(e) {
        this.close({
            reason: 'blur'
        });
    }

    onKeyDown(e) {
        var c = e.keyCode;

        // If the dropdown `ul` is in view, then act on keydown for the following keys:
        // Enter / Esc / Up / Down
        if (this.opened) {
            if (c === 13 && this.selected) { // Enter
                e.preventDefault();
                this.select();
            } else if (c === 27) { // Esc
                this.close({
                    reason: "esc"
                });
            } else if (c === 38 || c === 40) { // Down/Up arrow
                e.preventDefault();
                this[c === 38 ? "previous" : "next"]();
            }
        }
    }

    onMouseDown(e) {
        var li = e.target;

        if (li !== this._element.ul) {

            while (li && !/li/i.test(li.nodeName)) {
                li = li.parentNode;
            }

            if (li && e.button === 0) { // Only select on left click
                e.preventDefault();
                this.select(li, e.target);
            }
        }
    }

    //Overwrite for different behaviour
    sort(a, b) {
        if (a.length !== b.length) {
            return a.length - b.length;
        }

        return a < b ? -1 : 1;
    }

    filter(text, input) {
        return this.filterStartsWith(text, input);
    }

    item(text, input) {
        var html = input === '' ? text : text.replace(RegExp(this.regExpEscape(input.trim()), "gi"), "<mark>$&</mark>");
        var item = document.createElement('li');
        item.setAttribute('aria-selected', 'false');
        item.innerHTML = html;
        return item;
    }

    replace(text) {
        this._element.input.value = text.value;
    }

    //Static awesomplete methods and variables
    filterContains(text, input) {
        return RegExp(this.regExpEscape(input.trim()), "i").test(text);
    }

    filterStartsWith(text, input) {
        return RegExp("^" + this.regExpEscape(input.trim()), "i").test(text);
    }

}

class Suggestion {
    constructor(data) {
        var o = Array.isArray(data) ?
            {
                label: data[0],
                value: data[1]
            } :
            typeof data === "object" && "label" in data && "value" in data ? data : {
                label: data,
                value: data
            };

        this.label = o.label || o.value;
        this.value = o.value;
    }

    get length() {
        return this.label.length;
    }
}

Suggestion.prototype.toString = Suggestion.prototype.valueOf = function() {
    return "" + this.label;
};

module.exports = AutocompleteInput;
