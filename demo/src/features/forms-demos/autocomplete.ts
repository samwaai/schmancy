import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

@customElement('demo-forms-autocomplete')
export default class DemoFormsAutocomplete extends $LitElement() {
	// Basic autocomplete state
	@state() private basicValue = ''

	// Multi-select state
	@state() private multiValues: string[] = ['react', 'vue']

	// Country autocomplete state
	@state() private selectedCountry = 'us'

	// Dynamic options state
	@state() private selectedEmployee = ''
	@state() private employees = [
		{ id: 'emp1', name: 'Alice Johnson', department: 'Engineering' },
		{ id: 'emp2', name: 'Bob Smith', department: 'Design' },
		{ id: 'emp3', name: 'Charlie Brown', department: 'Marketing' },
		{ id: 'emp4', name: 'Diana Prince', department: 'Sales' },
		{ id: 'emp5', name: 'Edward Norton', department: 'HR' },
		{ id: 'emp6', name: 'Fiona Green', department: 'Engineering' },
		{ id: 'emp7', name: 'George Wilson', department: 'Finance' },
		{ id: 'emp8', name: 'Hannah Montana', department: 'Design' },
		{ id: 'emp9', name: 'Isaac Newton', department: 'Research' },
		{ id: 'emp10', name: 'Julia Roberts', department: 'Marketing' },
	]

	// Programming languages for multi-select
	@state() private selectedLanguages: string[] = ['javascript', 'typescript']

	// Custom similarity threshold example
	@state() private strictSearchValue = ''
	@state() private looseSearchValue = ''

	// Form validation example
	@state() private formDepartment = ''
	@state() private formSkills: string[] = []
	@state() private formName = ''

	// Large dataset example
	@state() private selectedCity = ''
	private cities = [
		'New York',
		'Los Angeles',
		'Chicago',
		'Houston',
		'Phoenix',
		'Philadelphia',
		'San Antonio',
		'San Diego',
		'Dallas',
		'San Jose',
		'Austin',
		'Jacksonville',
		'Fort Worth',
		'Columbus',
		'Charlotte',
		'San Francisco',
		'Indianapolis',
		'Seattle',
		'Denver',
		'Washington',
		'Boston',
		'Nashville',
		'El Paso',
		'Detroit',
		'Portland',
		'Memphis',
		'Oklahoma City',
		'Las Vegas',
		'Louisville',
		'Baltimore',
		'Milwaukee',
		'Albuquerque',
		'Tucson',
		'Fresno',
		'Sacramento',
		'Kansas City',
		'Mesa',
		'Atlanta',
		'Long Beach',
		'Colorado Springs',
		'Raleigh',
		'Miami',
		'Virginia Beach',
		'Omaha',
		'Oakland',
		'Minneapolis',
		'Tulsa',
		'Arlington',
		'Tampa',
		'New Orleans',
	]

	// Dynamic data examples using repeat directive
	@state() private selectedTerminals: string[] = ['term-001', 'term-003']
	@state() private availableTerminals = [
		{ id: 'term-001', name: 'Terminal A', location: 'North Wing' },
		{ id: 'term-002', name: 'Terminal B', location: 'South Wing' },
		{ id: 'term-003', name: 'Terminal C', location: 'East Wing' },
		{ id: 'term-004', name: 'Terminal D', location: 'West Wing' },
		{ id: 'term-005', name: 'Terminal E', location: 'Central Hub' },
	]

	@state() private selectedUsers: string[] = []
	@state() private usersList = [
		{ id: 'usr-001', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
		{ id: 'usr-002', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
		{ id: 'usr-003', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer' },
		{ id: 'usr-004', name: 'Diana Prince', email: 'diana@example.com', role: 'Editor' },
		{ id: 'usr-005', name: 'Edward Norton', email: 'edward@example.com', role: 'Admin' },
		{ id: 'usr-006', name: 'Fiona Green', email: 'fiona@example.com', role: 'Viewer' },
		{ id: 'usr-007', name: 'George Wilson', email: 'george@example.com', role: 'Editor' },
		{ id: 'usr-008', name: 'Hannah Montana', email: 'hannah@example.com', role: 'Viewer' },
	]

	@state() private selectedProducts: string[] = []
	@state() private productCatalog = [
		{ sku: 'PRD-001', name: 'Laptop Pro', category: 'Electronics', price: 1299.99, inStock: true },
		{ sku: 'PRD-002', name: 'Wireless Mouse', category: 'Accessories', price: 29.99, inStock: true },
		{ sku: 'PRD-003', name: 'USB-C Hub', category: 'Accessories', price: 49.99, inStock: false },
		{ sku: 'PRD-004', name: 'Monitor 27"', category: 'Electronics', price: 399.99, inStock: true },
		{ sku: 'PRD-005', name: 'Keyboard Mechanical', category: 'Accessories', price: 89.99, inStock: true },
		{ sku: 'PRD-006', name: 'Webcam HD', category: 'Electronics', price: 79.99, inStock: false },
		{ sku: 'PRD-007', name: 'Desk Lamp', category: 'Office', price: 34.99, inStock: true },
		{ sku: 'PRD-008', name: 'Cable Organizer', category: 'Office', price: 12.99, inStock: true },
	]

	@state() private selectedTags: string[] = []
	@state() private tagOptions = [
		{ id: 'urgent', label: 'Urgent', color: 'red' },
		{ id: 'important', label: 'Important', color: 'orange' },
		{ id: 'in-progress', label: 'In Progress', color: 'blue' },
		{ id: 'review', label: 'Review', color: 'purple' },
		{ id: 'completed', label: 'Completed', color: 'green' },
		{ id: 'archived', label: 'Archived', color: 'gray' },
		{ id: 'feature', label: 'Feature', color: 'teal' },
		{ id: 'bug', label: 'Bug', color: 'pink' },
	]

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Header -->
				<schmancy-typography type="display" token="lg" class="mb-4 block"> Autocomplete </schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					A searchable dropdown with fuzzy search, keyboard navigation, and multi-select support.
				</schmancy-typography>

				<!-- Basic Autocomplete -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block">Basic Autocomplete</schmancy-typography>

					<schmancy-grid gap="lg" class="w-full mb-8">
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<!-- Simple Autocomplete -->
								<schmancy-autocomplete
									label="Select Framework"
									placeholder="Type to search..."
									.value=${this.basicValue}
									@change=${(e: CustomEvent) => {
										this.basicValue = e.detail.value
										console.log('Selected:', e.detail.value)
									}}
								>
									<schmancy-option value="angular" label="Angular"></schmancy-option>
									<schmancy-option value="react" label="React"></schmancy-option>
									<schmancy-option value="vue" label="Vue.js"></schmancy-option>
									<schmancy-option value="svelte" label="Svelte"></schmancy-option>
									<schmancy-option value="ember" label="Ember.js"></schmancy-option>
									<schmancy-option value="backbone" label="Backbone.js"></schmancy-option>
								</schmancy-autocomplete>

								<!-- With Initial Value -->
								<schmancy-autocomplete
									label="Country"
									placeholder="Select country..."
									.value=${this.selectedCountry}
									@change=${(e: CustomEvent) => {
										this.selectedCountry = e.detail.value
									}}
								>
									<schmancy-option value="us" label="United States"></schmancy-option>
									<schmancy-option value="ca" label="Canada"></schmancy-option>
									<schmancy-option value="mx" label="Mexico"></schmancy-option>
									<schmancy-option value="uk" label="United Kingdom"></schmancy-option>
									<schmancy-option value="fr" label="France"></schmancy-option>
									<schmancy-option value="de" label="Germany"></schmancy-option>
									<schmancy-option value="jp" label="Japan"></schmancy-option>
									<schmancy-option value="au" label="Australia"></schmancy-option>
								</schmancy-autocomplete>

								<!-- Required Field -->
								<schmancy-autocomplete
									label="Department"
									placeholder="Select department..."
									required
									description="This field is required"
								>
									<schmancy-option value="hr" label="Human Resources"></schmancy-option>
									<schmancy-option value="eng" label="Engineering"></schmancy-option>
									<schmancy-option value="fin" label="Finance"></schmancy-option>
									<schmancy-option value="mkt" label="Marketing"></schmancy-option>
									<schmancy-option value="ops" label="Operations"></schmancy-option>
									<schmancy-option value="sales" label="Sales"></schmancy-option>
								</schmancy-autocomplete>

								<!-- Different Sizes -->
								<div class="flex flex-col gap-4">
									<schmancy-autocomplete label="Small Size" size="sm" placeholder="Size small...">
										<schmancy-option value="opt1" label="Option 1"></schmancy-option>
										<schmancy-option value="opt2" label="Option 2"></schmancy-option>
										<schmancy-option value="opt3" label="Option 3"></schmancy-option>
									</schmancy-autocomplete>

									<schmancy-autocomplete label="Large Size" size="lg" placeholder="Size large...">
										<schmancy-option value="opt1" label="Option 1"></schmancy-option>
										<schmancy-option value="opt2" label="Option 2"></schmancy-option>
										<schmancy-option value="opt3" label="Option 3"></schmancy-option>
									</schmancy-autocomplete>
								</div>
							</div>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>

				<!-- Multi-Select -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block">Multi-Select</schmancy-typography>

					<schmancy-grid gap="lg" class="w-full mb-8">
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<!-- Basic Multi-Select -->
								<schmancy-autocomplete
									label="Programming Languages"
									placeholder="Select multiple languages..."
									multi
									.values=${this.selectedLanguages}
									@change=${(e: CustomEvent) => {
										this.selectedLanguages = e.detail.values || []
										console.log('Selected languages:', this.selectedLanguages)
									}}
								>
									<schmancy-option value="javascript" label="JavaScript"></schmancy-option>
									<schmancy-option value="typescript" label="TypeScript"></schmancy-option>
									<schmancy-option value="python" label="Python"></schmancy-option>
									<schmancy-option value="java" label="Java"></schmancy-option>
									<schmancy-option value="csharp" label="C#"></schmancy-option>
									<schmancy-option value="go" label="Go"></schmancy-option>
									<schmancy-option value="rust" label="Rust"></schmancy-option>
									<schmancy-option value="swift" label="Swift"></schmancy-option>
									<schmancy-option value="kotlin" label="Kotlin"></schmancy-option>
									<schmancy-option value="ruby" label="Ruby"></schmancy-option>
								</schmancy-autocomplete>

								<!-- Pre-selected Multi-Select -->
								<schmancy-autocomplete
									label="Frontend Frameworks"
									placeholder="Choose frameworks..."
									multi
									.values=${this.multiValues}
									@change=${(e: CustomEvent) => {
										this.multiValues = e.detail.values || []
									}}
								>
									<schmancy-option value="react" label="React"></schmancy-option>
									<schmancy-option value="vue" label="Vue.js"></schmancy-option>
									<schmancy-option value="angular" label="Angular"></schmancy-option>
									<schmancy-option value="svelte" label="Svelte"></schmancy-option>
									<schmancy-option value="nextjs" label="Next.js"></schmancy-option>
									<schmancy-option value="nuxt" label="Nuxt.js"></schmancy-option>
									<schmancy-option value="gatsby" label="Gatsby"></schmancy-option>
								</schmancy-autocomplete>

								<!-- Skills Selection -->
								<schmancy-autocomplete
									label="Skills"
									placeholder="Select your skills..."
									multi
									.values=${this.formSkills}
									description="Select all that apply"
									@change=${(e: CustomEvent) => {
										this.formSkills = e.detail.values || []
									}}
								>
									<schmancy-option value="frontend" label="Frontend Development"></schmancy-option>
									<schmancy-option value="backend" label="Backend Development"></schmancy-option>
									<schmancy-option value="mobile" label="Mobile Development"></schmancy-option>
									<schmancy-option value="devops" label="DevOps"></schmancy-option>
									<schmancy-option value="testing" label="Testing/QA"></schmancy-option>
									<schmancy-option value="design" label="UI/UX Design"></schmancy-option>
									<schmancy-option value="database" label="Database Management"></schmancy-option>
									<schmancy-option value="security" label="Security"></schmancy-option>
								</schmancy-autocomplete>

								<!-- Display Selected Values -->
								<div class="col-span-full">
									${this.selectedLanguages.length > 0
										? html`
												<schmancy-surface type="surfaceDim" class="rounded-lg p-4">
													<schmancy-typography type="body" token="sm" class="mb-2">
														Selected Languages:
													</schmancy-typography>
													<div class="flex flex-wrap gap-2">
														${this.selectedLanguages.map(
															lang => html` <schmancy-chip type="assist">${lang}</schmancy-chip> `,
														)}
													</div>
												</schmancy-surface>
											`
										: ''}
								</div>
							</div>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>

				<!-- Dynamic Options -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block">Dynamic Options</schmancy-typography>

					<schmancy-grid gap="lg" class="w-full mb-8">
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<!-- Dynamic Employee List -->
								<schmancy-autocomplete
									label="Select Employee"
									placeholder="Search by name or department..."
									.value=${this.selectedEmployee}
									@change=${(e: CustomEvent) => {
										this.selectedEmployee = e.detail.value
										const employee = this.employees.find(emp => emp.id === e.detail.value)
										console.log('Selected employee:', employee)
									}}
								>
									${this.employees.map(
										employee => html`
											<schmancy-option
												value=${employee.id}
												label="${employee.name} - ${employee.department}"
											></schmancy-option>
										`,
									)}
								</schmancy-autocomplete>

								<!-- Large Dataset (Cities) -->
								<schmancy-autocomplete
									label="Select City"
									placeholder="Search cities..."
									.value=${this.selectedCity}
									maxHeight="400px"
									@change=${(e: CustomEvent) => {
										this.selectedCity = e.detail.value
									}}
								>
									${this.cities.map(
										city => html`
											<schmancy-option value=${city.toLowerCase().replace(/\s+/g, '-')} label=${city}></schmancy-option>
										`,
									)}
								</schmancy-autocomplete>

								<!-- With Icons -->
								<schmancy-autocomplete label="File Type" placeholder="Select file type...">
									<schmancy-option value="pdf" label="PDF Document">
										<schmancy-icon slot="leading" size="sm">picture_as_pdf</schmancy-icon>
									</schmancy-option>
									<schmancy-option value="doc" label="Word Document">
										<schmancy-icon slot="leading" size="sm">description</schmancy-icon>
									</schmancy-option>
									<schmancy-option value="xls" label="Excel Spreadsheet">
										<schmancy-icon slot="leading" size="sm">table_chart</schmancy-icon>
									</schmancy-option>
									<schmancy-option value="img" label="Image">
										<schmancy-icon slot="leading" size="sm">image</schmancy-icon>
									</schmancy-option>
									<schmancy-option value="video" label="Video">
										<schmancy-icon slot="leading" size="sm">videocam</schmancy-icon>
									</schmancy-option>
									<schmancy-option value="audio" label="Audio">
										<schmancy-icon slot="leading" size="sm">audiotrack</schmancy-icon>
									</schmancy-option>
								</schmancy-autocomplete>

								<!-- With Descriptions -->
								<schmancy-autocomplete label="Database Type" placeholder="Choose database...">
									<schmancy-option value="postgresql" label="PostgreSQL">
										<div class="py-1">
											<div class="font-medium">PostgreSQL</div>
											<div class="text-sm text-surface-onVariant">Open source relational database</div>
										</div>
									</schmancy-option>
									<schmancy-option value="mongodb" label="MongoDB">
										<div class="py-1">
											<div class="font-medium">MongoDB</div>
											<div class="text-sm text-surface-onVariant">NoSQL document database</div>
										</div>
									</schmancy-option>
									<schmancy-option value="mysql" label="MySQL">
										<div class="py-1">
											<div class="font-medium">MySQL</div>
											<div class="text-sm text-surface-onVariant">Popular open source SQL database</div>
										</div>
									</schmancy-option>
									<schmancy-option value="redis" label="Redis">
										<div class="py-1">
											<div class="font-medium">Redis</div>
											<div class="text-sm text-surface-onVariant">In-memory data structure store</div>
										</div>
									</schmancy-option>
								</schmancy-autocomplete>
							</div>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>

				<!-- Dynamic Data with Repeat Directive -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block"
						>Dynamic Data with Repeat Directive</schmancy-typography
					>
					<schmancy-typography type="body" token="md" class="mb-4 text-surface-onVariant block">
						Using Lit's repeat directive for efficient rendering of dynamic lists with stable keying.
					</schmancy-typography>

					<schmancy-grid gap="lg" class="w-full mb-8">
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<!-- Terminal Selection with Repeat -->
								<div>
									<schmancy-autocomplete
										label="Terminal IDs"
										placeholder="Search and select terminals..."
										multi
										.values=${this.selectedTerminals}
										@change=${(e: CustomEvent) => {
											this.selectedTerminals = e.detail.values || []
											console.log('Selected terminals:', this.selectedTerminals)
										}}
									>
										${repeat(
											this.availableTerminals,
											terminal => terminal.id,
											terminal => html`
												<schmancy-option .value=${terminal.id}>
													${terminal.name} (${terminal.location})
												</schmancy-option>
											`,
										)}
									</schmancy-autocomplete>
									${this.selectedTerminals.length > 0
										? html`
												<div class="mt-2">
													<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
														Selected: ${this.selectedTerminals.join(', ')}
													</schmancy-typography>
												</div>
											`
										: ''}
								</div>

								<!-- User Assignment with Details -->
								<div>
									<schmancy-autocomplete
										label="Assign Users"
										placeholder="Search by name or email..."
										multi
										.values=${this.selectedUsers}
										@change=${(e: CustomEvent) => {
											this.selectedUsers = e.detail.values || []
										}}
									>
										${repeat(
											this.usersList,
											user => user.id,
											user => html`
												<schmancy-option .value=${user.id}>
													<div class="flex justify-between items-center w-full">
														<div>
															<div class="font-medium">${user.name}</div>
															<div class="text-sm text-surface-onVariant">${user.email}</div>
														</div>
														<schmancy-chip type="assist" size="sm">${user.role}</schmancy-chip>
													</div>
												</schmancy-option>
											`,
										)}
									</schmancy-autocomplete>
								</div>

								<!-- Product Selection with Availability -->
								<div>
									<schmancy-autocomplete
										label="Select Products"
										placeholder="Search products by name or SKU..."
										multi
										.values=${this.selectedProducts}
										@change=${(e: CustomEvent) => {
											this.selectedProducts = e.detail.values || []
											const selectedItems = this.productCatalog.filter(p => this.selectedProducts.includes(p.sku))
											const total = selectedItems.reduce((sum, p) => sum + p.price, 0)
											console.log('Total value:', total.toFixed(2))
										}}
									>
										${repeat(
											this.productCatalog,
											product => product.sku,
											product => html`
												<schmancy-option .value=${product.sku} ?disabled=${!product.inStock}>
													<div class="flex justify-between items-center w-full">
														<div>
															<div class="font-medium ${!product.inStock ? 'opacity-50' : ''}">${product.name}</div>
															<div class="text-sm text-surface-onVariant">
																${product.category} • $${product.price.toFixed(2)}
															</div>
														</div>
														${product.inStock
															? html`
																	<schmancy-chip type="assist" size="sm" class="text-green-600">In Stock</schmancy-chip>
																`
															: html`
																	<schmancy-chip type="assist" size="sm" class="text-red-600"
																		>Out of Stock</schmancy-chip
																	>
																`}
													</div>
												</schmancy-option>
											`,
										)}
									</schmancy-autocomplete>
									${this.selectedProducts.length > 0
										? html`
												<div class="mt-2 p-2 bg-surface-container rounded">
													<schmancy-typography type="body" token="sm">
														Total:
														$${this.productCatalog
															.filter(p => this.selectedProducts.includes(p.sku))
															.reduce((sum, p) => sum + p.price, 0)
															.toFixed(2)}
													</schmancy-typography>
												</div>
											`
										: ''}
								</div>

								<!-- Tag Selection with Colors -->
								<div>
									<schmancy-autocomplete
										label="Add Tags"
										placeholder="Select tags..."
										multi
										.values=${this.selectedTags}
										@change=${(e: CustomEvent) => {
											this.selectedTags = e.detail.values || []
										}}
									>
										${repeat(
											this.tagOptions,
											tag => tag.id,
											tag => html`
												<schmancy-option .value=${tag.id}>
													<div class="flex items-center gap-2">
														<span class="w-3 h-3 rounded-full bg-${tag.color}-500"></span>
														${tag.label}
													</div>
												</schmancy-option>
											`,
										)}
									</schmancy-autocomplete>
									${this.selectedTags.length > 0
										? html`
												<div class="mt-2 flex flex-wrap gap-2">
													${this.selectedTags.map(tagId => {
														const tag = this.tagOptions.find(t => t.id === tagId)
														return tag
															? html`
																	<schmancy-chip type="assist" size="sm">
																		<span class="w-2 h-2 rounded-full bg-${tag.color}-500 mr-1"></span>
																		${tag.label}
																	</schmancy-chip>
																`
															: ''
													})}
												</div>
											`
										: ''}
								</div>
							</div>
						</schmancy-code-preview>
					</schmancy-grid>

					<!-- Code Example -->
					<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
						<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
							<schmancy-icon size="sm" class="text-primary">code</schmancy-icon>
							Using Repeat Directive
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-4">
							The repeat directive provides efficient list rendering with stable keys:
						</schmancy-typography>
						<pre class="bg-surface-container p-4 rounded overflow-x-auto"></pre>
					</schmancy-surface>
				</div>

				<!-- Search Configuration -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block">Search Configuration</schmancy-typography>

					<schmancy-grid gap="lg" class="w-full mb-8">
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<!-- Strict Search (High Threshold) -->
								<div>
									<schmancy-typography type="body" token="sm" class="mb-2 text-surface-onVariant">
										Strict Search (threshold: 0.6)
									</schmancy-typography>
									<schmancy-autocomplete
										label="Strict Search"
										placeholder="Type exact matches..."
										similarityThreshold=${0.6}
										.value=${this.strictSearchValue}
										@change=${(e: CustomEvent) => {
											this.strictSearchValue = e.detail.value
										}}
									>
										<schmancy-option value="javascript" label="JavaScript"></schmancy-option>
										<schmancy-option value="typescript" label="TypeScript"></schmancy-option>
										<schmancy-option value="java" label="Java"></schmancy-option>
										<schmancy-option value="python" label="Python"></schmancy-option>
										<schmancy-option value="csharp" label="C#"></schmancy-option>
									</schmancy-autocomplete>
								</div>

								<!-- Loose Search (Low Threshold) -->
								<div>
									<schmancy-typography type="body" token="sm" class="mb-2 text-surface-onVariant">
										Loose Search (threshold: 0.1)
									</schmancy-typography>
									<schmancy-autocomplete
										label="Loose Search"
										placeholder="Fuzzy matching..."
										similarityThreshold=${0.1}
										.value=${this.looseSearchValue}
										@change=${(e: CustomEvent) => {
											this.looseSearchValue = e.detail.value
										}}
									>
										<schmancy-option value="javascript" label="JavaScript"></schmancy-option>
										<schmancy-option value="typescript" label="TypeScript"></schmancy-option>
										<schmancy-option value="java" label="Java"></schmancy-option>
										<schmancy-option value="python" label="Python"></schmancy-option>
										<schmancy-option value="csharp" label="C#"></schmancy-option>
									</schmancy-autocomplete>
								</div>

								<!-- Custom Debounce -->
								<div>
									<schmancy-typography type="body" token="sm" class="mb-2 text-surface-onVariant">
										Fast Response (50ms debounce)
									</schmancy-typography>
									<schmancy-autocomplete label="Fast Search" placeholder="Instant results..." debounceMs=${50}>
										<schmancy-option value="opt1" label="Option 1"></schmancy-option>
										<schmancy-option value="opt2" label="Option 2"></schmancy-option>
										<schmancy-option value="opt3" label="Option 3"></schmancy-option>
									</schmancy-autocomplete>
								</div>

								<!-- Slow Debounce -->
								<div>
									<schmancy-typography type="body" token="sm" class="mb-2 text-surface-onVariant">
										Delayed Search (500ms debounce)
									</schmancy-typography>
									<schmancy-autocomplete
										label="Delayed Search"
										placeholder="Wait for typing to stop..."
										debounceMs=${500}
									>
										<schmancy-option value="opt1" label="Option 1"></schmancy-option>
										<schmancy-option value="opt2" label="Option 2"></schmancy-option>
										<schmancy-option value="opt3" label="Option 3"></schmancy-option>
									</schmancy-autocomplete>
								</div>
							</div>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>

				<!-- In Forms -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block">Form Integration</schmancy-typography>

					<schmancy-grid gap="lg" class="w-full mb-8">
						<schmancy-code-preview language="html">
							<schmancy-form
								@submit=${(e: Event) => {
									e.preventDefault()
									const formData = new FormData(e.target as HTMLFormElement)
									console.log('Form submitted:', Object.fromEntries(formData))
									console.log('Skills:', this.formSkills)
								}}
							>
								<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
									<schmancy-input
										name="name"
										label="Full Name"
										placeholder="Enter your name..."
										required
										.value=${this.formName}
										@input=${(e: Event) => (this.formName = (e.target as any).value)}
									></schmancy-input>

									<schmancy-autocomplete
										name="department"
										label="Department"
										placeholder="Select department..."
										required
										.value=${this.formDepartment}
										@change=${(e: CustomEvent) => {
											this.formDepartment = e.detail.value
										}}
									>
										<schmancy-option value="hr" label="Human Resources"></schmancy-option>
										<schmancy-option value="eng" label="Engineering"></schmancy-option>
										<schmancy-option value="fin" label="Finance"></schmancy-option>
										<schmancy-option value="mkt" label="Marketing"></schmancy-option>
										<schmancy-option value="ops" label="Operations"></schmancy-option>
									</schmancy-autocomplete>

									<div class="md:col-span-2">
										<schmancy-autocomplete
											name="skills"
											label="Skills"
											placeholder="Select your skills..."
											multi
											.values=${this.formSkills}
											@change=${(e: CustomEvent) => {
												this.formSkills = e.detail.values || []
											}}
										>
											<schmancy-option value="communication" label="Communication"></schmancy-option>
											<schmancy-option value="teamwork" label="Teamwork"></schmancy-option>
											<schmancy-option value="problem-solving" label="Problem Solving"></schmancy-option>
											<schmancy-option value="leadership" label="Leadership"></schmancy-option>
											<schmancy-option value="creativity" label="Creativity"></schmancy-option>
											<schmancy-option value="time-management" label="Time Management"></schmancy-option>
											<schmancy-option value="adaptability" label="Adaptability"></schmancy-option>
											<schmancy-option value="critical-thinking" label="Critical Thinking"></schmancy-option>
										</schmancy-autocomplete>
									</div>

									<div class="md:col-span-2 flex gap-4">
										<schmancy-button type="submit">Submit</schmancy-button>
										<schmancy-button
											type="button"
											variant="outlined"
											@click=${() => {
												this.formName = ''
												this.formDepartment = ''
												this.formSkills = []
											}}
										>
											Reset
										</schmancy-button>
									</div>
								</div>
							</schmancy-form>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>

				<!-- Features & Usage Notes -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Key Features</schmancy-typography>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
							<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
								<schmancy-icon size="sm" class="text-primary">search</schmancy-icon>
								Fuzzy Search
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								Intelligent similarity scoring algorithm finds best matches even with typos. Searches both labels and
								values, with configurable threshold.
							</schmancy-typography>
						</schmancy-surface>

						<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
							<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
								<schmancy-icon size="sm" class="text-primary">keyboard</schmancy-icon>
								Keyboard Navigation
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								Full keyboard support: Arrow keys to navigate, Enter to select, Escape to close, Tab to move to next
								field.
							</schmancy-typography>
						</schmancy-surface>

						<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
							<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
								<schmancy-icon size="sm" class="text-primary">check_circle</schmancy-icon>
								Auto-Select on Blur
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								In single-select mode, automatically selects the best matching option when the input loses focus,
								speeding up data entry.
							</schmancy-typography>
						</schmancy-surface>

						<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
							<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
								<schmancy-icon size="sm" class="text-primary">accessibility</schmancy-icon>
								Accessibility
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								Full ARIA support with proper roles, screen reader announcements, and focus management for an inclusive
								experience.
							</schmancy-typography>
						</schmancy-surface>
					</div>
				</div>

				<!-- Performance Tips -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block"
						>Performance Tips with Dynamic Data</schmancy-typography
					>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
							<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
								<schmancy-icon size="sm" class="text-primary">speed</schmancy-icon>
								Use Repeat for Dynamic Lists
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								When rendering lists from dynamic data (API responses, state arrays), use the repeat directive with a
								stable key function. This ensures efficient DOM updates when items are added, removed, or reordered.
							</schmancy-typography>
						</schmancy-surface>

						<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
							<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
								<schmancy-icon size="sm" class="text-primary">memory</schmancy-icon>
								Stable Keys Are Critical
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								Always use unique, stable IDs as keys (e.g., database IDs, UUIDs). Avoid using array indices as keys
								when the list can be reordered or filtered, as this causes unnecessary re-renders.
							</schmancy-typography>
						</schmancy-surface>

						<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
							<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
								<schmancy-icon size="sm" class="text-primary">filter_list</schmancy-icon>
								Filter at the Source
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								When dealing with large datasets, filter your data array before passing it to repeat. This reduces the
								number of DOM nodes created and improves search performance.
							</schmancy-typography>
						</schmancy-surface>

						<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
							<schmancy-typography type="headline" token="sm" class="mb-3 flex items-center gap-2">
								<schmancy-icon size="sm" class="text-primary">cached</schmancy-icon>
								Memoize Complex Templates
							</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								For complex option templates with multiple elements, consider memoizing the template function or
								pre-computing display values to avoid recalculation on every render.
							</schmancy-typography>
						</schmancy-surface>
					</div>
				</div>

				<!-- Best Practices -->
				<schmancy-typography type="title" token="lg" class="mb-4 block">Best Practices</schmancy-typography>

				<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
					<div class="flex flex-col gap-4">
						<div class="flex gap-2">
							<schmancy-icon class="text-primary">check_circle</schmancy-icon>
							<div>
								<schmancy-typography type="body" token="md" class="font-medium">
									Use descriptive labels and placeholders
								</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Help users understand what to search for and what options are available
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2">
							<schmancy-icon class="text-primary">check_circle</schmancy-icon>
							<div>
								<schmancy-typography type="body" token="md" class="font-medium">
									Set appropriate similarity thresholds
								</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Use higher thresholds (0.5-0.7) for strict matching, lower (0.1-0.3) for fuzzy search
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2">
							<schmancy-icon class="text-primary">check_circle</schmancy-icon>
							<div>
								<schmancy-typography type="body" token="md" class="font-medium">
									Optimize debounce for your use case
								</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Shorter delays (50-100ms) for small lists, longer (200-500ms) for API calls or large datasets
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2">
							<schmancy-icon class="text-primary">check_circle</schmancy-icon>
							<div>
								<schmancy-typography type="body" token="md" class="font-medium">
									Provide visual feedback for multi-select
								</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Show selected items as chips or a summary to keep users informed
								</schmancy-typography>
							</div>
						</div>

						<div class="flex gap-2">
							<schmancy-icon class="text-primary">check_circle</schmancy-icon>
							<div>
								<schmancy-typography type="body" token="md" class="font-medium">
									Use maxHeight for long lists
								</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Limit dropdown height to prevent it from extending beyond the viewport
								</schmancy-typography>
							</div>
						</div>
					</div>
				</schmancy-surface>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-forms-autocomplete': DemoFormsAutocomplete
	}
}
