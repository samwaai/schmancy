require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-ZzkXQTFA.cjs`),t=require(`./decorate-F9CuyeHg.cjs`);require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends e.t(r.css`
	:host {
		display: block;
	}
	iframe {
		border: 0;
		width: 100%;
	}
`){constructor(...e){super(...e),this.html=``,this.css=``,this.baseCss=`html,body{margin:0;padding:0;overflow:hidden;background:#fff;color:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.6;word-wrap:break-word;overflow-wrap:break-word}
body{padding:16px}
p{margin:0 0 1em}p:last-child{margin-bottom:0}
ul,ol{margin:0 0 1em;padding-left:1.5em}li{margin-bottom:.25em}
h1,h2,h3,h4{margin:0 0 .5em;line-height:1.3}h1{font-size:1.5em}h2{font-size:1.25em}h3{font-size:1.1em}h4{font-size:1em}
hr{border:none;border-top:1px solid #dadce0;margin:1em 0}
img{max-width:100%;height:auto}
table{border-collapse:collapse;max-width:100%}td,th{padding:4px 8px;border:1px solid #dadce0}
blockquote{margin:0 0 1em;padding:.5em 0 .5em 1em;border-left:3px solid #dadce0;color:#5f6368}
pre{background:#f5f5f5;padding:.75em;border-radius:4px;overflow-x:auto;font-size:.9em}
code{background:#f5f5f5;padding:.1em .3em;border-radius:3px;font-size:.9em}`,this.sandbox=`allow-same-origin allow-popups`,this.minHeight=60,this._height=60,this._srcdoc=``}willUpdate(e){(e.has(`html`)||e.has(`css`)||e.has(`baseCss`))&&(this._srcdoc=this.html?this.buildSrcdoc():``,this._height=this.minHeight)}buildSrcdoc(){return`<!DOCTYPE html><html><head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<base target="_blank">\n<style>${this.css?`${this.baseCss}\n${this.css}`:this.baseCss}</style></head><body>${this.html}</body></html>`}onLoad(e){let t=e.target;try{let e=t.contentDocument;if(!e)return;this._height=Math.max(e.documentElement.scrollHeight,this.minHeight)}catch{this._height=Math.max(200,this.minHeight)}}render(){return this.html?r.html`<iframe
			.srcdoc=${this._srcdoc}
			sandbox=${this.sandbox}
			style="height:${this._height}px;min-height:${this.minHeight}px;overflow:hidden"
			@load=${this.onLoad}
		></iframe>`:r.html``}};t.t([(0,n.property)({type:String})],i.prototype,`html`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`css`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`baseCss`,void 0),t.t([(0,n.property)({type:String})],i.prototype,`sandbox`,void 0),t.t([(0,n.property)({type:Number})],i.prototype,`minHeight`,void 0),t.t([(0,n.state)()],i.prototype,`_height`,void 0);var a=i=t.t([(0,n.customElement)(`schmancy-iframe`)],i);Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return a}});