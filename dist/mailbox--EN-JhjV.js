import { t as e } from "./tailwind.mixin-mdQR3BEO.js";
import { t } from "./decorate-D_utPUsC.js";
import { t as n } from "./litElement.mixin-CszkJuNl.js";
import "./mixins.js";
import { t as r } from "./dialog-service-DH-tjPuE.js";
import { n as i } from "./sheet.service-Dlv20Zfc.js";
import "./dialog.js";
import { r as a } from "./notification-CC-TFN5v.js";
import { fromEvent as o, takeUntil as s } from "rxjs";
import { customElement as c, property as l, state as u } from "lit/decorators.js";
import { css as d, html as f } from "lit";
import { createRef as p, ref as m } from "lit/directives/ref.js";
import { repeat as h } from "lit/directives/repeat.js";
import { when as g } from "lit/directives/when.js";
var _ = class extends n(d`
	:host {
		display: block;
		height: 100%;
	}
`) {
	constructor(...e) {
		super(...e), this.config = {}, this.templates = [], this.importSources = [], this.disabled = !1, this.recipientsTitle = "Recipients", this.recipientsEmptyTitle = "No recipients yet", this.recipientsEmptyMessage = "Import from sources or upload a CSV", this.enableCsvImport = !0, this.enableDragDrop = !0, this.recipients = [], this.selectedRecipients = [], this.subject = "", this.body = "", this.templateId = null, this.attachments = [], this.isSending = !1, this.handleEmailsImported = (e) => {
			let { emails: t } = e.detail, n = [...new Set([...this.recipients, ...t])], r = t.filter((e) => !this.recipients.includes(e));
			this.recipients = n, this.selectedRecipients = [...new Set([...this.selectedRecipients, ...r])], this.dispatchEvent(new CustomEvent("emails-imported", {
				detail: {
					emails: r,
					source: e.detail.source
				},
				bubbles: !0,
				composed: !0
			}));
		}, this.handleRecipientRemoved = (e) => {
			let { email: t } = e.detail;
			this.recipients = this.recipients.filter((e) => e !== t), this.selectedRecipients = this.selectedRecipients.filter((e) => e !== t), this.dispatchEvent(new CustomEvent("recipient-removed", {
				detail: { email: t },
				bubbles: !0,
				composed: !0
			}));
		}, this.handleRecipientsCleared = () => {
			this.recipients = [], this.selectedRecipients = [], this.dispatchEvent(new CustomEvent("recipients-cleared", {
				bubbles: !0,
				composed: !0
			}));
		}, this.handleSelectionChanged = (e) => {
			let { selectedEmails: t } = e.detail;
			this.selectedRecipients = t, this.dispatchEvent(new CustomEvent("selection-changed", {
				detail: { selectedEmails: t },
				bubbles: !0,
				composed: !0
			}));
		}, this.handleEditorChange = (e) => {
			let { subject: t, body: n, templateId: r, attachments: i } = e.detail;
			this.subject = t, this.body = n, this.templateId = r, this.attachments = i, this.dispatchEvent(new CustomEvent("compose-changed", {
				detail: {
					subject: t,
					body: n,
					templateId: r,
					attachments: i
				},
				bubbles: !0,
				composed: !0
			}));
		}, this.handleSend = async () => {
			if (this.selectedRecipients.length !== 0) if (this.subject.trim()) if (this.body.trim()) {
				this.isSending = !0;
				try {
					let e = {
						recipients: this.selectedRecipients,
						subject: this.subject,
						body: this.body,
						attachments: this.attachments,
						templateId: this.templateId
					};
					this.dispatchEvent(new CustomEvent("send-email", {
						detail: { request: e },
						bubbles: !0,
						composed: !0
					}));
				} catch (e) {
					this.dispatchEvent(new CustomEvent("send-error", {
						detail: { error: e instanceof Error ? e.message : "Failed to send email" },
						bubbles: !0,
						composed: !0
					}));
				} finally {
					this.isSending = !1;
				}
			} else this.dispatchEvent(new CustomEvent("send-error", {
				detail: { error: "Please enter a message body" },
				bubbles: !0,
				composed: !0
			}));
			else this.dispatchEvent(new CustomEvent("send-error", {
				detail: { error: "Please enter a subject" },
				bubbles: !0,
				composed: !0
			}));
			else this.dispatchEvent(new CustomEvent("send-error", {
				detail: { error: "Please select at least one recipient" },
				bubbles: !0,
				composed: !0
			}));
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.setSending(this.disabled);
	}
	updated(e) {
		super.updated(e), e.has("disabled") && this.setSending(this.disabled);
	}
	addRecipients(e) {
		let t = [...new Set([...this.recipients, ...e])], n = e.filter((e) => !this.recipients.includes(e));
		this.recipients = t, this.selectedRecipients = [...new Set([...this.selectedRecipients, ...n])];
	}
	setSubject(e) {
		this.subject = e;
	}
	setBody(e) {
		this.body = e;
	}
	setTemplate(e) {
		this.templateId = e;
	}
	clearCompose() {
		this.recipients = [], this.selectedRecipients = [], this.subject = "", this.body = "", this.templateId = null, this.attachments = [];
	}
	setSending(e) {
		this.isSending = e;
	}
	render() {
		let e = this.selectedRecipients.length > 0 && this.subject.trim() && this.body.trim() && !this.isSending && !this.disabled;
		return f`
			<!-- Main Layout Container -->
			<div class="flex flex-col h-full gap-6 p-6">
				
				<!-- Main Content Section: Composer and Preview -->
				<div class="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
					
					<!-- Composer Section - Full width on mobile/tablet, half on large screens -->
					<div class="w-full xl:w-1/2 min-h-0 flex flex-col">
						<schmancy-email-editor
							.subject=${this.subject}
							.body=${this.body}
							.templates=${this.templates}
							.attachments=${this.attachments}
							.disabled=${this.disabled}
							.config=${this.config}
							@editor-change=${this.handleEditorChange}
							class="h-full"
						></schmancy-email-editor>
					</div>

					<!-- Preview Section - Full width on mobile/tablet, half on large screens -->
					<div class="w-full xl:w-1/2 min-h-0 flex flex-col">
						<schmancy-email-viewer
							.subject=${this.subject}
							.body=${this.body}
							.recipients=${this.selectedRecipients}
							.attachments=${this.attachments}
							class="h-full"
						></schmancy-email-viewer>
					</div>
					
				</div>

				<!-- Send Section - Sticky bottom bar -->
				<div class="shrink-0">
					<schmancy-surface 
						type="subtle"
						rounded="all"
						class="p-4"
					>
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<!-- Send Info -->
							<div class="flex flex-col gap-1">
								<schmancy-typography type="body" token="sm" class="font-medium">
									${this.selectedRecipients.length} recipient${this.selectedRecipients.length === 1 ? "" : "s"} selected
								</schmancy-typography>
								${g(this.attachments.length > 0, () => f`
									<schmancy-typography type="body" token="xs">
										${this.attachments.length} attachment${this.attachments.length === 1 ? "" : "s"}
									</schmancy-typography>
								`)}
							</div>

							<!-- Send Button -->
							<schmancy-button
								variant="filled"
								?disabled=${!e}
								?loading=${this.isSending}
								@click=${this.handleSend}
								class="w-full sm:w-auto"
							>
								<schmancy-icon slot="prefix" size="18px">send</schmancy-icon>
								${this.isSending ? "Sending..." : "Send Email"}
							</schmancy-button>
						</div>
					</schmancy-surface>
				</div>
				
			</div>

			<!-- Recipients Panel as Floating Boat -->
			<schmancy-email-recipients
				.recipients=${this.recipients}
				.selectedRecipients=${this.selectedRecipients}
				.importSources=${this.importSources}
				.disabled=${this.disabled}
				.enableCsvImport=${this.enableCsvImport}
				.enableDragDrop=${this.enableDragDrop}
				.title=${this.recipientsTitle}
				.emptyStateTitle=${this.recipientsEmptyTitle}
				.emptyStateMessage=${this.recipientsEmptyMessage}
				@emails-imported=${this.handleEmailsImported}
				@recipient-removed=${this.handleRecipientRemoved}
				@recipients-cleared=${this.handleRecipientsCleared}
				@selection-changed=${this.handleSelectionChanged}
			></schmancy-email-recipients>
		`;
	}
};
t([l({ type: Object })], _.prototype, "config", void 0), t([l({ type: Array })], _.prototype, "templates", void 0), t([l({ type: Array })], _.prototype, "importSources", void 0), t([l({ type: Boolean })], _.prototype, "disabled", void 0), t([l({ type: String })], _.prototype, "recipientsTitle", void 0), t([l({ type: String })], _.prototype, "recipientsEmptyTitle", void 0), t([l({ type: String })], _.prototype, "recipientsEmptyMessage", void 0), t([l({ type: Boolean })], _.prototype, "enableCsvImport", void 0), t([l({ type: Boolean })], _.prototype, "enableDragDrop", void 0), t([u()], _.prototype, "recipients", void 0), t([u()], _.prototype, "selectedRecipients", void 0), t([u()], _.prototype, "subject", void 0), t([u()], _.prototype, "body", void 0), t([u()], _.prototype, "templateId", void 0), t([u()], _.prototype, "attachments", void 0), t([u()], _.prototype, "isSending", void 0), _ = t([c("schmancy-mailbox")], _);
var v = class extends e() {
	constructor(...e) {
		super(...e), this.layouts = [
			{
				id: "columns-2",
				icon: "view_week",
				label: "2 Col"
			},
			{
				id: "columns-3",
				icon: "view_column",
				label: "3 Col"
			},
			{
				id: "sidebar-left",
				icon: "view_sidebar",
				label: "Left"
			},
			{
				id: "sidebar-right",
				icon: "view_sidebar",
				label: "Right",
				flipped: !0
			},
			{
				id: "image-row",
				icon: "collections",
				label: "Images"
			}
		];
	}
	selectLayout(e) {
		this.dispatchEvent(new CustomEvent("layout-select", {
			detail: { layout: e },
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		return f`
			<div class="grid p-3 gap-2">
				${this.layouts.map((e) => f`
					<schmancy-button 
						variant="outlined"
						@click=${() => this.selectLayout(e.id)}
					>
						<schmancy-icon 
							slot="prefix"
							size="20px"
							class=${e.flipped ? "scale-x-[-1]" : ""}
						>
							${e.icon}
						</schmancy-icon>
						${e.label}
					</schmancy-button>
				`)}
			</div>
		`;
	}
};
v = t([c("schmancy-email-layout-selector")], v);
var y = class extends n(d`
	:host {
		display: block;
	}
`) {
	constructor(...e) {
		super(...e), this.templates = [], this.searchQuery = "", this.filteredTemplates = [], this.selectedCategory = "all", this.handleSearch = (e) => {
			let t = e.target;
			this.searchQuery = t.value;
		}, this.handleCategorySelect = (e) => {
			this.selectedCategory = e, this.updateFilteredTemplates();
		}, this.selectTemplate = (e) => {
			this.dispatchEvent(new CustomEvent("template-selected", {
				detail: e,
				bubbles: !0,
				composed: !0
			})), i.dismiss();
		}, this.close = () => {
			i.dismiss();
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.updateFilteredTemplates();
	}
	updated(e) {
		(e.has("templates") || e.has("searchQuery") || e.has("selectedCategory")) && this.updateFilteredTemplates();
	}
	get categories() {
		let e = /* @__PURE__ */ new Set();
		return this.templates.forEach((t) => {
			t.category && e.add(t.category);
		}), ["all", ...Array.from(e)];
	}
	updateFilteredTemplates() {
		let e = [...this.templates];
		if (this.selectedCategory !== "all" && (e = e.filter((e) => e.category === this.selectedCategory)), this.searchQuery.trim()) {
			let t = this.searchQuery.toLowerCase();
			e = e.filter((e) => e.name.toLowerCase().includes(t) || e.category?.toLowerCase().includes(t) || e.description?.toLowerCase().includes(t));
		}
		this.filteredTemplates = e;
	}
	render() {
		return f`
			<div class="flex flex-col h-full overflow-hidden">
				<!-- Header -->
				<div class="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
					<div class="flex items-center gap-3">
						<schmancy-icon size="24px" class="text-primary">mail</schmancy-icon>
						<schmancy-typography type="headline" token="md">
							Choose Email Template
						</schmancy-typography>
					</div>
					<schmancy-button
						variant="text"
						@click=${this.close}
						class="hover:bg-surface-container rounded-full w-10 h-10 p-0"
					>
						<schmancy-icon>close</schmancy-icon>
					</schmancy-button>
				</div>

				<!-- Body -->
				<div class="flex-1 flex flex-col overflow-hidden">
					${this.renderTemplateList()}
				</div>
			</div>
		`;
	}
	renderTemplateList() {
		return f`
			<!-- Search and Filter Bar -->
			<div class="px-6 py-4 border-b border-outline-variant bg-surface-containerLow">
				<div class="flex flex-col gap-4">
					<!-- Search Input -->
					<schmancy-input
						type="search"
						placeholder="Search templates..."
						.value=${this.searchQuery}
						@input=${this.handleSearch}
						class="w-full"
					>
						<schmancy-icon slot="prefix" size="20px" class="text-surface-onVariant">search</schmancy-icon>
						${g(this.searchQuery, () => f`
							<schmancy-button
								slot="suffix"
								variant="text"
								@click=${() => {
			this.searchQuery = "";
		}}
								class="rounded-full w-8 h-8 p-0"
							>
								<schmancy-icon size="16px">close</schmancy-icon>
							</schmancy-button>
						`)}
					</schmancy-input>

					<!-- Category Filter -->
					${g(this.categories.length > 1, () => f`
						<div class="flex gap-2 flex-wrap">
							${h(this.categories, (e) => e, (e) => f`
									<schmancy-chip
										class="cursor-pointer transition-all hover:shadow-sm ${this.selectedCategory === e ? "bg-primary text-primary-on" : "border border-outline"}"
										@click=${() => this.handleCategorySelect(e)}
									>
										${e === "all" ? "All Templates" : e}
									</schmancy-chip>
								`)}
						</div>
					`)}
				</div>
			</div>

			<!-- Template List with Previews -->
			<div class="flex-1 overflow-y-auto px-6 py-6">
				${g(this.filteredTemplates.length > 0, () => f`
						<div class="space-y-6">
							${h(this.filteredTemplates, (e) => e.id, (e) => f`
									<schmancy-surface
										type="subtle"
										elevation="1"
										rounded="all"
										class="group cursor-pointer hover:elevation-3 transition-all duration-200 overflow-hidden"
										@click=${() => this.selectTemplate(e)}
									>
										<!-- Template Header -->
										<div class="p-4 border-b border-outline-variant">
											<div class="flex items-start justify-between">
												<div class="flex-1">
													<schmancy-typography type="title" token="md" class="font-semibold leading-tight mb-1">
														${e.name}
													</schmancy-typography>
													${g(e.category, () => f`
														<schmancy-chip class="text-xs border border-outline">
															${e.category}
														</schmancy-chip>
													`)}
												</div>
												<schmancy-button 
													variant="filled" 
													size="sm"
													class="opacity-0 group-hover:opacity-100 transition-opacity"
												>
													Use This
												</schmancy-button>
											</div>
										</div>
										
										<!-- Email Preview -->
										<div class="p-4 bg-surface">
											<schmancy-email-viewer
												subject=${e.subject}
												body=${e.body}
												mode="desktop"
												class="max-h-96 overflow-y-auto"
											></schmancy-email-viewer>
										</div>
									</schmancy-surface>
								`)}
						</div>
					`, () => f`
						<div class="flex flex-col items-center justify-center h-96 text-center">
							<div class="mb-6">
								<schmancy-icon size="64px" class="text-surface-onVariant opacity-20">mail_outline</schmancy-icon>
							</div>
							<schmancy-typography type="headline" token="sm" class="mb-2">
								${this.searchQuery || this.selectedCategory !== "all" ? "No templates found" : "No templates available"}
							</schmancy-typography>
							<schmancy-typography type="body" token="md" class="text-surface-onVariant mb-6 max-w-md">
								${this.searchQuery ? `No templates match your search for "${this.searchQuery}"` : this.selectedCategory === "all" ? "Start by creating your first email template" : `No templates found in the "${this.selectedCategory}" category`}
							</schmancy-typography>
							${g(this.searchQuery || this.selectedCategory !== "all", () => f`
								<div class="flex gap-3">
									${g(this.searchQuery, () => f`
										<schmancy-button
											variant="outlined"
											@click=${() => {
			this.searchQuery = "";
		}}
										>
											<schmancy-icon slot="prefix">clear</schmancy-icon>
											Clear Search
										</schmancy-button>
									`)}
									${g(this.selectedCategory !== "all", () => f`
										<schmancy-button
											variant="filled"
											@click=${() => this.handleCategorySelect("all")}
										>
											<schmancy-icon slot="prefix">view_list</schmancy-icon>
											Show All Templates
										</schmancy-button>
									`)}
								</div>
							`)}
						</div>
					`)}
			</div>
		`;
	}
};
t([l({ type: Array })], y.prototype, "templates", void 0), t([u()], y.prototype, "searchQuery", void 0), t([u()], y.prototype, "filteredTemplates", void 0), t([u()], y.prototype, "selectedCategory", void 0), y = t([c("schmancy-email-template-picker")], y);
var b = class extends n(d`
	:host {
		display: block;
		height: 100%;
	}
`) {
	constructor(...e) {
		super(...e), this.subject = "", this.body = "", this.disabled = !1, this.attachments = [], this.config = {}, this.templates = this.getDefaultTemplates(), this.dragOver = !1, this.isUploading = !1, this.subjectInputRef = p(), this.bodyTextAreaRef = p(), this.fileInputRef = p(), this.imageInputRef = p(), this.handleKeyDown = (e) => {
			if (this.disabled) return;
			let t = this.bodyTextAreaRef.value?.shadowRoot?.querySelector("textarea");
			e.key === "Tab" && e.target === t && (e.preventDefault(), this.insertAtCursor("  "));
		}, this.handlePaste = (e) => {
			let t = this.bodyTextAreaRef.value?.shadowRoot?.querySelector("textarea");
			if (this.disabled || document.activeElement !== t) return;
			let n = e.clipboardData?.items;
			if (n) for (let t = 0; t < n.length; t++) {
				let r = n[t];
				if (r.type.indexOf("image") !== -1) {
					e.preventDefault();
					let t = r.getAsFile();
					t && this.uploadImage(t);
					break;
				}
			}
		}, this.handleSubjectChange = (e) => {
			let t = e.target;
			this.subject = t.value, this.dispatchChange();
		}, this.handleBodyChange = (e) => {
			this.body = e.detail.value, this.dispatchChange();
		}, this.dispatchChange = () => {
			this.dispatchEvent(new CustomEvent("editor-change", {
				detail: {
					subject: this.subject,
					body: this.body,
					attachments: this.attachments
				},
				bubbles: !0,
				composed: !0
			}));
		}, this.openLayoutDialog = () => {
			r.component(f`
			<schmancy-email-layout-selector
				@layout-select=${(e) => {
				this.applyLayout(e.detail.layout), r.close();
			}}
			></schmancy-email-layout-selector>
		`);
		}, this.openTemplatePicker = () => {
			let e = new y();
			e.templates = this.templates, o(e, "template-selected").pipe(s(this.disconnecting)).subscribe(this.handleTemplateSelected), i.open({ component: e });
		}, this.handleTemplateSelected = (e) => {
			let t = e.detail;
			this.subject = t.subject, this.body = t.body, this.dispatchChange(), a.success(`Template "${t.name}" applied successfully`);
		}, this.applyLayout = (e) => {
			let t = {
				"columns-2": "\n:::layout columns-2\n<div class=\"column\">\n![Left Photo](https://via.placeholder.com/400x300?text=Replace+with+your+photo){height=300px}\n\n**Photo Title**\n\nReplace the placeholder image above with your own photo. The height=300px ensures both images have equal height while width adjusts automatically.\n</div>\n\n<div class=\"column\">\n![Right Photo](https://via.placeholder.com/400x300?text=Replace+with+your+photo){height=300px}\n\n**Photo Title**\n\nUse the same height value (300px) for both images to keep them aligned perfectly side by side.\n</div>\n:::\n",
				"columns-3": "\n:::layout columns-3\n<div class=\"column\">\n![Photo 1](https://via.placeholder.com/300x200?text=Photo+1){height=200px}\n\n**Item Title**\n\nBrief description or caption for this item.\n</div>\n\n<div class=\"column\">\n![Photo 2](https://via.placeholder.com/300x200?text=Photo+2){height=200px}\n\n**Item Title**\n\nBrief description or caption for this item.\n</div>\n\n<div class=\"column\">\n![Photo 3](https://via.placeholder.com/300x200?text=Photo+3){height=200px}\n\n**Item Title**\n\nBrief description or caption for this item.\n</div>\n:::\n",
				"sidebar-left": "\n:::layout sidebar-left\n<div class=\"sidebar\">\n**Sidebar Content**\n\n* Navigation item 1\n* Navigation item 2\n* Navigation item 3\n</div>\n\n<div class=\"main\">\n**Main Content Area**\n\nYour primary content goes here. This area takes up most of the width while the sidebar provides supplementary information or navigation.\n</div>\n:::\n",
				"sidebar-right": "\n:::layout sidebar-right\n<div class=\"main\">\n**Main Content Area**\n\nYour primary content goes here. This area takes up most of the width while the sidebar provides supplementary information or navigation.\n</div>\n\n<div class=\"sidebar\">\n**Sidebar Content**\n\n* Quick links\n* Related info\n* Contact details\n</div>\n:::\n",
				"image-row": "\n:::layout image-row\n<div class=\"image\">\n![Gallery Image 1](https://via.placeholder.com/400x250?text=Gallery+Image+1){height=250px}\n</div>\n\n<div class=\"image\">\n![Gallery Image 2](https://via.placeholder.com/400x250?text=Gallery+Image+2){height=250px}\n</div>\n\n<div class=\"image\">\n![Gallery Image 3](https://via.placeholder.com/400x250?text=Gallery+Image+3){height=250px}\n</div>\n:::\n"
			}[e];
			t && this.insertAtCursor(t);
		}, this.uploadImage = async (e) => {
			if (e.type.startsWith("image/")) if (e.size > 10485760) a.error(`Image "${e.name}" is too large. Maximum size is 10MB.`);
			else {
				this.isUploading = !0;
				try {
					let t;
					this.config.imageUploadHandler ? t = await this.config.imageUploadHandler(e) : this.config.uploadHandler ? t = await this.config.uploadHandler(e) : (t = await this.createDataUrl(e), a.warning("No upload handler configured. Using local preview."));
					let n = await this.getImageDimensions(e);
					this.insertImageMarkdown(t, e.name, n.width, n.height), a.success("Image uploaded successfully");
				} catch {
					a.error("Failed to upload image");
				} finally {
					this.isUploading = !1;
				}
			}
			else a.error(`File "${e.name}" is not an image`);
		}, this.createDataUrl = (e) => new Promise((t, n) => {
			let r = new FileReader();
			r.onload = () => t(r.result), r.onerror = n, r.readAsDataURL(e);
		}), this.getImageDimensions = (e) => new Promise((t) => {
			let n = new Image();
			n.onload = () => {
				t({
					width: n.width,
					height: n.height
				}), URL.revokeObjectURL(n.src);
			}, n.onerror = () => {
				t({
					width: 400,
					height: 300
				}), URL.revokeObjectURL(n.src);
			}, n.src = URL.createObjectURL(e);
		}), this.insertImageMarkdown = (e, t, n, r) => {
			let i = this.bodyTextAreaRef.value?.shadowRoot?.querySelector("textarea");
			if (!i) return;
			let a = `![${t}](${e}){width=${Math.min(n, 600)}px height=auto}`, o = i.selectionStart, s = i.selectionEnd, c = this.body.substring(0, o) + a + this.body.substring(s);
			this.body = c, this.dispatchChange(), this.updateComplete.then(() => {
				let e = this.bodyTextAreaRef.value?.shadowRoot?.querySelector("textarea");
				if (e) {
					let t = o + a.length;
					e.setSelectionRange(t, t), e.focus();
				}
			});
		}, this.handleFileChange = (e) => {
			let t = e.target, n = t.files;
			if (n) for (let e = 0; e < n.length; e++) {
				let t = n[e];
				t.type.startsWith("image/") ? this.uploadImage(t) : this.addFile(t);
			}
			t.value = "";
		}, this.handleImageSelect = (e) => {
			let t = e.target, n = t.files?.[0];
			n && n.type.startsWith("image/") && this.uploadImage(n), t.value = "";
		}, this.handleDrop = (e) => {
			e.preventDefault(), this.dragOver = !1;
			let t = e.dataTransfer?.files;
			if (t) for (let e = 0; e < t.length; e++) {
				let n = t[e];
				n.type.startsWith("image/") ? this.uploadImage(n) : this.addFile(n);
			}
		}, this.handleDragEnter = (e) => {
			e.preventDefault(), this.dragOver = !0;
		}, this.handleDocumentDragLeave = (e) => {
			e.preventDefault(), this.dragOver = !1;
		}, this.handleDocumentDrop = (e) => {
			e.preventDefault(), this.dragOver = !1;
		}, this.handleDragOver = (e) => {
			e.preventDefault();
		}, this.handleDragLeave = (e) => {
			e.preventDefault();
		}, this.addFile = (e) => {
			if (e.size > 10485760) return void a.error(`File "${e.name}" is too large. Maximum size is 10MB.`);
			if (this.attachments.some((t) => t.name === e.name && t.size === e.size)) return void a.warning(`File "${e.name}" is already attached.`);
			let t = {
				id: crypto.randomUUID(),
				file: e,
				name: e.name,
				size: e.size,
				type: e.type || "application/octet-stream"
			};
			this.attachments = [...this.attachments, t], this.dispatchChange();
		}, this.removeAttachment = (e) => {
			this.attachments = this.attachments.filter((t) => t.id !== e), this.dispatchChange();
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.addEventListeners();
	}
	disconnectedCallback() {
		super.disconnectedCallback();
	}
	getDefaultTemplates() {
		return [
			{
				id: "welcome",
				name: "Welcome Email",
				subject: "Welcome to Our Community! 🌟",
				description: "A warm welcome message for new users",
				category: "onboarding",
				body: "# Welcome to Our Community!\n\nWe're thrilled to have you on board. Thank you for joining us on this journey.\n\n## What's Next?\n\n* **Explore** your dashboard and discover all the features\n* **Connect** with other community members\n* **Get support** whenever you need it - we're here to help\n\n---\n\n*Need assistance? Simply reply to this email and we'll get back to you within 24 hours.*\n\nBest regards,  \nThe Team"
			},
			{
				id: "newsletter",
				name: "Newsletter",
				subject: "Weekly Insights & Updates",
				description: "Regular newsletter template with updates and insights",
				category: "communication",
				body: "# This Week's Highlights\n\n## Featured Story\n\n**[Article Title]**  \nBrief description of the main story or update that you want to highlight this week.\n\n[Read More](https://example.com)\n\n## Quick Updates\n\n* **Update 1**: Brief description of an important update\n* **Update 2**: Another noteworthy development\n* **Update 3**: Additional news worth sharing\n\n## Upcoming Events\n\n**[Event Name]** - *Date*  \nShort description of the upcoming event.\n\n---\n\n*Thanks for reading! Forward this to a friend who might enjoy it.*\n\nUntil next week,  \nThe Team"
			},
			{
				id: "product-launch",
				name: "Product Launch",
				subject: "Introducing Our Latest Innovation 🚀",
				description: "Announce new products or features",
				category: "marketing",
				body: "# Something Amazing is Here\n\nWe've been working hard behind the scenes, and today we're excited to introduce our latest creation.\n\n## Key Features\n\n* **Feature 1**: Benefit that matters to your users\n* **Feature 2**: Another compelling capability\n* **Feature 3**: The feature that sets you apart\n\n## Early Access\n\nAs a valued member, you get **exclusive early access** starting today.\n\n[Get Started Now](https://example.com)\n\n---\n\n*Questions? We'd love to hear from you. Just hit reply!*\n\nBest,  \nThe Product Team"
			},
			{
				id: "event-invitation",
				name: "Event Invitation",
				subject: "You're Invited: [Event Name]",
				description: "Professional event invitation template",
				category: "events",
				body: "# You're Invited!\n\n## [Event Name]\n\n**When**: [Date & Time]  \n**Where**: [Location or Virtual Link]  \n**Duration**: [Duration]\n\nJoin us for an exclusive gathering where we'll explore [brief event description].\n\n## What to Expect\n\n* **Networking** with industry professionals\n* **Insights** from leading experts\n* **Interactive** sessions and discussions\n\n## RSVP Required\n\nSpace is limited, so please confirm your attendance by [RSVP Date].\n\n[Confirm Attendance](https://example.com)\n\n---\n\n*Can't make it? Let us know and we'll share the key highlights with you.*\n\nLooking forward to seeing you there,  \nThe Events Team"
			},
			{
				id: "thank-you",
				name: "Thank You",
				subject: "Thank You - It Means Everything",
				description: "Express gratitude to customers or supporters",
				category: "appreciation",
				body: "# Thank You\n\nYour support means the world to us.\n\nWhether you've been with us from the beginning or just joined our community, we want you to know how much we appreciate you.\n\n## Because of You\n\n* We've been able to improve our service\n* Our community has grown stronger\n* We've achieved milestones we never thought possible\n\n## What's Next\n\nWe're committed to continuing to earn your trust and providing even more value in the coming months.\n\n---\n\n*Your feedback shapes everything we do. Reply anytime with thoughts or suggestions.*\n\nWith genuine gratitude,  \nThe Team"
			},
			{
				id: "feedback-request",
				name: "Feedback Request",
				subject: "Your Opinion Matters - 2 Minutes?",
				description: "Request feedback or reviews from users",
				category: "feedback",
				body: "# We'd Love Your Feedback\n\nYour experience matters to us, and we're always looking for ways to improve.\n\n## Quick Favor?\n\nCould you spare **2 minutes** to share your thoughts? Your honest feedback helps us serve you better.\n\n[Share Your Feedback](https://example.com)\n\n## What We're Asking\n\n* How has your experience been so far?\n* What's working well for you?\n* What could we improve?\n\n## Thank You Gift\n\nAs a small token of appreciation, everyone who completes our feedback form receives [incentive].\n\n---\n\n*Every response is read personally by our team. We take your input seriously.*\n\nThanks in advance,  \nThe Team"
			},
			{
				id: "password-reset",
				name: "Password Reset",
				subject: "Reset Your Password - Action Required",
				description: "Secure password reset instructions",
				category: "security",
				body: "# Password Reset Request\n\nWe received a request to reset the password for your account.\n\n## Reset Your Password\n\nClick the button below to create a new password. This link will expire in **24 hours** for your security.\n\n[Reset Password](https://example.com/reset)\n\n## Didn't Request This?\n\nIf you didn't request a password reset, please ignore this email. Your account remains secure.\n\n## Need Help?\n\nIf you're having trouble with the reset process, contact our support team and we'll assist you right away.\n\n---\n\n*For security reasons, this link can only be used once and expires in 24 hours.*\n\nBest regards,  \nSecurity Team"
			},
			{
				id: "order-confirmation",
				name: "Order Confirmation",
				subject: "Order Confirmed - #[ORDER-NUMBER]",
				description: "Professional order confirmation template",
				category: "commerce",
				body: "# Order Confirmation\n\nThanks for your order! We've received your payment and are preparing your items for shipment.\n\n## Order Details\n\n**Order Number**: #[ORDER-NUMBER]  \n**Order Date**: [DATE]  \n**Total**: $[AMOUNT]\n\n## Items Ordered\n\n* **[Item 1]** - Quantity: [QTY] - $[PRICE]\n* **[Item 2]** - Quantity: [QTY] - $[PRICE]\n\n## Shipping Information\n\n**Address**: [SHIPPING ADDRESS]  \n**Method**: [SHIPPING METHOD]  \n**Estimated Delivery**: [DELIVERY DATE]\n\n## Next Steps\n\nYou'll receive a tracking number via email once your order ships (usually within 1-2 business days).\n\n[Track Your Order](https://example.com/track)\n\n---\n\n*Questions about your order? Reply to this email or contact our support team.*\n\nThank you for your business,  \nThe Fulfillment Team"
			}
		];
	}
	addEventListeners() {
		o(this, "keydown").pipe(s(this.disconnecting)).subscribe(this.handleKeyDown), o(document, "paste").pipe(s(this.disconnecting)).subscribe(this.handlePaste), o(document, "dragenter").pipe(s(this.disconnecting)).subscribe(this.handleDragEnter), o(document, "dragleave").pipe(s(this.disconnecting)).subscribe(this.handleDocumentDragLeave), o(document, "drop").pipe(s(this.disconnecting)).subscribe(this.handleDocumentDrop);
	}
	insertAtCursor(e, t) {
		if (!this.bodyTextAreaRef.value) return;
		let n = this.bodyTextAreaRef.value.shadowRoot?.querySelector("textarea");
		if (!n) return;
		let r = n.selectionStart, i = n.selectionEnd, a = n.value.substring(0, r) + e + n.value.substring(i);
		this.body = a, this.dispatchChange(), this.updateComplete.then(() => {
			let n = this.bodyTextAreaRef.value?.shadowRoot?.querySelector("textarea");
			if (n) if (n.focus(), t) {
				let i = r + e.indexOf(t), a = i + t.length;
				n.setSelectionRange(i, a);
			} else n.setSelectionRange(r + e.length, r + e.length);
		});
	}
	wrapSelection(e, t, n) {
		if (!this.bodyTextAreaRef.value) return;
		let r = this.bodyTextAreaRef.value.shadowRoot?.querySelector("textarea");
		if (!r) return;
		let i = r.selectionStart, a = r.selectionEnd, o = r.value.substring(i, a), s = e + (o || n) + t, c = r.value.substring(0, i) + s + r.value.substring(a);
		this.body = c, this.dispatchChange(), this.updateComplete.then(() => {
			let t = this.bodyTextAreaRef.value?.shadowRoot?.querySelector("textarea");
			t && (t.focus(), o ? t.setSelectionRange(i + s.length, i + s.length) : t.setSelectionRange(i + e.length, i + e.length + n.length));
		});
	}
	render() {
		return f`
			<schmancy-surface 
				type="solid"
				rounded="all"
				class=${this.classMap({
			"border-2 border-dashed border-primary": this.dragOver,
			"h-full flex flex-col": !0
		})}
				@drop=${this.handleDrop}
				@dragover=${this.handleDragOver}
				@dragleave=${this.handleDragLeave}
			>
				<div class="flex flex-col h-full gap-4">

					<!-- Header Section with Subject -->
					<div class="shrink-0 p-4 pb-0 space-y-4">
						<!-- Subject Field -->
						<div class="space-y-2">
							<schmancy-typography type="label" token="md">
								Subject *
							</schmancy-typography>
							<schmancy-input
								${m(this.subjectInputRef)}
								.value=${this.subject}
								@input=${this.handleSubjectChange}
								placeholder="Enter email subject..."
								.disabled=${this.disabled}
								class="w-full"
							></schmancy-input>
						</div>
					</div>

					<!-- Formatting Toolbar -->
					<div class="shrink-0 px-4">
						<schmancy-surface type="subtle" rounded="all" class="p-3">
							<div class="flex flex-wrap gap-2 items-center">
								<!-- Text Formatting Group -->
								<div class="flex gap-1">
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Bold" 
										?disabled=${this.disabled}
										@click=${() => this.wrapSelection("**", "**", "bold text")}
									>
										<schmancy-icon>format_bold</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Italic" 
										?disabled=${this.disabled}
										@click=${() => this.wrapSelection("*", "*", "italic text")}
									>
										<schmancy-icon>format_italic</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Link" 
										?disabled=${this.disabled}
										@click=${() => this.insertAtCursor("[link text](https://example.com)", "link text")}
									>
										<schmancy-icon>link</schmancy-icon>
									</schmancy-icon-button>
								</div>
								
								<!-- Divider -->
								<div class="h-6 w-px bg-outline-variant"></div>
								
								<!-- Structure Formatting Group -->
								<div class="flex gap-1">
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Heading" 
										?disabled=${this.disabled}
										@click=${() => this.insertAtCursor("\n# Heading\n", "Heading")}
									>
										<schmancy-icon>title</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Bullet List" 
										?disabled=${this.disabled}
										@click=${() => this.insertAtCursor("\n* List item\n", "List item")}
									>
										<schmancy-icon>format_list_bulleted</schmancy-icon>
									</schmancy-icon-button>
								</div>
								
								<!-- Divider -->
								<div class="h-6 w-px bg-outline-variant"></div>
								
								<!-- Media and Layout Group -->
								<div class="flex gap-1">
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Insert Image" 
										?disabled=${this.disabled || this.isUploading}
										@click=${() => this.imageInputRef.value?.click()}
									>
										${g(this.isUploading, () => f`<schmancy-progress size="sm" class="w-4 h-4"></schmancy-progress>`, () => f`<schmancy-icon>image</schmancy-icon>`)}
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Insert Layout" 
										?disabled=${this.disabled}
										@click=${this.openLayoutDialog}
									>
										<schmancy-icon>mobile_layout</schmancy-icon>
									</schmancy-icon-button>
									<schmancy-icon-button 
										size="sm" 
										variant="text" 
										title="Use Template" 
										?disabled=${this.disabled || this.templates.length === 0}
										@click=${this.openTemplatePicker}
									>
										<schmancy-icon>description</schmancy-icon>
									</schmancy-icon-button>
								</div>
							</div>
						</schmancy-surface>
					</div>

					<!-- Textarea Container - Takes remaining space -->
					<div class="flex-1 px-4 relative min-h-0">
						<schmancy-textarea
							${m(this.bodyTextAreaRef)}
							.value=${this.body}
							@change=${this.handleBodyChange}
							placeholder="Enter your email message here...

Use the toolbar buttons above for formatting, or type markdown directly:
**bold**, *italic*, [link](url), ![image](url)

Drag & drop images or press Ctrl+V to paste from clipboard.
Tab key inserts 2 spaces for better formatting."
							.disabled=${this.disabled}
							.required=${!0}
							.rows=${4}
							class="w-full font-mono text-sm"
						></schmancy-textarea>
						
						<!-- Upload Progress Overlay -->
						${g(this.isUploading, () => f`
							<div class="absolute top-3 right-3 z-10">
								<schmancy-surface type="subtle" rounded="all" class="p-2">
									<div class="flex items-center gap-2">
										<schmancy-progress size="sm" class="w-4 h-4"></schmancy-progress>
										<schmancy-typography type="body" token="xs">Uploading...</schmancy-typography>
									</div>
								</schmancy-surface>
							</div>
						`)}
					</div>

					<!-- Footer Section -->
					<div class="shrink-0 p-4 pt-0 space-y-2">
						<!-- Character/Word Counter -->
						<div class="text-center">
							<schmancy-typography type="body" token="xs">
								${this.body.length} characters • ${this.body.trim() ? this.body.trim().split(/\s+/).length : 0} words
							</schmancy-typography>
						</div>

						<!-- Attachments Display (if any) -->
						${g(this.attachments.length > 0, () => f`
							<div class="space-y-2">
								<schmancy-typography type="label" token="sm" class="flex items-center gap-2">
									<schmancy-icon size="16px">attach_file</schmancy-icon>
									Attachments (${this.attachments.length})
								</schmancy-typography>
								<div class="flex flex-wrap gap-2">
									${h(this.attachments, (e) => e.id, (e) => f`
										<schmancy-chip class="text-xs">
											<span class="truncate max-w-32">${e.name}</span>
											<button 
												@click=${() => this.removeAttachment(e.id)}
												class="ml-2 text-error hover:text-error-container"
												title="Remove attachment"
											>
												<schmancy-icon size="14px">close</schmancy-icon>
											</button>
										</schmancy-chip>
									`)}
								</div>
							</div>
						`)}
					</div>

					<!-- Hidden File Inputs -->
					<div class="hidden">
						<input
							${m(this.fileInputRef)}
							type="file"
							multiple
							@change=${this.handleFileChange}
						>
						<input
							${m(this.imageInputRef)}
							type="file"
							accept="image/*"
							@change=${this.handleImageSelect}
						>
					</div>

				</div>
			</schmancy-surface>

		`;
	}
};
t([l({ type: String })], b.prototype, "subject", void 0), t([l({ type: String })], b.prototype, "body", void 0), t([l({ type: Boolean })], b.prototype, "disabled", void 0), t([l({ type: Array })], b.prototype, "attachments", void 0), t([l({ type: Object })], b.prototype, "config", void 0), t([l({ type: Array })], b.prototype, "templates", void 0), t([u()], b.prototype, "dragOver", void 0), t([u()], b.prototype, "isUploading", void 0), b = t([c("schmancy-email-editor")], b);
var x = class extends n(d`
	:host {
		display: block;
	}
`) {
	constructor(...e) {
		super(...e), this.subject = "", this.body = "", this.attachments = [], this.recipients = [], this.fromAddress = "sender@example.com", this.toAddress = "recipient@example.com", this.viewMode = "html";
	}
	parseLayoutBlocks(e) {
		return e.replace(/:::layout\s+([a-zA-Z0-9-]+)\n([\s\S]*?)\n:::/g, (e, t, n) => {
			switch (t) {
				case "columns-2": return this.parseColumnsLayout(n, 2);
				case "columns-3": return this.parseColumnsLayout(n, 3);
				case "sidebar-left": return this.parseSidebarLayout(n, "left");
				case "sidebar-right": return this.parseSidebarLayout(n, "right");
				case "image-row": return this.parseImageRowLayout(n);
				default: return n;
			}
		});
	}
	parseColumnsLayout(e, t) {
		let n = /<div class="column">([\s\S]*?)<\/div>/g, r = [], i;
		for (; (i = n.exec(e)) !== null;) r.push(i[1].trim());
		if (r.length === 0) return e;
		let a = Math.floor(100 / t), o = "0 10px 0 0", s = "<tr>";
		for (let e = 0; e < t && e < r.length; e++) s += `\n\t\t\t\t<td width="${a}%" style="padding: ${e === t - 1 ? "0" : o}; vertical-align: top; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">\n\t\t\t\t\t${this.parseBasicMarkdown(r[e])}\n\t\t\t\t</td>`;
		for (let e = r.length; e < t; e++) s += `\n\t\t\t\t<td width="${a}%" style="padding: ${e === t - 1 ? "0" : o}; vertical-align: top;">\n\t\t\t\t\t&nbsp;\n\t\t\t\t</td>`;
		return s += "</tr>", `\n\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0;">\n\t\t\t\t${s}\n\t\t\t</table>`;
	}
	parseSidebarLayout(e, t) {
		let n = e.match(/<div class="sidebar">([\s\S]*?)<\/div>/), r = e.match(/<div class="main">([\s\S]*?)<\/div>/);
		if (!n || !r) return e;
		let i = `\n\t\t\t<td width="30%" style="padding: 0 16px 0 0; vertical-align: top; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">\n\t\t\t\t${this.parseBasicMarkdown(n[1].trim())}\n\t\t\t</td>`, a = `\n\t\t\t<td width="70%" style="padding: 0; vertical-align: top; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">\n\t\t\t\t${this.parseBasicMarkdown(r[1].trim())}\n\t\t\t</td>`;
		return `\n\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0;">\n\t\t\t\t${t === "left" ? `<tr>${i}${a}</tr>` : `<tr>${a}${i.replace("0 16px 0 0", "0 0 0 16px")}</tr>`}\n\t\t\t</table>`;
	}
	parseImageRowLayout(e) {
		let t = /<div class="image">([\s\S]*?)<\/div>/g, n = [], r;
		for (; (r = t.exec(e)) !== null;) {
			let e = r[1].trim().match(/!\[([^\]]*)\]\(([^)]+)\)/);
			if (e) {
				let [, t, r] = e;
				n.push(`<img src="${r}" alt="${t || "Image"}" style="display: block; max-width: 100%; height: auto;" border="0">`);
			}
		}
		if (n.length === 0) return e;
		let i = Math.floor(100 / n.length), a = "<tr>";
		return n.forEach((e, t) => {
			let r = t === n.length - 1 ? "0" : "0 8px 0 0";
			a += `\n\t\t\t\t<td width="${i}%" style="padding: ${r}; vertical-align: top; text-align: center;">\n\t\t\t\t\t${e}\n\t\t\t\t</td>`;
		}), a += "</tr>", `\n\t\t\t<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 16px 0;">\n\t\t\t\t${a}\n\t\t\t</table>`;
	}
	parseImageAttributes(e) {
		let t = {};
		if (!e) return t;
		let n = e.match(/width=([^\s}]+)/);
		n && (t.width = n[1]);
		let r = e.match(/height=([^\s}]+)/);
		return r && (t.height = r[1]), e.includes("cover") && (t.cover = !0), e.includes("contain") && (t.contain = !0), t;
	}
	generateImageStyles(e, t = !1) {
		let n, r, i = "display: block; margin: 8px 0; border: 0;";
		return e.width ? e.width === "auto" ? i += t ? " max-width: 100%; height: auto;" : " height: auto;" : e.width.endsWith("%") ? (i += ` width: ${e.width}; max-width: 100%;`, e.height || (i += " height: auto;")) : e.width.endsWith("px") && (n = e.width.replace("px", ""), i += " max-width: 100%;", e.height || (i += " height: auto;")) : i += t ? " width: 100%; max-width: 100%; height: auto;" : " max-width: 100%; height: auto;", e.height && (e.height === "auto" ? i += " height: auto;" : e.height.endsWith("px") && (r = e.height.replace("px", ""), e.width || (i += " max-width: 100%;"))), (e.cover || e.contain) && (e.width || e.height || (i += " width: 100%;")), {
			imgStyle: i,
			imgWidth: n,
			imgHeight: r
		};
	}
	parseBasicMarkdown(e) {
		return e.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, (e, t, n, r) => {
			let i = this.parseImageAttributes(r), { imgStyle: a, imgWidth: o, imgHeight: s } = this.generateImageStyles(i, !0), c = `<img src="${n}" alt="${t || "Image"}" style="${a}" border="0"`;
			return o && (c += ` width="${o}"`), s && (c += ` height="${s}"`), c += ">", c;
		}).replace(/\n\n/g, "</p><p style=\"margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;\">").replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong style=\"font-weight: bold;\">$1</strong>").replace(/\*(.*?)\*/g, "<em style=\"font-style: italic;\">$1</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\" style=\"color: #0066cc; text-decoration: underline;\">$1</a>").replace(/^# (.*$)/gim, "<h2 style=\"margin: 16px 0 8px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 18px; font-weight: bold; color: #1a1a1a;\">$1</h2>").replace(/^\* (.*$)/gim, "<li style=\"margin: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333;\">$1</li>").replace(/^\d+\. (.*$)/gim, "<li style=\"margin: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333;\">$1</li>").replace(/(<li[^>]*>.*?<\/li>(?:\s*<li[^>]*>.*?<\/li>)*)/gs, (e) => {
			let t = /^\d+\./.test(e.replace(/<[^>]*>/g, "")) ? "ol" : "ul";
			return `<${t} style="margin: 8px 0; padding: 0 0 0 20px; font-family: Arial, Helvetica, sans-serif;">${e}</${t}>`;
		}).replace(/^(?!<[h\d]|<p|<ul|<ol|<li|<img)(.+)$/gim, "<p style=\"margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;\">$1</p>");
	}
	parseExtendedMarkdown(e) {
		let t = e;
		return t = this.parseLayoutBlocks(t), t = t.replace(/:::images\s+(row|grid(?:=\d+)?)\n((?:!\[.*?\]\(.*?\)(?:\{.*?\})?\s*\n?)*?):::/g, "[Multiple Images - View in web browser]"), t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, (e, t, n, r) => {
			let i = this.parseImageAttributes(r), { imgStyle: a, imgWidth: o, imgHeight: s } = this.generateImageStyles(i, !1), c = `<img src="${n}" alt="${t || "Image"}" style="${a}" border="0"`;
			return o && (c += ` width="${o}"`), s && (c += ` height="${s}"`), c += ">", `<table cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0;"><tr><td>${c}</td></tr></table>`;
		}), t = t.replace(/\n\n/g, "</p><p style=\"margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;\">").replace(/\n/g, "<br>").replace(/\*\*(.*?)\*\*/g, "<strong style=\"font-weight: bold;\">$1</strong>").replace(/\*(.*?)\*/g, "<em style=\"font-style: italic;\">$1</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\" style=\"color: #0066cc; text-decoration: underline;\">$1</a>").replace(/^# (.*$)/gim, "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"margin: 24px 0 16px 0;\"><tr><td><h1 style=\"margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; color: #1a1a1a;\">$1</h1></td></tr></table>").replace(/^\* (.*$)/gim, "<li style=\"margin: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333;\">$1</li>").replace(/^\d+\. (.*$)/gim, "<li style=\"margin: 4px 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333333;\">$1</li>").replace(/^---$/gim, "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" width=\"100%\" style=\"margin: 24px 0;\"><tr><td style=\"border-top: 1px solid #e0e0e0; height: 1px; line-height: 1px;\">&nbsp;</td></tr></table>"), t = t.replace(/(<li[^>]*>.*?<\/li>(?:\s*<li[^>]*>.*?<\/li>)*)/gs, (e) => {
			let t = /^\d+\./.test(e.replace(/<[^>]*>/g, "")) ? "ol" : "ul";
			return `<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td><${t} style="margin: 16px 0; padding: 0 0 0 20px; font-family: Arial, Helvetica, sans-serif;">${e}</${t}></td></tr></table>`;
		}), t.includes("<table>") || t.includes("<h1>") || (t = `<p style="margin: 0 0 16px 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">${t}</p>`), t = `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">\n\t\t\t<tr>\n\t\t\t\t<td style="padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">\n\t\t\t\t\t${t}\n\t\t\t\t</td>\n\t\t\t</tr>\n\t\t</table>`, t;
	}
	convertToPlainText(e) {
		return e.trim().replace(/:::layout\s+([a-zA-Z0-9-]+)\n([\s\S]*?)\n:::/g, (e, t, n) => n.replace(/<div class="(?:column|sidebar|main|image)">/g, "\n").replace(/<\/div>/g, "\n").replace(/\n{3,}/g, "\n\n").trim()).replace(/:::images\s+(row|grid(?:=\d+)?)\n((?:!\[.*?\]\(.*?\)(?:\{.*?\})?\s*\n?)*?):::/g, "[Images]").replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, "[Image: $1]").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/__(.*?)__/g, "$1").replace(/~~(.*?)~~/g, "$1").replace(/`(.*?)`/g, "$1").replace(/^#{1,3} (.*$)/gim, "$1").replace(/^> (.*$)/gim, "$1").replace(/^\* (.*$)/gim, "• $1").replace(/^\d+\. (.*$)/gim, "$1").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)").replace(/^---$/gim, "---").replace(/\n\n+/g, "\n\n");
	}
	formatFileSize(e) {
		if (e === 0) return "0 Bytes";
		let t = Math.floor(Math.log(e) / Math.log(1024));
		return parseFloat((e / 1024 ** t).toFixed(2)) + " " + [
			"Bytes",
			"KB",
			"MB",
			"GB"
		][t];
	}
	render() {
		let e = this.parseExtendedMarkdown(this.body), t = this.convertToPlainText(this.body), n = this.recipients[0] || this.toAddress;
		return f`
			<schmancy-surface type="solid" rounded="all" class="h-full flex flex-col">
				
				<!-- Header Section -->
				<div class="shrink-0 p-4 border-b border-outline-variant">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<schmancy-typography type="title" token="md" class="flex items-center gap-2">
							<schmancy-icon size="20px">preview</schmancy-icon>
							Email Preview
						</schmancy-typography>
						
						<!-- View Mode Toggle -->
						<div class="flex gap-1 bg-surface-container rounded-full p-1">
							<schmancy-chip 
								?selected=${this.viewMode === "html"}
								@click=${() => {
			this.viewMode = "html";
		}}
								class="text-xs h-8"
								data-variant=${this.viewMode === "html" ? "filled" : "outlined"}
							>
								<schmancy-icon slot="prefix" size="14px">code</schmancy-icon>
								HTML
							</schmancy-chip>
							<schmancy-chip 
								?selected=${this.viewMode === "plaintext"}
								@click=${() => {
			this.viewMode = "plaintext";
		}}
								class="text-xs h-8"
								data-variant=${this.viewMode === "plaintext" ? "filled" : "outlined"}
							>
								<schmancy-icon slot="prefix" size="14px">text_fields</schmancy-icon>
								Text
							</schmancy-chip>
						</div>
					</div>
				</div>

				<!-- Preview Content Container -->
				<div class="flex-1 flex flex-col min-h-0 p-4 gap-4">
					
					<!-- Email Mock Container -->
					<div class="flex-1 flex flex-col min-h-0">
						<schmancy-surface 
							type="subtle"
							rounded="all"
							class="flex-1 flex flex-col overflow-hidden shadow-sm"
						>
							<!-- Email Header -->
							<div class="shrink-0 p-4 bg-surface-containerLow border-b border-outline-variant">
								<div class="space-y-3">
									<!-- From Field -->
									<div class="flex items-start gap-3">
										<div class="flex items-center gap-2 min-w-0 shrink-0 w-16">
											<schmancy-icon size="16px">account_circle</schmancy-icon>
											<schmancy-typography type="body" token="sm" class="font-medium">
												From
											</schmancy-typography>
										</div>
										<schmancy-typography type="body" token="sm" class="break-all flex-1">
											${this.fromAddress}
										</schmancy-typography>
									</div>
									
									<!-- To Field -->
									<div class="flex items-start gap-3">
										<div class="flex items-center gap-2 min-w-0 shrink-0 w-16">
											<schmancy-icon size="16px">person</schmancy-icon>
											<schmancy-typography type="body" token="sm" class="font-medium">
												To
											</schmancy-typography>
										</div>
										<schmancy-typography type="body" token="sm" class="break-all flex-1">
											${n}
										</schmancy-typography>
									</div>
									
									<!-- Subject Field -->
									<div class="flex items-start gap-3">
										<div class="flex items-center gap-2 min-w-0 shrink-0 w-16">
											<schmancy-icon size="16px">subject</schmancy-icon>
											<schmancy-typography type="body" token="sm" class="font-medium">
												Subject
											</schmancy-typography>
										</div>
										<schmancy-typography type="body" token="sm" class="font-medium flex-1">
											${this.subject || f`<span class="italic text-surface-onVariant">(No subject)</span>`}
										</schmancy-typography>
									</div>
								</div>
							</div>

							<!-- Email Body Content -->
							<div class="flex-1 overflow-y-auto min-h-0">
								${g(this.body, () => f`
										${g(this.viewMode === "html", () => f`
												<div class="p-6 bg-white" style="color: #333; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif; font-size: 14px;">
													<div .innerHTML=${e}></div>
												</div>
											`, () => f`
												<div class="p-6 bg-white" style="color: #333; line-height: 1.6; font-family: 'Courier New', monospace; font-size: 13px; white-space: pre-wrap;">
													${t}
												</div>
											`)}
									`, () => f`
										<!-- Empty State -->
										<div class="flex-1 flex items-center justify-center p-8">
											<div class="text-center space-y-3">
												<schmancy-icon size="48px" class="text-surface-onVariant opacity-50">mail_outline</schmancy-icon>
												<schmancy-typography type="body" token="md">
													No message content to preview
												</schmancy-typography>
												<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
													Start typing in the composer to see a preview
												</schmancy-typography>
											</div>
										</div>
									`)}
							</div>

							<!-- Attachments Section -->
							${g(this.attachments.length > 0, () => f`
								<div class="shrink-0 p-4 border-t border-outline-variant bg-surface-containerLowest">
									<div class="space-y-3">
										<!-- Attachments Header -->
										<div class="flex items-center gap-2">
											<schmancy-icon size="18px">attach_file</schmancy-icon>
											<schmancy-typography type="label" token="md" class="font-medium">
												Attachments (${this.attachments.length})
											</schmancy-typography>
										</div>
										
										<!-- Attachments List -->
										<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
											${h(this.attachments, (e) => e.id, (e) => f`
												<schmancy-surface type="subtle" rounded="all" class="p-3">
													<div class="flex items-center gap-3">
														<!-- File Icon -->
														<schmancy-icon size="20px" class="text-surface-onVariant shrink-0">
															${e.type.startsWith("image/") ? "image" : e.type.includes("pdf") ? "picture_as_pdf" : e.type.includes("text") ? "description" : "attach_file"}
														</schmancy-icon>
														
														<!-- File Info -->
														<div class="flex-1 min-w-0">
															<schmancy-typography type="body" token="sm" class="font-medium truncate">
																${e.name}
															</schmancy-typography>
															<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
																${this.formatFileSize(e.size)} • ${e.type}
															</schmancy-typography>
														</div>
													</div>
												</schmancy-surface>
											`)}
										</div>
									</div>
								</div>
							`)}
						</schmancy-surface>
					</div>
					
					<!-- Preview Stats -->
					${g(this.body, () => f`
						<div class="shrink-0">
							<schmancy-surface type="subtle" rounded="all" class="p-3">
								<div class="flex items-center justify-center gap-6 text-center">
									<div>
										<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
											Characters
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="font-medium">
											${this.body.length}
										</schmancy-typography>
									</div>
									<div class="w-px h-8 bg-outline-variant"></div>
									<div>
										<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
											Words
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="font-medium">
											${this.body.trim() ? this.body.trim().split(/\s+/).length : 0}
										</schmancy-typography>
									</div>
									${g(this.attachments.length > 0, () => f`
										<div class="w-px h-8 bg-outline-variant"></div>
										<div>
											<schmancy-typography type="body" token="xs" class="text-surface-onVariant">
												Attachments
											</schmancy-typography>
											<schmancy-typography type="body" token="sm" class="font-medium">
												${this.attachments.length}
											</schmancy-typography>
										</div>
									`)}
								</div>
							</schmancy-surface>
						</div>
					`)}
					
				</div>
			</schmancy-surface>
		`;
	}
};
t([l({ type: String })], x.prototype, "subject", void 0), t([l({ type: String })], x.prototype, "body", void 0), t([l({ type: Array })], x.prototype, "attachments", void 0), t([l({ type: Array })], x.prototype, "recipients", void 0), t([l({ type: String })], x.prototype, "fromAddress", void 0), t([l({ type: String })], x.prototype, "toAddress", void 0), t([u()], x.prototype, "viewMode", void 0), x = t([c("schmancy-email-viewer")], x);
var S = class extends n(d`
	:host {
		display: block;
		height: 100%;
	}
`) {
	constructor(...e) {
		super(...e), this.disabled = !1, this.recipients = [], this.selectedRecipients = [], this.enableCsvImport = !0, this.enableDragDrop = !0, this.title = "Recipients", this.emptyStateTitle = "No recipients yet", this.emptyStateMessage = "Import from sources or upload a CSV", this.dragOver = !1, this.localSelectedRecipients = /* @__PURE__ */ new Set(), this.searchQuery = "", this.filteredRecipients = [], this.boatState = "collapsed", this.fileInputRef = p(), this.handleEmailsImported = () => {
			this.updateFilteredRecipients(), this.requestUpdate();
		}, this.handleImportFromCSV = () => {
			this.enableCsvImport && this.fileInputRef.value?.click();
		}, this.handleFileSelect = (e) => {
			let t = e.target.files?.[0];
			t && this.processCSVFile(t);
		}, this.handleDrop = (e) => {
			if (!this.enableDragDrop) return;
			e.preventDefault(), this.dragOver = !1;
			let t = e.dataTransfer?.files[0];
			t && this.processCSVFile(t);
		}, this.processCSVFile = (e) => {
			if (!e.name.endsWith(".csv")) return void a.error("Please select a CSV file");
			let t = new FileReader();
			t.onload = (e) => {
				let t = e.target?.result;
				try {
					let e = this.parseCSV(t);
					if (e.length === 0) return void a.error("No valid email addresses found in CSV");
					this.dispatchEvent(new CustomEvent("emails-imported", {
						detail: {
							emails: e,
							source: "csv"
						},
						bubbles: !0,
						composed: !0
					})), a.success(`Imported ${e.length} emails from CSV file`);
				} catch {
					a.error("Failed to parse CSV file");
				}
			}, t.readAsText(e);
		}, this.toggleRecipientSelection = (e) => {
			this.localSelectedRecipients.has(e) ? this.localSelectedRecipients.delete(e) : this.localSelectedRecipients.add(e), this.localSelectedRecipients = new Set(this.localSelectedRecipients), this.dispatchSelectionChange();
		}, this.selectAll = () => {
			this.localSelectedRecipients = new Set(this.filteredRecipients), this.dispatchSelectionChange();
		}, this.selectNone = () => {
			this.localSelectedRecipients.clear(), this.localSelectedRecipients = /* @__PURE__ */ new Set(), this.dispatchSelectionChange();
		}, this.removeRecipient = (e) => {
			this.dispatchEvent(new CustomEvent("recipient-removed", {
				detail: { email: e },
				bubbles: !0,
				composed: !0
			}));
		}, this.clearAll = () => {
			this.dispatchEvent(new CustomEvent("recipients-cleared", {
				bubbles: !0,
				composed: !0
			}));
		}, this.updateFilteredRecipients = () => {
			let e = Array.isArray(this.recipients) ? this.recipients : [];
			if (this.searchQuery.trim()) {
				let t = this.searchQuery.toLowerCase();
				this.filteredRecipients = e.filter((e) => e.toLowerCase().includes(t));
			} else this.filteredRecipients = [...e];
		}, this.handleSearchInput = (e) => {
			let t = e.target;
			this.searchQuery = t.value;
		}, this.clearSearch = () => {
			this.searchQuery = "";
		}, this.dispatchSelectionChange = () => {
			this.dispatchEvent(new CustomEvent("selection-changed", {
				detail: { selectedEmails: Array.from(this.localSelectedRecipients) },
				bubbles: !0,
				composed: !0
			}));
		}, this.handleBoatStateChange = (e) => {
			this.boatState = e.detail;
		};
	}
	connectedCallback() {
		super.connectedCallback(), this.localSelectedRecipients = new Set(this.selectedRecipients), this.updateFilteredRecipients(), o(this, "emails-imported").pipe(s(this.disconnecting)).subscribe(this.handleEmailsImported);
	}
	updated(e) {
		super.updated(e), e.has("selectedRecipients") && (this.localSelectedRecipients = new Set(this.selectedRecipients)), (e.has("recipients") || e.has("searchQuery")) && this.updateFilteredRecipients(), e.has("recipients") && this.requestUpdate();
	}
	parseCSV(e) {
		let t = [], n;
		n = this.csvParser ? this.csvParser.parse(e, {
			header: !0,
			skipEmptyLines: !0,
			dynamicTyping: !0,
			delimiter: "",
			transformHeader: (e) => e.trim()
		}) : this.simpleCSVParse(e);
		let r = n.data, i = n.meta.fields || [], a = i.find((e) => e.toLowerCase().includes("email"));
		if (!a) for (let e of i) {
			let t = r[0]?.[e]?.toString();
			if (t && this.isValidEmail(t)) {
				a = e;
				break;
			}
		}
		if (!a) throw Error("No email column found in CSV");
		let o = /* @__PURE__ */ new Set();
		for (let e of r) {
			let n = e[a]?.toString();
			if (!n) continue;
			let r = n.toLowerCase().trim();
			this.isValidEmail(r) && !o.has(r) && (o.add(r), t.push(r));
		}
		return t;
	}
	simpleCSVParse(e) {
		let t = e.split("\n").filter((e) => e.trim());
		if (t.length === 0) return {
			data: [],
			meta: {}
		};
		let n = t[0].split(",").map((e) => e.trim().replace(/"/g, "")), r = [];
		for (let e = 1; e < t.length; e++) {
			let i = t[e].split(",").map((e) => e.trim().replace(/"/g, "")), a = {};
			n.forEach((e, t) => {
				a[e] = i[t] || "";
			}), r.push(a);
		}
		return {
			data: r,
			meta: { fields: n }
		};
	}
	isValidEmail(e) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
	}
	addRecipients(e) {
		if (!e.length) return;
		let t = [...new Set([...this.recipients, ...e])], n = e.filter((e) => !this.recipients.includes(e));
		this.recipients = t, this.selectedRecipients = [...new Set([...this.selectedRecipients, ...n])], this.localSelectedRecipients = new Set(this.selectedRecipients), this.updateFilteredRecipients(), this.requestUpdate();
	}
	showBoat() {
		this.boatState = "collapsed";
	}
	hideBoat() {
		this.boatState = "collapsed";
	}
	expandBoat() {
		this.boatState = "expanded";
	}
	toggleBoat() {
		this.boatState = this.boatState === "collapsed" ? "expanded" : "collapsed";
	}
	render() {
		return this.renderBoatLayout();
	}
	renderBoatLayout() {
		return f`
			<!-- Hidden file input for CSV import -->
			${g(this.enableCsvImport, () => f`
				<input
					type="file"
					accept=".csv"
					${m(this.fileInputRef)}
					@change=${this.handleFileSelect}
					class="hidden"
				/>
			`)}

			<schmancy-boat 
				.state=${this.boatState}
				@change=${this.handleBoatStateChange}
			>
				<!-- Boat Header -->
				<div slot="header" class="flex items-center justify-between w-full px-4 py-2">
					<div class="flex items-center gap-3">
						<schmancy-icon size="20px">group</schmancy-icon>
						<schmancy-typography type="title" token="md" class="font-semibold">
							${this.title}
						</schmancy-typography>
						${g(this.recipients.length > 0, () => f`
							<schmancy-badge>
								${this.localSelectedRecipients.size}/${this.recipients.length}
							</schmancy-badge>
						`)}
					</div>
				</div>

				<!-- Boat Content -->
				<div class="h-full flex flex-col max-h-[70vh]">
					${this.renderBoatContent()}
				</div>
			</schmancy-boat>
		`;
	}
	renderBoatContent() {
		return f`
			<!-- Search Bar and CSV Import on one line -->
			<div class="p-4 flex gap-3">
				<schmancy-input
					type="text"
					placeholder="Search recipients"
					.value=${this.searchQuery}
					@input=${this.handleSearchInput}
					class="flex-1"
				>
					${g(this.searchQuery, () => f`
						<schmancy-button
							slot="suffix" 
							variant="text"
							@click=${this.clearSearch}
						>
							<schmancy-icon size="16px">close</schmancy-icon>
						</schmancy-button>
					`)}
				</schmancy-input>
				
				${g(this.enableCsvImport, () => f`
					<schmancy-button
						variant="outlined"
						@click=${this.handleImportFromCSV}
						?disabled=${this.disabled}
					>
						<schmancy-icon slot="prefix" size="16px">upload_file</schmancy-icon>
						Import
					</schmancy-button>
				`)}
			</div>

			${g(this.recipients.length > 0, () => f`
				<!-- Bulk Actions -->
				<div class="px-4 pb-4">
					<div class="flex items-center gap-3">
						<schmancy-button 
							variant="outlined"
							@click=${this.selectAll}
							?disabled=${this.localSelectedRecipients.size === this.filteredRecipients.length}
						>
							<schmancy-icon slot="prefix" size="14px">select_all</schmancy-icon>
							Select All
						</schmancy-button>
						
						<schmancy-button 
							variant="outlined"
							@click=${this.selectNone}
							?disabled=${this.localSelectedRecipients.size === 0}
						>
							<schmancy-icon slot="prefix" size="14px">deselect</schmancy-icon>
							Clear Selection
						</schmancy-button>
						
						<div class="flex-1"></div>
						
						<schmancy-button variant="text" @click=${this.clearAll}>
							<schmancy-icon slot="prefix" size="14px">delete_forever</schmancy-icon>
							Clear All
						</schmancy-button>
					</div>
				</div>

				<!-- Recipients List -->
				<div class="flex-1 overflow-y-auto px-4 pb-4">
					${g(this.filteredRecipients.length > 0, () => f`
							<div class="flex flex-wrap gap-3">
								${h(this.filteredRecipients, (e) => e, (e) => f`
										<schmancy-button
											variant=${this.localSelectedRecipients.has(e) ? "filled" : "outlined"}
											@click=${(t) => {
			t.stopPropagation(), t.preventDefault(), this.toggleRecipientSelection(e);
		}}
											class="cursor-pointer flex items-center gap-2"
										>
											<span class="truncate flex-1 text-left">${e}</span>
											<schmancy-icon
												@click=${(t) => {
			t.stopPropagation(), this.removeRecipient(e);
		}}
												size="16px"
												class="ml-2"
											>close</schmancy-icon>
										</schmancy-button>
									`)}
							</div>
						`, () => f`
							<div class="text-center py-8">
								<schmancy-icon size="32px" class="opacity-50 mb-2">search_off</schmancy-icon>
								<schmancy-typography type="body" token="sm" class="mb-2">
									No recipients match "${this.searchQuery}"
								</schmancy-typography>
								<schmancy-button variant="outlined" @click=${this.clearSearch}>
									Clear Search
								</schmancy-button>
							</div>
						`)}
				</div>
			`, () => f`
				<!-- Empty State -->
				<div class="flex-1 flex items-center justify-center p-8">
					<div class="text-center space-y-4">
						<schmancy-icon size="48px" class="opacity-30">mail_outline</schmancy-icon>
						<schmancy-typography type="title" token="md" class="mb-2">
							${this.emptyStateTitle}
						</schmancy-typography>
						<schmancy-typography type="body" token="sm">
							${this.emptyStateMessage}
						</schmancy-typography>
					</div>
				</div>
			`)}

			<!-- Drag Overlay -->
			${g(this.dragOver && this.enableDragDrop, () => f`
					<div 
						class="absolute inset-4 flex items-center justify-center border-2 border-dashed border-primary rounded-lg z-10"
						@dragover=${(e) => {
			e.preventDefault(), this.dragOver = !0;
		}}
						@dragleave=${() => this.dragOver = !1}
						@drop=${this.handleDrop}
					>
						<schmancy-surface type="solid" rounded="all" class="p-6 text-center">
							<schmancy-icon size="48px" class="mb-2">upload</schmancy-icon>
							<schmancy-typography type="body" token="md">
								Drop CSV file here
							</schmancy-typography>
						</schmancy-surface>
					</div>
				`)}
		`;
	}
};
t([l({ type: Boolean })], S.prototype, "disabled", void 0), t([l({ type: Array })], S.prototype, "recipients", void 0), t([l({ type: Array })], S.prototype, "selectedRecipients", void 0), t([l({ type: Boolean })], S.prototype, "enableCsvImport", void 0), t([l({ type: Boolean })], S.prototype, "enableDragDrop", void 0), t([l({ type: String })], S.prototype, "title", void 0), t([l({ type: String })], S.prototype, "emptyStateTitle", void 0), t([l({ type: String })], S.prototype, "emptyStateMessage", void 0), t([l({ type: Object })], S.prototype, "csvParser", void 0), t([u()], S.prototype, "dragOver", void 0), t([u()], S.prototype, "localSelectedRecipients", void 0), t([u()], S.prototype, "searchQuery", void 0), t([u()], S.prototype, "filteredRecipients", void 0), t([u()], S.prototype, "boatState", void 0), S = t([c("schmancy-email-recipients")], S);
export { _ as a, v as i, x as n, b as r, S as t };
