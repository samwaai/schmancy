require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-Bh58QnlW.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends e.t(){render(){return r.html`
			<schmancy-button
				@click=${()=>{this.color.animate([{transform:`rotate(0deg)`},{transform:`rotate(360deg)`}],{duration:300})}}
				variant="text"
			>
				<schmancy-icon id="color">palette</schmancy-icon>
			</schmancy-button>
		`}};t.t([(0,n.query)(`#color`)],i.prototype,`color`,void 0),i=t.t([(0,n.customElement)(`schmancy-theme-button`)],i);