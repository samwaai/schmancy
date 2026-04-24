import { t as e } from "./tailwind.mixin-H5Pn7vSJ.js";
import { t } from "./decorate-D_utPUsC.js";
import "./mixins.js";
import { r as n } from "./notification-ChAvNXf3.js";
import { customElement as r, property as i } from "lit/decorators.js";
import { css as a, html as o } from "lit";
import { unsafeHTML as s } from "lit/directives/unsafe-html.js";
var c = class extends e(a`:host { display: block }`) {
	constructor(...e) {
		super(...e), this.data = {}, this.highlightKeys = [], this.compact = !1;
	}
	highlightChanges(e, t) {
		let n = e;
		return t.forEach((e) => {
			let t = RegExp(`("${e}":\\s*)([^,\\n}]+)`, "g");
			n = n.replace(t, (e, t, n) => `${t}<span class="text-warning-default font-bold">${n}</span>`);
		}), n;
	}
	async copyJSON() {
		try {
			await navigator.clipboard.writeText(JSON.stringify(this.data, null, 2)), n.success("JSON copied to clipboard");
		} catch {
			n.error("Failed to copy JSON");
		}
	}
	render() {
		let e = JSON.stringify(this.data, null, this.compact ? 0 : 2), t = this.highlightKeys.length > 0 ? this.highlightChanges(e, this.highlightKeys) : e;
		return o`
			<div
				class="bg-surface-container rounded-lg p-2 font-mono overflow-auto cursor-pointer hover:bg-surface-container-high transition-colors"
				@click=${this.copyJSON}
			>
				<div class="flex items-center justify-between mb-1">
					<schmancy-icon size="12px" class="text-on-surface-variant">content_copy</schmancy-icon>
				</div>
				<pre class="text-[10px] leading-tight">${s(t)}</pre>
			</div>
		`;
	}
};
t([i({ type: Object })], c.prototype, "data", void 0), t([i({ type: Array })], c.prototype, "highlightKeys", void 0), t([i({ type: Boolean })], c.prototype, "compact", void 0), c = t([r("schmancy-json")], c);
export { c as SchmancyJson };
