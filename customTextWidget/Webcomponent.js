(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
    .editable-textfield {
        border: 1px solid #ccc;
        padding: 10px;
        margin-bottom: 10px;
        height: 150px; /* Adjust based on need */
        overflow: auto;
        width: 100%; /* Ensure it takes the full width of the container */
        background-color: white; /* Set background color to white */
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
    <div>
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

            // Add event listener for the editable div to handle blur event
            this._editableDiv.addEventListener('blur', () => {
                this.onChange();
            });
        }

        onChange() {
            // Dispatch custom event when the component loses focus
            this.dispatchEvent(new CustomEvent('onChange', { detail: { value: this.getValue() } }));
        }

        getValue() {
            return this._editableDiv.innerHTML;
        }
    }

    customElements.define('custom-textfield', CustomTextField);
})();