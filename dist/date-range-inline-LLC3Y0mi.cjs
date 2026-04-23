require(`./chunk-BCfY8kxB.cjs`);const e=require(`./decorate-F9CuyeHg.cjs`),t=require(`./mixins.cjs`);let n=require(`lit/decorators.js`),r=require(`lit`);var i=class extends t.SchmancyFormField(){constructor(...e){super(...e),this.type=`date`,this.dateFrom={label:`From`,value:``},this.dateTo={label:`To`,value:``},this.compact=!1,this.autoCorrect=!0,this.minGap=0,this.defaultGap=1,this.allowSameDate=!1,this.validationState={dateFromError:``,dateToError:``,rangeError:``}}connectedCallback(){super.connectedCallback(),this.dateFrom.value||this.dateTo.value?this.validateAndCorrect():this.setSmartDefaults()}setSmartDefaults(){let e=new Date,t=new Date(e);t.setDate(t.getDate()+this.defaultGap);let n=this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`;this.dateFrom={...this.dateFrom,value:this.formatDate(e,n)},this.dateTo={...this.dateTo,value:this.formatDate(t,n)}}formatDate(e,t){let n=e.getFullYear(),r=String(e.getMonth()+1).padStart(2,`0`),i=String(e.getDate()).padStart(2,`0`);return t===`YYYY-MM-DD`?`${n}-${r}-${i}`:`${n}-${r}-${i}T${String(e.getHours()).padStart(2,`0`)}:${String(e.getMinutes()).padStart(2,`0`)}`}parseDate(e){if(!e)return null;let t=new Date(e);return isNaN(t.getTime())?null:t}getDaysBetween(e,t){return Math.floor((t.getTime()-e.getTime())/864e5)}handleDateFromChange(e){let t=e.target.value;if(this.dateFrom={...this.dateFrom,value:t},this.validationState={...this.validationState,dateFromError:``,rangeError:``},!t)return this.required?(this.validationState={...this.validationState,dateFromError:`Start date is required`},void(this.error=!0)):void this.emitChange();this.validateAndCorrect(`from`)}handleDateToChange(e){let t=e.target.value;if(this.dateTo={...this.dateTo,value:t},this.validationState={...this.validationState,dateToError:``,rangeError:``},!t)return this.required?(this.validationState={...this.validationState,dateToError:`End date is required`},void(this.error=!0)):void this.emitChange();this.validateAndCorrect(`to`)}validateAndCorrect(e){let t=this.parseDate(this.dateFrom.value),n=this.parseDate(this.dateTo.value),r=!1,i={dateFromError:``,dateToError:``,rangeError:``};if(this.dateFrom.value&&!t&&(i.dateFromError=`Invalid date format`,r=!0),this.dateTo.value&&!n&&(i.dateToError=`Invalid date format`,r=!0),t&&n){let a=this.getDaysBetween(t,n);if(t>n){if(this.autoCorrect){if(e===`from`){let e=new Date(t);e.setDate(e.getDate()+this.defaultGap),this.dateTo={...this.dateTo,value:this.formatDate(e,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}}else if(e===`to`){let e=new Date(n);e.setDate(e.getDate()-this.defaultGap),this.dateFrom={...this.dateFrom,value:this.formatDate(e,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}}else{let e=this.dateFrom.value;this.dateFrom={...this.dateFrom,value:this.dateTo.value},this.dateTo={...this.dateTo,value:e}}this.validateAndCorrect();return}i.rangeError=`End date must be after start date`,r=!0}if(!this.allowSameDate&&a===0){if(this.autoCorrect&&e){if(e===`from`){let e=new Date(t);e.setDate(e.getDate()+this.defaultGap),this.dateTo={...this.dateTo,value:this.formatDate(e,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}}else{let e=new Date(n);e.setDate(e.getDate()-this.defaultGap),this.dateFrom={...this.dateFrom,value:this.formatDate(e,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}}this.validateAndCorrect();return}i.rangeError=`Start and end dates cannot be the same`,r=!0}if(this.minGap>0&&a<this.minGap){if(this.autoCorrect&&e){if(e===`from`){let e=new Date(t);e.setDate(e.getDate()+this.minGap),this.dateTo={...this.dateTo,value:this.formatDate(e,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}}else{let e=new Date(n);e.setDate(e.getDate()-this.minGap),this.dateFrom={...this.dateFrom,value:this.formatDate(e,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}}this.validateAndCorrect();return}i.rangeError=`Minimum ${this.minGap} day${this.minGap>1?`s`:``} required between dates`,r=!0}if(this.maxGap!==void 0&&a>this.maxGap){if(this.autoCorrect&&e){if(e===`from`){let e=new Date(t);e.setDate(e.getDate()+this.maxGap),this.dateTo={...this.dateTo,value:this.formatDate(e,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}}else{let e=new Date(n);e.setDate(e.getDate()-this.maxGap),this.dateFrom={...this.dateFrom,value:this.formatDate(e,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}}this.validateAndCorrect();return}i.rangeError=`Maximum ${this.maxGap} day${this.maxGap>1?`s`:``} allowed between dates`,r=!0}if(this.minDate){let e=this.parseDate(this.minDate);e&&t<e&&(i.dateFromError=`Date is before minimum allowed date`,r=!0)}if(this.maxDate){let e=this.parseDate(this.maxDate);e&&n>e&&(i.dateToError=`Date is after maximum allowed date`,r=!0)}}this.validationState=i,this.error=r,this.emitChange()}getComputedMinDateTo(){if(!this.dateFrom.value)return this.minDate;let e=this.parseDate(this.dateFrom.value);if(!e)return this.minDate;let t=new Date(e);if(this.allowSameDate||t.setDate(t.getDate()+1),this.minGap>0&&t.setDate(e.getDate()+this.minGap),this.minDate){let e=this.parseDate(this.minDate);if(e&&e>t)return this.minDate}return this.formatDate(t,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}getComputedMaxDateFrom(){if(!this.dateTo.value)return this.maxDate;let e=this.parseDate(this.dateTo.value);if(!e)return this.maxDate;let t=new Date(e);if(this.allowSameDate||t.setDate(t.getDate()-1),this.minGap>0&&t.setDate(e.getDate()-this.minGap),this.maxDate){let e=this.parseDate(this.maxDate);if(e&&e<t)return this.maxDate}return this.formatDate(t,this.type===`datetime-local`?`YYYY-MM-DDTHH:mm`:`YYYY-MM-DD`)}emitChange(){let e=!(this.error||!this.dateFrom.value||!this.dateTo.value||this.validationState.dateFromError||this.validationState.dateToError||this.validationState.rangeError);this.dispatchEvent(new CustomEvent(`change`,{detail:{dateFrom:this.dateFrom.value,dateTo:this.dateTo.value,isValid:e},bubbles:!0,composed:!0}))}render(){let e=this.validationState.dateFromError||this.validationState.rangeError,t=this.validationState.dateToError||this.validationState.rangeError;return r.html`
			<div class="w-full">
				<div class="flex items-start gap-2 w-full">
					<div class="flex-1">
						<schmancy-input
							.type=${this.type}
							.label=${this.dateFrom.label}
							.value=${this.dateFrom.value}
							.min=${this.minDate}
							.max=${this.getComputedMaxDateFrom()}
							@change=${this.handleDateFromChange}
							.error=${!!e}
							.hint=${e||``}
							.required=${this.required}
							.disabled=${this.disabled}
							size=${this.compact?`sm`:`md`}
						></schmancy-input>
					</div>

					<div class="flex items-center justify-center ${this.compact?`pt-8`:`pt-10`} px-1">
						<schmancy-icon class="text-surface-onVariant opacity-50">
							arrow_forward
						</schmancy-icon>
					</div>

					<div class="flex-1">
						<schmancy-input
							.type=${this.type}
							.label=${this.dateTo.label}
							.value=${this.dateTo.value}
							.min=${this.getComputedMinDateTo()}
							.max=${this.maxDate}
							@change=${this.handleDateToChange}
							.error=${!!t}
							.hint=${t||``}
							.required=${this.required}
							.disabled=${this.disabled}
							size=${this.compact?`sm`:`md`}
						></schmancy-input>
					</div>
				</div>
			</div>
		`}};e.t([(0,n.property)({type:String})],i.prototype,`type`,void 0),e.t([(0,n.property)({type:Object})],i.prototype,`dateFrom`,void 0),e.t([(0,n.property)({type:Object})],i.prototype,`dateTo`,void 0),e.t([(0,n.property)({type:String})],i.prototype,`minDate`,void 0),e.t([(0,n.property)({type:String})],i.prototype,`maxDate`,void 0),e.t([(0,n.property)({type:Boolean})],i.prototype,`compact`,void 0),e.t([(0,n.property)({type:Boolean})],i.prototype,`autoCorrect`,void 0),e.t([(0,n.property)({type:Number})],i.prototype,`minGap`,void 0),e.t([(0,n.property)({type:Number})],i.prototype,`maxGap`,void 0),e.t([(0,n.property)({type:Number})],i.prototype,`defaultGap`,void 0),e.t([(0,n.property)({type:Boolean})],i.prototype,`allowSameDate`,void 0),e.t([(0,n.state)()],i.prototype,`validationState`,void 0);var a=i=e.t([(0,n.customElement)(`schmancy-date-range-inline`)],i);Object.defineProperty(exports,`t`,{enumerable:!0,get:function(){return a}});