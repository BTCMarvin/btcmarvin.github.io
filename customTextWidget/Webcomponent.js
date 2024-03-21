(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
    .container {
        display: flex; /* Establishes a flex container */
        flex-direction: column; /* Stacks flex items vertically */
        height: 100%; /* Uses 100% of the available height */
    }

    .editable-textfield {
        flex-grow: 1; /* Allows the text field to fill available space */
        overflow-y: auto; /* Ensures content scrolls within the text field */
        padding: 10px;
        margin: 0; /* Removes default margins */
        border: 1px solid #ccc;
        background-color: white;
    }

    .button-container {
        /* Auto-calculates height based on content, ensuring it adapts to variable space */
        display: flex; /* Ensures buttons are in a row */
        padding: 10px; /* Provides spacing around buttons */
        justify-content: flex-start; /* Aligns buttons to the start */
        background: #f8f9fa; /* Differentiates the button container visually */
    }

    .format-action {
        margin-right: 10px;
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
    }
</style>
<div class="container">
    <div class="editable-textfield" contenteditable="true"></div>
    <div class="button-container">
        <button class="format-action" data-style="bold">B</button>
        <button class="format-action" data-style="italic">I</button>
        <button class="format-action" data-style="underline">U</button>
    </div>
</div>
    `;

    class CustomTextField extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({mode: "open"});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._editableDiv = this._shadowRoot.querySelector('.editable-textfield');
            this._buttons = this._shadowRoot.querySelectorAll('.format-action');

            this._props = {};
            this._attachEventHandlers();
        }

        _attachEventHandlers() {
            this._buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const style = button.getAttribute('data-style');
                    document.execCommand(style, false, null);
                    this._editableDiv.focus(); // Refocus on editable div to continue typing

                    // Dispatch a custom event for format change
                    this.dispatchEvent(new CustomEvent('onFormatChange', { detail: { style: style } }));
                });
            });

            this._editableDiv.addEventListener('blur', () => {
                this._onChange();
            });
        }

        _onChange() {
            // Dispatch custom event when the component loses focus
            this.dispatchEvent(new CustomEvent('onChange', { detail: { value: this.getValue() } }));
        }

        getValue() {
            // Return just the text content, stripping out HTML tags
            return this._editableDiv.innerHTML;
        }

        setValue(htmlValue) {
            this._editableDiv.innerHTML = htmlValue;
        }

        onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
            console.log(changedProperties);
            const buttonDiv = this._shadowRoot.querySelector(".button-container");
			if ("mode" in changedProperties) {
                console.log(changedProperties["mode"]);
				if(changedProperties["mode"] == "input"){
                    buttonDiv.style.display = "block";
                    this._editableDiv.style.pointerEvents = "all";
                }else if (changedProperties["mode"] == "output") {
                    buttonDiv.style.display = "none";
                    this._editableDiv.style.pointerEvents = "none";
                }
			}
			
		}
        
    }

    customElements.define('custom-textfield', CustomTextField);
})();