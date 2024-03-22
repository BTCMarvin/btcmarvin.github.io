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

    .format-action, .color-input, .reset-color {
        margin-right: 10px;
        padding: 5px 10px;
        border: none;
        cursor: pointer;
    }

    .format-action {
        background-color: #007bff;
        color: white;
    }

    .color-input {
        width: 100px;
    }

    .reset-color {
        background-color: #ff0000;
        color: white;
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

                });
            });

            this._editableDiv.addEventListener('blur', () => {
                this._onChange();
            });
        }

        _onChange() {
            // Dispatch custom event when the component loses focus
            this._props.value = this._editableDiv.innerHTML;
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
            if ( changedProperties.hasOwnProperty('value')) {
                this.setValue(changedProperties.value);
            }
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

        getBookmarkState() {
            const state = { htmlContent: this.getValue() };
            console.log('Saving state for bookmark:', state);
            return state;
        }
        
    
        // Method to apply a previously saved state
        applyBookmarkState(state) {
            if (state && state.htmlContent) {
                this.setValue(state.htmlContent);
            }
        }
        
    }

    customElements.define('custom-textfield', CustomTextField);
})();