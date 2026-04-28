import { t as e } from "./tailwind.mixin-mdQR3BEO.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { customElement as n, query as r } from "lit/decorators.js";
import { html as i } from "lit";
var a = class extends e() {
	render() {
		return i`
			<schmancy-button
				@click=${() => {
			this.color.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 300 });
		}}
				variant="text"
			>
				<schmancy-icon id="color">palette</schmancy-icon>
			</schmancy-button>
		`;
	}
};
t([r("#color")], a.prototype, "color", void 0), a = t([n("schmancy-theme-button")], a);
