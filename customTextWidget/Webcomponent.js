(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
    .container {
        display: flex;
        flex-direction: row; /* Horizontal layout */
        align-items: stretch; /* Stretch children to fill container height */
    }
    
    html, body, .container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden; /* Prevent scrollbars on the body */
    }
    
    .container {
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }
    
    .editable-textfield {
        flex-grow: 1;
        overflow: auto;
        margin: 0;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: white;
    }
    
    .button-container {
        display: flex;
        flex-direction: column;
        justify-content: start;
        padding-left: 10px;
    }
    
    .format-action {
        margin-bottom: 10px;
        cursor: pointer;
        padding: 5px 10px;
        background-color: #007bff;
        color: white;
        border: none;
        user-select: none;
    }
    
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
