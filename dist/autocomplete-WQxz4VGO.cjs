require(`./chunk-BCfY8kxB.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./litElement.mixin-Bx9Avv0M.cjs`);require(`./mixins.cjs`);const n=require(`./search-C8eAOzBm.cjs`);require(`./input-chip-nghCxe9L.cjs`);let r=require(`rxjs`),i=require(`rxjs/operators`),a=require(`lit/directives/class-map.js`),o=require(`lit/decorators.js`),s=require(`lit`),c=require(`lit/directives/ref.js`),l=require(`lit/directives/repeat.js`),u=require(`lit/directives/when.js`);var d=class extends t.t(`:host{display:block;border:unset!important;line-height:unset!important;background:unset!important;padding:unset!important;font-size:unset!important;box-shadow:unset!important}:host:focus{box-shadow:unset!important}@keyframes onAutoFillStart{0%{}to{}}:-webkit-any(sch-input::part(input):-webkit-autofill,sch-input input:-webkit-autofill){animation-name:onAutoFillStart;animation-duration:1ms}:is(sch-input::part(input):autofill,sch-input input:autofill){animation-name:onAutoFillStart;animation-duration:1ms}`){static{this.formAssociated=!0}constructor(){super(),this._valueSet=!1,this._valuesSet=!1,this.required=!1,this.placeholder=``,this.label=``,this.name=``,this.maxHeight=`300px`,this.multi=!1,this.description=``,this.size=`md`,this.autocomplete=`off`,this.debounceMs=200,this.similarityThreshold=.3,this.error=!1,this.validationMessage=``,this._a11yId=`schmancy-autocomplete-${Math.random().toString(36).slice(2,10)}`,this._open=!1,this._inputValue=``,this._visibleOptionsCount=0,this._hasResults=!0,this._inputElementRef=(0,c.createRef)(),this._selectedValue$=new r.BehaviorSubject(``),this._selectedValues$=new r.BehaviorSubject([]),this._inputValue$=new r.BehaviorSubject(``);try{this.internals=this.attachInternals()}catch{this.internals=void 0}}get form(){return this.internals?.form??null}formResetCallback(){this.multi?this._selectedValues$.next([]):this._selectedValue$.next(``),this._inputValue=``,this._inputValue$.next(``),this.error=!1,this.validationMessage=``}formDisabledCallback(e){e?this.setAttribute(`disabled`,``):this.removeAttribute(`disabled`)}get values(){return[...this._selectedValues$.value]}set values(e){this._valuesSet=!0,this._selectedValues$.next(Array.isArray(e)?[...e]:[])}get value(){return this.multi?this._selectedValues$.value.join(`,`):this._selectedValue$.value}set value(e){if(this._valueSet=!0,this.multi){let t=e?e.split(`,`).map(e=>e.trim()).filter(Boolean):[],n=this._selectedValues$.value;JSON.stringify(t)!==JSON.stringify(n)&&this._selectedValues$.next(t)}else e!==this._selectedValue$.value&&(this._selectedValue$.next(e),this._updateInputDisplay())}connectedCallback(){super.connectedCallback(),this.id||=`sch-autocomplete-${Math.random().toString(36).slice(2,9)}`,this._setupAutocompleteLogic(),this._setupDocumentClickHandler()}_setupAutocompleteLogic(){(0,r.combineLatest)([this._selectedValue$,this._selectedValues$]).pipe((0,i.tap)(([e,t])=>{this._updateOptionSelection(e,t);let n=this.multi?t.join(`,`):e;if(this.internals?.setFormValue(n||null),this.required){let n=this.multi?t.length===0:!e;this.internals?.setValidity(n?{valueMissing:!0}:{},n?this.validationMessage||`Please select an option.`:void 0)}}),(0,i.takeUntil)(this.disconnecting)).subscribe(),this._inputValue$.pipe((0,i.distinctUntilChanged)(),(0,i.debounceTime)(this.debounceMs),(0,i.tap)(e=>{this._open&&this._filterOptions(e)}),(0,i.takeUntil)(this.disconnecting)).subscribe()}_setupOptionHandlers(){this._options.forEach((e,t)=>{e.setAttribute(`role`,`option`),e.tabIndex=-1,e.id||=`${this.id}-option-${t}`,e.onmousedown=e=>{e.preventDefault()},e.onclick=t=>{t.stopPropagation(),this._selectOption(e)}})}_updateOptionSelection(e,t){this._options.forEach(n=>{n.selected=this.multi?t.includes(n.value):n.value===e,n.setAttribute(`aria-selected`,String(n.selected))})}_filterOptions(e){let t=e.trim();if(t){let e=this._options.map(e=>{let r=e.label||e.textContent||``,i=e.value,a=n.t(t,r),o=n.t(t,i);return{option:e,score:Math.max(1.1*a,o)}});e.sort((e,t)=>t.score-e.score);let r=0;e.forEach((e,t)=>{let{option:n,score:i}=e;i<this.similarityThreshold?n.hidden=!0:(n.hidden=!1,r++,n.style.order=String(t))}),this._visibleOptionsCount=r,this._hasResults=r>0}else this._options.forEach(e=>{e.hidden=!1,e.style.order=`0`}),this._visibleOptionsCount=this._options.length,this._hasResults=!0;this._announceToScreenReader(this._visibleOptionsCount>0?`${this._visibleOptionsCount} option${this._visibleOptionsCount===1?``:`s`} available.`:`No results found.`)}_openDropdown(){this._open=!0,this._filterOptions(this._inputValue)}_selectOption(e){if(this.multi){let t=this._selectedValues$.value,n=t.indexOf(e.value)>-1?t.filter(t=>t!==e.value):[...t,e.value];this._selectedValues$.next(n),this._announceToScreenReader(n.length>0?`Selected: ${this._getSelectedLabels().join(`, `)}`:`No options selected`),this._fireChangeEvent()}else this._selectedValue$.next(e.value),this._open=!1,this._fireChangeEvent(),this._inputValue=e.label||e.textContent||``,this._inputValue$.next(this._inputValue),this._announceToScreenReader(`Selected: ${e.label||e.textContent}`)}_setupDocumentClickHandler(){let e=e=>{if(!this._open)return;let t=e.composedPath();t.includes(this)||this._options.some(e=>t.includes(e))||(this._open=!1,this._updateInputDisplay())};document.addEventListener(`click`,e),this.disconnecting.pipe((0,i.take)(1)).subscribe(()=>{document.removeEventListener(`click`,e)})}_updateInputDisplay(){if(this.multi)return;let e=this._selectedValue$.value,t=this._options.find(t=>t.value===e);this._inputValue=t&&(t.label||t.textContent)||``,this._inputValue$.next(this._inputValue),this._inputElementRef.value&&(this._inputElementRef.value.value=this._inputValue)}_getSelectedLabels(){return this._options.filter(e=>this.multi?this._selectedValues$.value.includes(e.value):e.value===this._selectedValue$.value).map(e=>e.label||e.textContent||``)}_announceToScreenReader(e){let t=this.shadowRoot?.querySelector(`#live-status`);t&&(t.textContent=e)}_fireChangeEvent(){let e={value:this.value};this.multi&&(e.values=[...this._selectedValues$.value]),this.dispatchEvent(new CustomEvent(`change`,{detail:e,bubbles:!0,composed:!0}))}checkValidity(){return!this.required||(this.multi?this._selectedValues$.value.length>0:!!this._selectedValue$.value)}reportValidity(){return this._inputElementRef.value?this._inputElementRef.value.reportValidity():this.checkValidity()}firstUpdated(){this._setupOptionHandlers(),this._updateInputDisplay(),(this.shadowRoot?.querySelector(`slot`))?.addEventListener(`slotchange`,()=>{this._setupOptionHandlers(),this._updateOptionSelection(this._selectedValue$.value,this._selectedValues$.value)})}handleChipRemove(e){let t=this._selectedValues$.value.filter(t=>t!==e);this._selectedValues$.next(t),this._fireChangeEvent(),this._announceToScreenReader(`Removed: ${this._getChipLabel(e)}`)}_getChipLabel(e){let t=this._options.find(t=>t.value===e);return t&&(t.label||t.textContent)||e}_focusTextInput(){this._inputElementRef.value&&this._inputElementRef.value.focus()}render(){let e=`${this.id}-desc`,{height:t,padding:n,fontSize:r,labelSize:i}=(()=>{switch(this.size){case`sm`:return{height:`min-h-[40px]`,padding:`px-2`,fontSize:`text-sm`,labelSize:`text-sm`};case`lg`:return{height:`min-h-[60px]`,padding:`px-5`,fontSize:`text-lg`,labelSize:`text-lg`};default:return{height:`min-h-[50px]`,padding:`px-4`,fontSize:`text-base`,labelSize:`text-base`}}})();return s.html`
            <div class="relative">
                <!-- Screen reader live region -->
                <div id="live-status" role="status" aria-live="polite" class="sr-only"></div>

                <!-- Description -->
                ${this.description?s.html`<div id="${e}" class="sr-only">${this.description}</div>`:``}

                <!-- Custom input wrapper for Gmail-style chip input -->
                <slot name="trigger">
                    ${(0,u.when)(this.multi,()=>s.html`
                            <!-- Custom multi-select input with inline chips -->
                            <div class="relative">
                                ${(0,u.when)(this.label,()=>s.html`
                                    <label class="${(0,a.classMap)({"block mb-1 font-medium":!0,"text-primary-default":!this.error,"text-error-default":this.error,[i]:!0})}">
                                        ${this.label}${this.required?s.html`<span class="text-error-default ml-1">*</span>`:``}
                                    </label>
                                `)}
                                <div
                                    class="${(0,a.classMap)({"flex flex-wrap items-center gap-1":!0,[t]:!0,[n]:!0,"block w-full min-w-0 rounded-[8px] border-0":!0,"bg-surface-highest text-surface-on":!0,"ring-0 ring-inset focus-within:ring-1 focus-within:ring-inset":!0,"ring-secondary-default  focus-within:ring-secondary-default":!this.error,"ring-error-default focus-within:ring-error-default":this.error,"cursor-text transition-colors duration-200":!0})}"
                                    @click=${()=>this._focusTextInput()}
                                    role="combobox"
                                    aria-autocomplete="list"
                                    aria-haspopup="listbox"
                                    aria-controls="options"
                                    aria-expanded=${this._open}
                                >
                                    <!-- Render chips inline -->
                                    ${(0,l.repeat)(this._selectedValues$.value,e=>e,e=>s.html`
                                            <schmancy-input-chip
                                                .value=${e}
                                                @remove=${e=>this.handleChipRemove(e.detail.value)}
                                                class="shrink-0 my-0.5"
                                            >
                                                ${this._getChipLabel(e)}
                                            </schmancy-input-chip>
                                        `)}

                                    <!-- Text input for typing -->
                                    <input
                                        ${(0,c.ref)(this._inputElementRef)}
                                        id="autocomplete-input"
                                        type="text"
                                        class="flex-1 min-w-[120px] py-1 bg-transparent border-none outline-none ${r} font-medium text-surface-on placeholder:text-muted"
                                        name=${this.name||this.label?.toLowerCase().replace(/\s+/g,`-`)||``}
                                        .placeholder=${this._selectedValues$.value.length>0?`Add more...`:this.placeholder}
                                        .value=${this._inputValue}
                                        .autocomplete=${this.autocomplete}
                                        aria-invalid=${this.error?`true`:`false`}
                                        aria-required=${this.required?`true`:`false`}
                                        aria-describedby=${this.error&&this.validationMessage?`${this._a11yId}-err`:s.nothing}
                                        aria-label=${!this.label&&this.placeholder?this.placeholder:s.nothing}
                                        @input=${e=>{let t=e.target.value;this._inputValue=t,this._inputValue$.next(t)}}
                                        @focus=${e=>{e.stopPropagation(),this._inputValue=``,this._inputValue$.next(``),this._openDropdown()}}
                                        @keydown=${e=>{this._handleKeyDown(e)}}
                                        @blur=${()=>{this._handleAutoSelectOnBlur()}}
                                    />
                                </div>

                                <!-- Validation message -->
                                ${(0,u.when)(this.error&&this.validationMessage,()=>s.html`
                                    <div id="${this._a11yId}-err" class="mt-1 text-sm text-error-default" role="alert">
                                        ${this.validationMessage}
                                    </div>
                                `)}
                            </div>
                        `,()=>s.html`
                            <!-- Regular single-select input -->
                            <schmancy-input
                                .size=${this.size}
                                ${(0,c.ref)(this._inputElementRef)}
                                id="autocomplete-input"
                                class="w-full"
                                .name=${this.name||this.label?.toLowerCase().replace(/\s+/g,`-`)||``}
                                .label=${this.label}
                                .placeholder=${this.placeholder}
                                .required=${this.required}
                                .value=${this._inputValue}
                                type="text"
                                autocomplete=${this.autocomplete}
                                clickable
                                role="combobox"
                                aria-autocomplete="list"
                                aria-haspopup="listbox"
                                aria-controls="options"
                                aria-expanded=${this._open}
                                aria-describedby=${this.description?e:void 0}
                                @input=${e=>{let t=e.target.value;this._inputValue=t,this._inputValue$.next(t)}}
                                @focus=${e=>{e.stopPropagation(),this._openDropdown()}}
                                @click=${e=>{e.stopPropagation(),this._openDropdown()}}
                                @keydown=${e=>{this._handleKeyDown(e)}}
                                @blur=${()=>{this._handleAutoSelectOnBlur()}}
                            >
                            </schmancy-input>
                        `)}
                </slot>

                <!-- Options dropdown -->
                <ul
                    id="options"
                    class=${(0,a.classMap)({absolute:!0,"z-[1000]":!0,"mt-1":!0,"w-full":!0,"rounded-md":!0,"shadow-md":!0,"overflow-auto":!0,"min-w-full":!0,"bg-surface-low":!0,flex:!0,"flex-col":!0})}
                    role="listbox"
                    aria-multiselectable=${this.multi?`true`:`false`}
                    aria-label=${`${this.label||`Options`} dropdown`}
                    ?hidden=${!this._open}
                    style="max-height: ${this.maxHeight}; display: ${this._open?`flex`:`none`};"
                    @slotchange=${()=>{this._setupOptionHandlers()}}
                >
                    <slot></slot>
                    ${this._hasResults?``:s.html`
                        <li class="px-3 py-2 text-sm text-muted">No results found</li>
                    `}
                </ul>
            </div>
        `}_handleAutoSelectOnBlur(){if(this.multi||!this._open||!this._inputValue.trim())return;let e=this._inputValue.trim(),t=null,r=0;this._options.forEach(i=>{if(i.hidden)return;let a=i.label||i.textContent||``,o=i.value,s=n.t(e,a),c=n.t(e,o),l=Math.max(1.1*s,c);l>r&&l>=this.similarityThreshold&&(r=l,t=i)}),t&&(this._selectedValue$.next(t.value),this._inputValue=t.label||t.textContent||``,this._inputValue$.next(this._inputValue),this._open=!1)}_handleKeyDown(e){let t=this._open,n=this._selectedValues$.value;if(this.multi&&e.key===`Backspace`&&!this._inputValue&&n.length>0&&!t){e.preventDefault();let t=n[n.length-1];this.handleChipRemove(t);return}if(!t&&(e.key===`ArrowDown`||e.key===`Enter`))return e.preventDefault(),this._openDropdown(),void setTimeout(()=>{this._options.find(e=>!e.hidden)?.focus()},10);if(!t)return;let r=this._options.filter(e=>!e.hidden).sort((e,t)=>parseInt(e.style.order||`0`)-parseInt(t.style.order||`0`)),i=r.find(e=>e===document.activeElement),a=i?r.indexOf(i):-1;switch(e.key){case`Escape`:e.preventDefault(),this._open=!1,this._updateInputDisplay(),this._inputElementRef.value?.focus();break;case`Tab`:this._open=!1,this._updateInputDisplay();break;case`ArrowDown`:e.preventDefault(),r[a<r.length-1?a+1:0]?.focus();break;case`ArrowUp`:e.preventDefault(),r[a>0?a-1:r.length-1]?.focus();break;case`Home`:e.preventDefault(),r[0]?.focus();break;case`End`:e.preventDefault(),r[r.length-1]?.focus();break;case`Enter`:case` `:i&&(e.preventDefault(),this._selectOption(i))}}};e.t([(0,o.property)({type:Boolean})],d.prototype,`required`,void 0),e.t([(0,o.property)({type:String})],d.prototype,`placeholder`,void 0),e.t([(0,o.property)({type:String,reflect:!0})],d.prototype,`label`,void 0),e.t([(0,o.property)({type:String})],d.prototype,`name`,void 0),e.t([(0,o.property)({type:String})],d.prototype,`maxHeight`,void 0),e.t([(0,o.property)({type:Boolean})],d.prototype,`multi`,void 0),e.t([(0,o.property)({type:String})],d.prototype,`description`,void 0),e.t([(0,o.property)({type:String,reflect:!0})],d.prototype,`size`,void 0),e.t([(0,o.property)({type:String})],d.prototype,`autocomplete`,void 0),e.t([(0,o.property)({type:Number})],d.prototype,`debounceMs`,void 0),e.t([(0,o.property)({type:Number})],d.prototype,`similarityThreshold`,void 0),e.t([(0,o.property)({type:Boolean})],d.prototype,`error`,void 0),e.t([(0,o.property)({type:String})],d.prototype,`validationMessage`,void 0),e.t([(0,o.property)({type:Array})],d.prototype,`values`,null),e.t([(0,o.property)({type:String,reflect:!0})],d.prototype,`value`,null),e.t([(0,o.state)()],d.prototype,`_open`,void 0),e.t([(0,o.state)()],d.prototype,`_inputValue`,void 0),e.t([(0,o.state)()],d.prototype,`_visibleOptionsCount`,void 0),e.t([(0,o.state)()],d.prototype,`_hasResults`,void 0),e.t([(0,o.query)(`#options`)],d.prototype,`_listbox`,void 0),e.t([(0,o.query)(`sch-input`)],d.prototype,`_input`,void 0),e.t([(0,o.queryAssignedElements)({flatten:!0})],d.prototype,`_options`,void 0),d=e.t([(0,o.customElement)(`schmancy-autocomplete`)],d);