(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Select Mode</legend>
				<table>
					<tr>
						<td>Mode</td>
						<td>
							<select id="bps_mode">
								<option value="input">Input</option>
								<option value="output">Output</option>
							</select>
						</td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
			</fieldset>
		</form>
		<style>
		:host {
			display: block;
			padding: 1em 1em 1em 1em;
		}
		</style>
	`;

	class BoxBps extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							mode: this.mode
						}
					}
			}));
		}

		set mode(newMode) {
			this._shadowRoot.getElementById("bps_mode").value = newMode;
		}

		get mode() {
			return this._shadowRoot.getElementById("bps_mode").value;
		}
	}

	customElements.define("custom-textfield-bps", BoxBps);
})();