(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
    <style>
        .editable-textfield {
            border: 1px solid #ccc;
            padding: 10px;
            /* Adjust the bottom margin or padding to leave space for the button container */
            margin-bottom: 50px; /* Adjust based on the height of your button container */
            overflow: auto;
            width: 100%; /* Ensure it takes the full width of the container */
            background-color: white; /* Explicitly set background to white */
            position: absolute; /* Make the textfield use absolute positioning */
            top: 0; /* Align to the top */
            bottom: 50px; /* Leave space for the buttons */
        }

        .button-container {
            height: 50px; /* Set a specific height for your button container */
            position: absolute; /* Position it absolutely relative to its nearest positioned ancestor */
            bottom: 0; /* Align to the bottom */
            width: 100%; /* Ensure it takes the full width */
            background-color: #f8f9fa; /* Give it a background color to make it distinguishable */
            display: flex; /* Use flexbox for easy alignment */
            align-items: center; /* Center-align the items vertically */
            justify-content: start; /* Align the buttons to the start of the container */
            padding-left: 10px; /* Add some padding on the left */
        }

        .format-action {
            margin-right: 10px;
            cursor: pointer;
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            user-select: none; /* Prevent button text selection */
        }
    </style>
    <div class="editable-textfield" contenteditable="true"></div>
    <div class="button-container">
        <button class="format-action" data-style="bold">B</button>
        <button class="format-action" data-style="italic">I</button>
        <button class="format-action" data-style="underline">U</button>
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