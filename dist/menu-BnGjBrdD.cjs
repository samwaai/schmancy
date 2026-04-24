require(`./chunk-BCfY8kxB.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-DeT3kAOS.cjs`);require(`./mixins.cjs`);const n=require(`./dialog-service-DXLGSshF.cjs`);let r=require(`lit/decorators.js`),i=require(`lit`);var a=class extends t.t(i.css`
	:host {
		display: block;
	}
`){render(){return i.html`
			<schmancy-list-item @click=${()=>n.t.dismiss()}>
				<slot></slot>
			</schmancy-list-item>
		`}};a=e.t([(0,r.customElement)(`schmancy-menu-item`)],a);var o=class extends t.t(i.css`
	:host {
		position: relative;
		display: flex;
	}
`){showMenu(e){let t=this.menuSlot?.assignedElements()||[];if(t.length===0)return;let r=document.createElement(`div`);t.forEach(e=>r.appendChild(e)),n.t.component(r,{position:e,hideActions:!0}).finally(()=>{t.forEach(e=>this.appendChild(e))})}render(){return i.html`
			<slot name="trigger" @click=${this.showMenu}>
				<slot name="button" @click=${this.showMenu}>
					<schmancy-icon-button>more_vert</schmancy-icon-button>
				</slot>
			</slot>
			<div hidden>
				<slot></slot>
			</div>
		`}};e.t([(0,r.query)(`slot:not([name])`)],o.prototype,`menuSlot`,void 0),o=e.t([(0,r.customElement)(`schmancy-menu`)],o);