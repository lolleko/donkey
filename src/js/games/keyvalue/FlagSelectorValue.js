
const BaseValue = require('./BaseValue');

class FlagSelectorValue extends BaseValue {

	constructor(value, parent, options) {
		super(value, parent);
		this._options = options;
		this.createElement();
		this.expanded = false;
	}

	createElement() {
		var container = document.createElement('div');
		container.classList.add('ValueContainer');
		container.classList.add('ValueFlagSelectorContainer');

		var button =  document.createElement('input');

		button.classList.add('ValueInput');
		button.classList.add('ValueFlagSelectorButton');
		button.type = 'text';
		button.value = this._value;

		button.addEventListener('click', this, false);
		button.addEventListener('input', this, false);

		container.appendChild(button);

		var items = document.createElement('div');
		items.classList.add('ValueFlagSelectorItems');
		items.style.display = 'none';

		container.appendChild(items);

		this._element = container;
		this._element.items = items;
		this._element.button = button;

		this.removeInvalidFlags();
		this.rebuildFlags();

	}

	rebuildFlags() {
		this.selected = this._element.button.value.replace(/\s+/g, '').split('|');

		this._element.items.innerHTML = '';

		for (var i = 0; i < this._options.flags.length; i++) {

			var flag = this._options.flags[i];

			var item = document.createElement('label');
			item.classList.add('ValueFlagSelectorItem');

			var itemCheckbox = document.createElement('input');
			itemCheckbox.classList.add('ValueFlagSelectorCheckBox');
			itemCheckbox.type = 'checkbox';
			itemCheckbox.value = flag;
			itemCheckbox.addEventListener('change', this, false);

			if (this.selected.includes(flag)) {
				itemCheckbox.checked = true;
			}

			item.appendChild(itemCheckbox);

			var itemLabel = document.createElement('span');
			itemLabel.classList.add('ValueFlagSelectorLabel');
			itemLabel.innerHTML = flag;

			item.appendChild(itemLabel);

			this._element.items.appendChild(item);
		}
	}

	removeInvalidFlags() {
		this.selected = this._element.button.value.replace(/\s+/g, '').split('|');

		//remove invalid flags
		for (var i = 0; i < this.selected.length; i++) {
			if (!this._options.flags.includes(this.selected[i])) {
				this.selected.splice(i, 1);
				this.changeValue();
				this._element.button.value = this._value;
			}
		}
	}

	changeValue() {
		var result = '';
		for (var i = 0; i < this.selected.length; i++) {
			if (i !== 0) {
				result = result + ' | ' + this.selected[i];
			} else {
				result = this.selected[i];
			}
		}
		this._value = result;
		super.changeValue(this._value);
	}

	handleEvent(e) {
		switch (e.type) {
			case 'click': this.onClick(e); break;
			case 'change': this.onChange(e); break;
			case 'input': this.onInput(e); break;
		}
	}

	onClick(e) {
		// Show/Hide drop down
		// TODO Make this less hacky
		if (e.target == this._element.button && e.currentTarget != document) {
			if (!this.expanded) {
				this._element.items.style = '';
				this.expanded = true;
				document.addEventListener('click', this, false);
			}
		} else if (e.target != this._element.items && !this._element.items.contains(e.target) && e.target != this._element.button) {
			this.expanded = false;
			this._element.items.style.display = 'none';
			document.removeEventListener('click', this, false);
			this.removeInvalidFlags();
			this.rebuildFlags();
		}
	}

	onChange(e) {
		if (e.target.checked) {
			this.selected.push(e.target.value);
			this.changeValue();
		} else {
			var i = this.selected.indexOf(e.target.value);
			this.selected.splice(i, 1);
			this.changeValue();
		}
		this._element.button.value = this._value;
	}

	onInput(e) {
		this.rebuildFlags();
		this.changeValue();
	}
}
module.exports = FlagSelectorValue;
