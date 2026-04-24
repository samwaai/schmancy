import { t as e } from "./decorate-D_utPUsC.js";
import { t } from "./litElement.mixin-BuZ28ZzP.js";
import "./mixins.js";
import { t as n } from "./dialog-service-DH-tjPuE.js";
import { customElement as r, query as i } from "lit/decorators.js";
import { css as a, html as o } from "lit";
var s = class extends t(a`
	:host {
		display: block;
	}
`) {
	render() {
		return o`
			<schmancy-list-item @click=${() => n.dismiss()}>
				<slot></slot>
			</schmancy-list-item>
		`;
	}
};
s = e([r("schmancy-menu-item")], s);
var c = class extends t(a`
	:host {
		position: relative;
		display: flex;
	}
`) {
	showMenu(e) {
		let t = this.menuSlot?.assignedElements() || [];
		if (t.length === 0) return;
		let r = document.createElement("div");
		t.forEach((e) => r.appendChild(e)), n.component(r, {
			position: e,
			hideActions: !0
		}).finally(() => {
			t.forEach((e) => this.appendChild(e));
		});
	}
	render() {
		return o`
			<slot name="trigger" @click=${this.showMenu}>
				<slot name="button" @click=${this.showMenu}>
					<schmancy-icon-button>more_vert</schmancy-icon-button>
				</slot>
			</slot>
			<div hidden>
				<slot></slot>
			</div>
		`;
	}
};
e([i("slot:not([name])")], c.prototype, "menuSlot", void 0), c = e([r("schmancy-menu")], c);
