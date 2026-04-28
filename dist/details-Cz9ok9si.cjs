require(`./chunk-CncqDLb2.cjs`);const e=require(`./tailwind.mixin-DRI1oTYQ.cjs`),t=require(`./decorate-F9CuyeHg.cjs`),n=require(`./surface.mixin-DxOi-xo0.cjs`);require(`./mixins.cjs`);const r=require(`./animation-CQRdLgzX.cjs`),i=require(`./reduced-motion-9RjNnhIg.cjs`),a=require(`./cursor-glow-Duw9jHmh.cjs`),o=require(`./magnetic-CVXEkYTA.cjs`);let s=require(`rxjs`),c=require(`rxjs/operators`),l=require(`lit/decorators.js`),u=require(`lit`),d=require(`lit/directives/ref.js`);var f=class extends n.t(e.t(u.css`
		:host {
			display: block;
			transition: box-shadow 400ms cubic-bezier(0.34, 1.2, 0.64, 1);
		}

		:host([overlay]) {
			position: relative;
		}

		:host([open]) {
			box-shadow:
				0 2px 12px -2px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 15%, transparent),
				0 8px 32px -8px color-mix(in srgb, var(--schmancy-sys-color-primary-default) 8%, transparent);
			z-index: 10;
		}

		details {
			background: inherit;
			color: inherit;
			border-radius: inherit;
		}

		summary::-webkit-details-marker {
			display: none;
		}

		summary {
			list-style: none;
			color: inherit;
		}

		/*
		 * Blackbird 2.1 — CSS-driven collapse/expand
		 *
		 * Single animation system: CSS grid transition handles height,
		 * coordinated opacity fade for buttery smooth feel.
		 * No competing Web Animations API on content.
		 */

		.content-wrapper {
			display: grid;
			grid-template-rows: 0fr;
			overflow: hidden;
			opacity: 0;
			transition:
				grid-template-rows 400ms cubic-bezier(0.34, 1.2, 0.64, 1),
				opacity 250ms ease;
		}

		/* Spring easing when linear() is supported */
		@supports (animation-timing-function: linear(0, 1)) {
			.content-wrapper {
				transition:
					grid-template-rows 400ms linear(
						0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%,
						0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50%, 1.015 54.8%,
						1.017 63.3%, 1.001
					),
					opacity 250ms ease;
			}
		}

		.content-wrapper[data-open='true'] {
			grid-template-rows: 1fr;
			opacity: 1;
		}

		.content-inner {
			min-height: 0;
			overflow: hidden;
		}

		/*
		 * Progressive Enhancement: ::details-content (Chrome 131+)
		 *
		 * When both ::details-content AND interpolate-size are supported,
		 * the browser handles height animation natively — including animated
		 * close via transition-behavior: allow-discrete on content-visibility.
		 * The grid wrapper becomes transparent (display: contents).
		 */
		@supports selector(::details-content) and (interpolate-size: allow-keywords) {
			:host {
				interpolate-size: allow-keywords;
			}

			.content-wrapper {
				display: contents;
			}

			details::details-content {
				block-size: 0;
				overflow-y: clip;
				opacity: 0;
				transition:
					block-size 400ms cubic-bezier(0.34, 1.2, 0.64, 1),
					opacity 250ms ease,
					content-visibility 400ms;
				transition-behavior: allow-discrete;
			}

			details[open]::details-content {
				block-size: auto;
				opacity: 1;
			}
		}

		@media (prefers-reduced-motion: reduce) {
			.content-wrapper {
				transition: none;
			}
			details::details-content {
				transition: none;
			}
		}
	`)){static{this.shadowRootOptions={...u.LitElement.shadowRootOptions,mode:`open`,delegatesFocus:!0}}get open(){return this._open$.value}set open(e){this._open$.value!==e&&this._open$.next(e)}constructor(){super(),this.summary=``,this.indicatorPlacement=`end`,this.hideIndicator=!1,this.indicatorRotate=90,this.locked=!1,this.overlay=!1,this.summaryPadding=`p-3`,this.contentPadding=`p-3`,this._open$=new s.BehaviorSubject(!1),this._indicatorRef=(0,d.createRef)(),this._contentRef=(0,d.createRef)(),this._indicatorIsOpen=!1,this._closing=!1,this._nativeAnim=typeof CSS<`u`&&!!CSS.supports?.(`selector(::details-content)`)&&!!CSS.supports?.(`interpolate-size`,`allow-keywords`),this._hasOpened=!1,this.type=`solid`,this.rounded=`all`}connectedCallback(){super.connectedCallback(),this._open$.pipe((0,c.distinctUntilChanged)(),(0,c.tap)(e=>{e&&!this._hasOpened&&(this._hasOpened=!0),this._animateIndicator(e),this._updateIndicatorSlot()}),(0,c.takeUntil)(this.disconnecting)).subscribe(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._closeSub?.unsubscribe()}render(){let e=this._open$.value,t=this.classMap({"w-full rounded-xl transition-shadow duration-200 ease-out":!0,"overflow-hidden":!this.overlay,"overflow-visible relative":this.overlay}),n=this.classMap({[this.summaryPadding]:!0,"select-none relative flex items-center gap-2 rounded-xl":!0,"transition-colors duration-150":!0,"ring-1 ring-inset ring-transparent":!0,"hover:bg-surface-on/5 active:bg-surface-on/8 hover:ring-outline-variant/40":!this.locked,"focus-visible:ring-2 focus-visible:ring-primary-default/50 focus-visible:ring-offset-1":!this.locked,"cursor-pointer group":!this.locked,"cursor-default":this.locked,"flex-row":this.indicatorPlacement===`start`,"flex-row-reverse":this.indicatorPlacement===`end`}),r=this.classMap({[this.contentPadding]:!0,"text-sm":!0,"absolute inset-x-0 bg-surface-lowest/55 backdrop-blur-[16px] shadow-2xl rounded-b-xl z-20 border border-surface-on/10":this.overlay});return u.html`
			<details ?open=${e} @toggle=${this._handleToggle} class=${t}>
				<summary ${this.locked?``:o.t({strength:2,radius:50})} ${this.locked?``:a.t({radius:250,intensity:.08})} class=${n} tabindex=${this.locked?-1:0} @click=${this._handleSummaryClick}>
					${this.hideIndicator?``:u.html`
								<span
									${(0,d.ref)(this._indicatorRef)}
									class="flex items-center justify-center w-5 h-5 rounded-full shrink-0 opacity-70 group-hover:opacity-100"
								>
									<slot name="indicator" @slotchange=${this._handleIndicatorSlotChange}>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											class="w-5 h-5"
											aria-hidden="true"
										>
											<path
												d="M9 6L15 12L9 18"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</slot>
								</span>
							`}

					<span class="flex-1 min-w-0">
						<slot name="summary">${this.summary}</slot>
					</span>

					<slot name="actions"></slot>
				</summary>

				<div
					${(0,d.ref)(this._contentRef)}
					class="content-wrapper"
					data-open=${e&&!this._closing}
					aria-hidden=${e?`false`:`true`}
				>
					<div class="content-inner">
						${this._hasOpened?u.html`
									<div class=${r}>
										<slot></slot>
										<slot name="details"></slot>
									</div>
								`:u.nothing}
					</div>
				</div>
			</details>
		`}_handleSummaryClick(e){e.target.closest(`[slot="actions"]`)||this.locked||this._closing?e.preventDefault():this._nativeAnim||this._open$.value&&(e.preventDefault(),this._startClose())}_handleToggle(e){e.stopPropagation();let t=this.shadowRoot?.querySelector(`details`);if(e.target!==t)return;let n=t.open;this._nativeAnim?this._open$.value!==n&&(this.open=n,this.dispatchScopedEvent(`toggle`,{open:n})):n&&this._open$.value!==n&&(this.open=n,this.dispatchScopedEvent(`toggle`,{open:n}))}_startClose(){this._closing=!0,this._closeSub?.unsubscribe(),this._contentRef.value?.setAttribute(`data-open`,`false`),this._animateIndicator(!1);let e=this._contentRef.value;e&&(this._closeSub=(0,s.fromEvent)(e,`transitionend`).pipe((0,c.filter)(e=>e.propertyName===`grid-template-rows`),(0,c.take)(1),(0,c.tap)(()=>{this._closing=!1,this.open=!1,this.dispatchScopedEvent(`toggle`,{open:!1})}),(0,c.takeUntil)(this.disconnecting)).subscribe())}_handleIndicatorSlotChange(e){e.target.assignedElements().forEach(e=>{e.setAttribute(`data-open`,String(this._open$.value))})}_updateIndicatorSlot(){let e=this.shadowRoot?.querySelector(`slot[name="indicator"]`);e&&e.assignedElements().forEach(e=>{e.setAttribute(`data-open`,String(this._open$.value))})}_animateIndicator(e){if(this._indicatorIsOpen===e)return;this._indicatorIsOpen=e;let t=this._indicatorRef.value;t&&!i.t.value&&(this._currentAnimation?.cancel(),this._currentAnimation=t.animate([{transform:`rotate(${e?`0deg`:`${this.indicatorRotate}deg`})`},{transform:`rotate(${e?`${this.indicatorRotate}deg`:`0deg`})`}],{duration:r.f.duration,easing:r.f.easingFallback,fill:`forwards`}))}};t.t([(0,l.property)()],f.prototype,`summary`,void 0),t.t([(0,l.property)({type:Boolean,reflect:!0})],f.prototype,`open`,null),t.t([(0,l.property)({attribute:`indicator-placement`,reflect:!0})],f.prototype,`indicatorPlacement`,void 0),t.t([(0,l.property)({type:Boolean,attribute:`hide-indicator`})],f.prototype,`hideIndicator`,void 0),t.t([(0,l.property)({type:Number,attribute:`indicator-rotate`})],f.prototype,`indicatorRotate`,void 0),t.t([(0,l.property)({type:Boolean,reflect:!0})],f.prototype,`locked`,void 0),t.t([(0,l.property)({type:Boolean,reflect:!0})],f.prototype,`overlay`,void 0),t.t([(0,l.property)({attribute:`summary-padding`})],f.prototype,`summaryPadding`,void 0),t.t([(0,l.property)({attribute:`content-padding`})],f.prototype,`contentPadding`,void 0),t.t([(0,l.state)()],f.prototype,`_hasOpened`,void 0);var p=f=t.t([(0,l.customElement)(`schmancy-details`)],f);Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return p}});