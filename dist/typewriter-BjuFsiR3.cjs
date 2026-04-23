require(`./chunk-BCfY8kxB.cjs`);const e=require(`./tailwind.mixin-ZzkXQTFA.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./litElement.mixin-Bx9Avv0M.cjs`);require(`./mixins.cjs`);const r=require(`./delay-aQRihOO4.cjs`),i=require(`./hashContent-CI39BY-_.cjs`),a=require(`./intersection-MvbRovUz.cjs`);let o=require(`lit/decorators.js`),s=require(`lit`);var c=e=>Array.isArray(e),l=e=>c(e)?e:[e],u=`data-typeit-id`,d=`ti-cursor`,f={started:!1,completed:!1,frozen:!1,destroyed:!1},p={breakLines:!0,cursor:{autoPause:!0,autoPauseDelay:500,animation:{frames:[0,0,1].map(e=>({opacity:e})),options:{iterations:1/0,easing:`steps(2, start)`,fill:`forwards`}}},cursorChar:`|`,cursorSpeed:1e3,deleteSpeed:null,html:!0,lifeLike:!0,loop:!1,loopDelay:750,nextStringDelay:750,speed:100,startDelay:250,startDelete:!1,strings:[],waitUntilVisible:!1,beforeString:()=>{},afterString:()=>{},beforeStep:()=>{},afterStep:()=>{},afterComplete:()=>{}},m=`[${u}]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}`,h=e=>document.createElement(e),g=e=>document.createTextNode(e),_=(e,t=``)=>{let n=h(`style`);n.id=t,n.appendChild(g(e)),document.head.appendChild(n)},v=e=>(c(e)||(e=[e/2,e/2]),e),y=(e,t)=>Math.abs(Math.random()*(e+t-(e-t))+(e-t)),b=e=>e/2,x=e=>Array.from(e),S=e=>([...e.childNodes].forEach(e=>{if(e.nodeValue)return[...e.nodeValue].forEach(t=>{e.parentNode.insertBefore(g(t),e)}),void e.remove();S(e)}),e),C=e=>{let t=document.implementation.createHTMLDocument();return t.body.innerHTML=e,S(t.body)};function w(e,t=!1,n=!1){let r,i=e.querySelector(`.${d}`),a=document.createTreeWalker(e,NodeFilter.SHOW_ALL,{acceptNode:e=>{if(i&&n){if(e.classList?.contains(d))return NodeFilter.FILTER_ACCEPT;if(i.contains(e))return NodeFilter.FILTER_REJECT}return e.classList?.contains(d)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}}),o=[];for(;r=a.nextNode();)r.originalParent||=r.parentNode,o.push(r);return t?o.reverse():o}function T(e,t=!0){return t?w(C(e)):x(e).map(g)}var E=({index:e,newIndex:t,queueItems:n,cleanUp:r})=>{for(let i=e+1;i<t+1;i++)r(n[i][0])},D=e=>Number.isInteger(e),O=({queueItems:e,selector:t,cursorPosition:n,to:r})=>{if(D(t))return-1*t;let i=RegExp(`END`,`i`).test(r),a=t?[...e].reverse().findIndex(({char:e})=>{let n=e.parentElement,r=n.matches(t);return!(!i||!r)||r&&n.firstChild.isSameNode(e)}):-1;return a<0&&(a=i?0:e.length-1),a-n+ +!i},k=(e,t)=>Array(t).fill(e),A=e=>new Promise(t=>{requestAnimationFrame(async()=>{t(await e())})}),j=e=>e?.getAnimations().find(t=>t.id===e.dataset.tiAnimationId),M=({cursor:e,frames:t,options:n})=>{let r=e.animate(t,n);return r.pause(),r.id=e.dataset.tiAnimationId,A(()=>{A(()=>{r.play()})}),r},N=e=>e.func?.call(null),P=async({index:e,queueItems:t,wait:n,cursor:r,cursorOptions:i})=>{let a=t[e][1],o=[],s=e,c=a,l=()=>c&&!c.delay,u=a.shouldPauseCursor()&&i.autoPause;for(;l();)o.push(c),l()&&s++,c=t[s]?t[s][1]:null;if(o.length)return await A(async()=>{for(let e of o)await N(e)}),s-1;let d,f=j(r);return f&&(d={...f.effect.getComputedTiming(),delay:u?i.autoPauseDelay:0}),await n(async()=>{f&&u&&f.cancel(),await A(()=>{N(a)})},a.delay),await(({cursor:e,options:t,cursorOptions:n})=>{if(!e||!n)return;let r,i=j(e);i&&(t.delay=i.effect.getComputedTiming().delay,r=i.currentTime,i.cancel());let a=M({cursor:e,frames:n.animation.frames,options:t});return r&&(a.currentTime=r),a})({cursor:r,options:d,cursorOptions:i}),e},F=e=>`value`in e,I=e=>typeof e==`function`?e():e,L=(e,t=document,n=!1)=>t[`querySelector`+(n?`All`:``)](e),R=(e,t)=>Object.assign({},e,t),z={"font-family":``,"font-weight":``,"font-size":``,"font-style":``,"line-height":``,color:``,transform:`translateX(-.125em)`},B=class{element;timeouts;cursorPosition;predictedCursorPosition;statuses={started:!1,completed:!1,frozen:!1,destroyed:!1,firing:!1};opts;id;queue;cursor;flushCallback=null;unfreeze=()=>{};constructor(e,t={}){var n;this.opts=R(p,t),this.element=typeof(n=e)==`string`?L(n):n,this.timeouts=[],this.cursorPosition=0,this.unfreeze=()=>{},this.predictedCursorPosition=null,this.statuses=R({},f),this.id=Math.random().toString().substring(2,9),this.queue=function(e){let t=function(e){return l(e).forEach(e=>a.set(Symbol(e.char?.innerText),n({...e}))),this},n=e=>(e.shouldPauseCursor=function(){return!!(this.typeable||this.cursorable||this.deletable)},e),r=()=>a,i=()=>Array.from(a.values()),a=new Map;return t(e),{add:t,set:function(e,t){let r=[...a.keys()];a.set(r[e],n(t))},wipe:function(){a=new Map,t(e)},done:(e,t=!1)=>t?a.delete(e):a.get(e).done=!0,reset:function(){a.forEach(e=>delete e.done)},destroy:e=>a.delete(e),getItems:(e=!1)=>e?i():i().filter(e=>!e.done),getQueue:r,getTypeable:()=>i().filter(e=>e.typeable),getPendingQueueItems:()=>{let e=[];for(let[,t]of r())t.done||e.push(t);return e}}}([{delay:this.opts.startDelay}]),this.#p(t),this.cursor=this.#h(),this.element.dataset.typeitId=this.id,_(m),this.opts.strings.length&&this.#f()}go(){return this.statuses.started?this:(this.#o(),this.opts.waitUntilVisible?(e=this.element,t=this.#t.bind(this),new IntersectionObserver((n,r)=>{n.forEach(n=>{n.isIntersecting&&(t(),r.unobserve(e))})},{threshold:1}).observe(e),this):(this.#t(),this));var e,t}destroy(e=!0){this.timeouts=(this.timeouts.forEach(clearTimeout),[]),I(e)&&this.cursor&&this.#y(this.cursor),this.statuses.destroyed=!0}reset(e){!this.is(`destroyed`)&&this.destroy(),e?(this.queue.wipe(),e(this)):this.queue.reset(),this.cursorPosition=0;for(let e in this.statuses)this.statuses[e]=!1;return this.element[this.#s()?`value`:`innerHTML`]=``,this}is=function(e){return this.statuses[e]};type(e,t={}){e=I(e);let{instant:n}=t,r=this.#u(t),i=T(e,this.opts.html).map(e=>{return{func:()=>this.#_(e),char:e,delay:n||(t=e,/<(.+)>(.*?)<\/(.+)>/.test(t.outerHTML))?0:this.#b(),typeable:e.nodeType===Node.TEXT_NODE};var t}),a=[r[0],{func:async()=>await this.opts.beforeString(e,this)},...i,{func:async()=>await this.opts.afterString(e,this)},r[1]];return this.#c(a,t)}break(e={}){return this.#c({func:()=>this.#_(h(`BR`)),typeable:!0},e)}move(e,t={}){e=I(e);let n=this.#u(t),{instant:r,to:i}=t,a=O({queueItems:this.queue.getTypeable(),selector:e===null?``:e,to:i,cursorPosition:this.#x}),o=a<0?-1:1;return this.predictedCursorPosition=this.#x+a,this.#c([n[0],...k({func:()=>this.#n(o),delay:r?0:this.#b(),cursorable:!0},Math.abs(a)),n[1]],t)}exec(e,t={}){let n=this.#u(t);return this.#c([n[0],{func:()=>e(this)},n[1]],t)}options(e,t={}){return e=I(e),this.#d(e),this.#c({},t)}pause(e,t={}){return this.#c({delay:I(e)},t)}delete(e=null,t={}){e=I(e);let n=this.#u(t),r=e,{instant:i,to:a}=t,o=this.queue.getTypeable(),s=r===null?o.length:D(r)?r:O({queueItems:o,selector:r,cursorPosition:this.#x,to:a});return this.#c([n[0],...k({func:this.#v.bind(this),delay:i?0:this.#b(1),deletable:!0},s),n[1]],t)}freeze(){this.statuses.frozen=!0}flush(e=null){return this.flushCallback=e||this.flushCallback,this.statuses.firing||(this.#o(),this.#t(!1).then(()=>{if(this.queue.getPendingQueueItems().length>0)return this.flush();this.flushCallback(),this.flushCallback=null})),this}getQueue(){return this.queue}getOptions(){return this.opts}updateOptions(e){return this.#d(e)}getElement(){return this.element}empty(e={}){return this.#c({func:this.#e.bind(this)},e)}async#e(){this.#s()?this.element.value=``:this.#w.forEach(this.#y.bind(this))}async#t(e=!0){this.statuses.started=!0,this.statuses.firing=!0;let t=t=>{this.queue.done(t,!e)};try{let n=[...this.queue.getQueue()];for(let e=0;e<n.length;e++){let[r,i]=n[e];if(!i.done){if(!i.deletable||i.deletable&&this.#w.length){let r=await this.#i(e,n);E({index:e,newIndex:r,queueItems:n,cleanUp:t}),e=r}t(r)}}if(!e)return this.statuses.firing=!1,this;if(this.statuses.completed=!0,this.statuses.firing=!1,await this.opts.afterComplete(this),!this.opts.loop)throw``;let r=this.opts.loopDelay;this.#a(async()=>{await this.#r(r[0]),this.#t()},r[1])}catch{}return this.statuses.firing=!1,this}async#n(e){var t,n,r;this.cursorPosition=(t=e,n=this.cursorPosition,r=this.#w,Math.min(Math.max(n+t,0),r.length)),((e,t,n)=>{let r=t[n-1],i=L(`.${d}`,e);(e=r?.parentNode||e).insertBefore(i,r||null)})(this.element,this.#w,this.cursorPosition)}async#r(e){let t=this.#x;t&&await this.#n({value:t});let n=this.#w.map(e=>[Symbol(),{func:this.#v.bind(this),delay:this.#b(1),deletable:!0,shouldPauseCursor:()=>!0}]);for(let e=0;e<n.length;e++)await this.#i(e,n);this.queue.reset(),this.queue.set(0,{delay:e})}#i(e,t){return P({index:e,queueItems:t,wait:this.#a.bind(this),cursor:this.cursor,cursorOptions:this.opts.cursor})}async#a(e,t,n=!1){this.statuses.frozen&&await new Promise(e=>{this.unfreeze=()=>{this.statuses.frozen=!1,e()}}),n||await this.opts.beforeStep(this),await((e,t,n)=>new Promise(r=>{n.push(setTimeout(async()=>{await e(),r()},t||0))}))(e,t,this.timeouts),n||await this.opts.afterStep(this)}async#o(){if(!this.#s()&&this.cursor&&this.element.appendChild(this.cursor),this.#C){((e,t)=>{let n=`[${u}='${e}'] .${d}`,r=getComputedStyle(t);_(`${n} { display: inline-block; width: 0; ${Object.entries(z).reduce((e,[t,n])=>`${e} ${t}: var(--ti-cursor-${t}, ${n||r[t]});`,``)} }`,e)})(this.id,this.element),this.cursor.dataset.tiAnimationId=this.id;let{animation:e}=this.opts.cursor,{frames:t,options:n}=e;M({frames:t,cursor:this.cursor,options:{duration:this.opts.cursorSpeed,...n}})}}#s(){return F(this.element)}#c(e,t){return this.queue.add(e),this.#l(t),this}#l(e={}){let t=e.delay;t&&this.queue.add({delay:t})}#u(e={}){return[{func:()=>this.#d(e)},{func:()=>this.#d(this.opts)}]}async#d(e){this.opts=R(this.opts,e)}#f(){let e=this.opts.strings.filter(e=>!!e);e.forEach((t,n)=>{if(this.type(t),n+1===e.length)return;let r=this.opts.breakLines?[{func:()=>this.#_(h(`BR`)),typeable:!0}]:k({func:this.#v.bind(this),delay:this.#b(1)},this.queue.getTypeable().length);this.#g(r)})}#p=e=>{this.opts.cursor=(e=>{if(typeof e==`object`){let t={},{frames:n,options:r}=p.cursor.animation;return t.animation=e.animation||{},t.animation.frames=e.animation?.frames||n,t.animation.options=R(r,e.animation?.options||{}),t.autoPause=e.autoPause??p.cursor.autoPause,t.autoPauseDelay=e.autoPauseDelay||p.cursor.autoPauseDelay,t}return!0===e?p.cursor:e})(e.cursor??p.cursor),this.opts.strings=this.#m(l(this.opts.strings)),this.opts=R(this.opts,{html:!this.#S&&this.opts.html,nextStringDelay:v(this.opts.nextStringDelay),loopDelay:v(this.opts.loopDelay)})};#m(e){let t=this.element.innerHTML;return t?(this.element.innerHTML=``,this.opts.startDelete?(this.element.innerHTML=t,S(this.element),this.#g(k({func:this.#v.bind(this),delay:this.#b(1),deletable:!0},this.#w.length)),e):(n=t,n.replace(/<!--(.+?)-->/g,``).trim().split(/<br(?:\s*?)(?:\/)?>/)).concat(e)):e;var n}#h(){if(this.#S)return null;let e=h(`span`);return e.className=d,this.#C?(e.innerHTML=C(this.opts.cursorChar).innerHTML,e):(e.style.visibility=`hidden`,e)}#g(e){let t=this.opts.nextStringDelay;this.queue.add([{delay:t[0]},...e,{delay:t[1]}])}#_(e){((e,t)=>{if(F(e))return void(e.value=`${e.value}${t.textContent}`);t.innerHTML=``;let n=(r=t.originalParent,/body/i.test(r?.tagName)?e:t.originalParent||e);var r;let i=L(`.`+d,n)||null;i&&i.parentElement!==n&&(n=i.parentElement),n.insertBefore(t,i)})(this.element,e)}#v(){this.#w.length&&(this.#S?this.element.value=this.element.value.slice(0,-1):this.#y(this.#w[this.cursorPosition]))}#y(e){((e,t)=>{if(!e)return;let n=e.parentNode;(n.childNodes.length>1||n.isSameNode(t)?e:n).remove()})(e,this.element)}#b(e=0){return function(e){let{speed:t,deleteSpeed:n,lifeLike:r}=e;return n=n===null?t/3:n,r?[y(t,b(t)),y(n,b(n))]:[t,n]}(this.opts)[e]}get#x(){return this.predictedCursorPosition??this.cursorPosition}get#S(){return F(this.element)}get#C(){return!!this.opts.cursor&&!this.#S}get#w(){return e=this.element,F(e)?x(e.value):w(e,!0).filter(e=>!(e.childNodes.length>0));var e}},V=class extends n.t(s.css`
	:host {
		display: inline-block;
	}

	#typewriter {
		position: relative;
	}

	/* Enhanced cursor with glow effect */
	#typewriter :global(.ti-cursor) {
		animation: cursor-pulse 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		color: currentColor;
		filter: drop-shadow(0 0 8px currentColor);
	}

	@keyframes cursor-pulse {
		0%, 100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.3;
			transform: scale(0.95);
		}
	}

	/* Character entrance animation */
	#typewriter :global(.ti-container *) {
		animation: char-entrance 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
	}

	@keyframes char-entrance {
		0% {
			opacity: 0;
			transform: scale(0.3) translateY(10px);
			filter: blur(4px);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.1) translateY(-2px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
			filter: blur(0);
		}
	}

	/* Subtle character wobble on appear */
	#typewriter :global(.ti-container *:nth-child(odd)) {
		animation: char-entrance 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
		           char-wobble 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards;
	}

	@keyframes char-wobble {
		0%, 100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(2deg);
		}
		75% {
			transform: rotate(-2deg);
		}
	}

	/* Deletion animation - fade out and scale down */
	#typewriter :global(.ti-container .deleting) {
		animation: char-delete 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
	}

	@keyframes char-delete {
		0% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
		50% {
			opacity: 0.5;
			transform: scale(0.8) translateY(-3px);
		}
		100% {
			opacity: 0;
			transform: scale(0.4) translateY(-8px);
			filter: blur(3px);
		}
	}

	/* Gradient text effect on typed text */
	#typewriter :global(.ti-container) {
		background: linear-gradient(
			90deg,
			currentColor 0%,
			currentColor 70%,
			transparent 100%
		);
		-webkit-background-clip: text;
		background-clip: text;
		animation: gradient-shift 3s ease-in-out infinite;
	}

	@keyframes gradient-shift {
		0%, 100% {
			filter: brightness(1) saturate(1);
		}
		50% {
			filter: brightness(1.15) saturate(1.2);
		}
	}

	/* Smooth transitions for all text */
	#typewriter * {
		transition: opacity 0.15s ease-out, transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
`){constructor(...e){super(...e),this.speed=35,this.delay=0,this.autoStart=!0,this.cursorChar=``,this.deleteSpeed=20,this.once=!0,this.loop=!1,this.cyclePause=1500,this.typeItInstance=null,this.sessionKey=``}disconnectedCallback(){super.disconnectedCallback(),this._destroyTypeIt()}_startTyping(){if(this._destroyTypeIt(),this.sessionKey=this.generateSessionKey(),this.once&&sessionStorage.getItem(this.sessionKey)===`true`)return void this.shadowRoot?.querySelector(`slot`)?.removeAttribute(`hidden`);if(!this.typewriterContainer)return;let e={speed:this.speed,startDelay:this.delay,cursor:!!this.cursorChar,cursorChar:this.cursorChar,deleteSpeed:this.deleteSpeed,loop:this.loop,afterComplete:()=>{if(this.once&&!this.loop)try{sessionStorage.setItem(this.sessionKey,`true`)}catch{}this.dispatchEvent(new CustomEvent(`typeit-complete`,{bubbles:!0,composed:!0})),this.loop||this.typewriterContainer.style.setProperty(`--ti-cursor-display`,`none`)}};this.typeItInstance=new B(this.typewriterContainer,e),this._getSlottedNodes.forEach(e=>{if(e.nodeType===Node.TEXT_NODE){let t=e.textContent||``;t.trim()&&this.typeItInstance?.type(t)}else e instanceof HTMLElement&&this._processCustomElement(e)}),a.t(this.shadowRoot?.host).subscribe(()=>{this.typeItInstance?.go()})}generateSessionKey(){let e=this._getSlottedElements.map(e=>e.outerHTML).join(``);return this.once?i.t(e):``}_destroyTypeIt(){if(this.typeItInstance){try{this.typeItInstance.destroy()}catch{}this.typeItInstance=null}}_processCustomElement(e){let t=e.getAttribute(`action`),n=e.getAttribute(`value`),r=e.getAttribute(`cycle`);if(r){let t=r.split(`|`).map(e=>e.trim());this._processCycle(t,e);return}switch(t){case`pause`:this.typeItInstance?.pause(parseInt(n||`0`,10));break;case`delete`:this.typeItInstance?.delete(parseInt(n||`0`,10));break;default:e.tagName===`P`&&this.typeItInstance?.break(),this.typeItInstance?.type(e.textContent||``)}}_processCycle(e,t){if(e.length===0)return;let n=t.getAttribute(`pause`),r=n?parseInt(n,10):this.cyclePause;e.forEach((t,n)=>{this.typeItInstance?.type(t),(n<e.length-1||this.loop)&&this.typeItInstance?.pause(r),(n<e.length-1||this.loop)&&this.typeItInstance?.delete(t.length)})}render(){return s.html`<div id="typewriter" aria-live="polite"></div>

			<div class="typewriter">
				<slot
					hidden
					@slotchange=${()=>{this._startTyping()}}
				></slot>
			</div> `}};t.t([(0,o.property)({type:Number})],V.prototype,`speed`,void 0),t.t([e.a({context:r.n,subscribe:!0}),(0,o.property)({type:Number})],V.prototype,`delay`,void 0),t.t([(0,o.property)({type:Boolean})],V.prototype,`autoStart`,void 0),t.t([(0,o.property)({type:String})],V.prototype,`cursorChar`,void 0),t.t([(0,o.property)({type:Number})],V.prototype,`deleteSpeed`,void 0),t.t([(0,o.property)({type:Boolean})],V.prototype,`once`,void 0),t.t([(0,o.property)({type:Boolean})],V.prototype,`loop`,void 0),t.t([(0,o.property)({type:Number})],V.prototype,`cyclePause`,void 0),t.t([(0,o.query)(`#typewriter`)],V.prototype,`typewriterContainer`,void 0),t.t([(0,o.queryAssignedNodes)({flatten:!0})],V.prototype,`_getSlottedNodes`,void 0),t.t([(0,o.queryAssignedElements)({flatten:!0})],V.prototype,`_getSlottedElements`,void 0),V=t.t([(0,o.customElement)(`schmancy-typewriter`)],V),Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return V}});