(function() {
    const template = document.createElement('template');
    template.innerHTML = `
    <style>
        #root div {
            margin: 0.5rem;
        }
        #textarea {
            padding: 0;
            width: 100%;
            height: 20rem;
        }
    </style>
    <div id="root" style="width: 100%; height: 100%;">
        <div>Mode</div>
        <div>
            <select id="mode">
                <option value="input">Input</option>
                <option value="output">Output</option>
            </select>
        </div>
            <button id="button">Apply</button>
        </div>
    </div>
    `;
  
    class Builder extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  
        this._button = this.shadowRoot.getElementById('button');
        this._button.addEventListener('click', () => {
          const mode = this.shadowRoot.getElementById('mode').value;
          this.dispatchEvent(new CustomEvent('propertiesChanged', {
            detail: {
              properties: {
                mode
              }
            }
          }));
        });
      }
  
      async onCustomWidgetBeforeUpdate(changedProps) {
      }
  
      async onCustomWidgetAfterUpdate(changedProps) {
        if ("mode" in changedProps) {
          this.shadowRoot.getElementById('mode').value = changedProps.mode;
        }
      }
    }
  
    customElements.define('custom-textfield-builder', Builder);
  })();
  