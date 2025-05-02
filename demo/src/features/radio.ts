import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-radio')
export class DemoRadio extends $LitElement(css`
  :host {
    display: block;
  }
`) {
  @state() radioValue = ''
  @state() radioGroupValue = ''
  @state() colorOption = 'red'

  render() {
    return html`
      <schmancy-surface type="container" fill="all" rounded="left" class="p-4">
        <schmancy-typography type="headline">Radio Components</schmancy-typography>
        
        <div class="grid gap-6 mt-4">
          <!-- Individual Radio Buttons Demo -->
          <div>
            <schmancy-typography type="title" class="mb-2">Individual Radio Buttons</schmancy-typography>
            <div class="flex flex-col gap-4">
              <schmancy-radio-button 
                value="option1" 
                name="demo-radio" 
                ?checked=${this.radioValue === 'option1'}
                @change=${(e: CustomEvent) => this.radioValue = e.detail.value}
              >
                <div slot="label">Option 1</div>
              </schmancy-radio-button>
              
              <schmancy-radio-button 
                value="option2" 
                name="demo-radio" 
                ?checked=${this.radioValue === 'option2'}
                @change=${(e: CustomEvent) => this.radioValue = e.detail.value}
              >
                <div slot="label">Option 2</div>
              </schmancy-radio-button>
              
              <schmancy-radio-button 
                value="option3" 
                name="demo-radio" 
                ?checked=${this.radioValue === 'option3'}
                @change=${(e: CustomEvent) => this.radioValue = e.detail.value}
              >
                <div slot="label">Option 3</div>
              </schmancy-radio-button>
            </div>
            <div class="mt-2">Selected value: ${this.radioValue || 'None'}</div>
          </div>

          <!-- Radio Group Demo -->
          <div>
            <schmancy-typography type="title" class="mb-2">Radio Group (Using Options)</schmancy-typography>
            <schmancy-radio-group
              label="Select an option"
              name="demo-group"
              .value=${this.radioGroupValue}
              .options=${[
                { label: 'Option A', value: 'A' },
                { label: 'Option B', value: 'B' },
                { label: 'Option C', value: 'C' }
              ]}
              @change=${(e: CustomEvent) => this.radioGroupValue = e.detail.value}
            ></schmancy-radio-group>
            <div class="mt-2">Selected value: ${this.radioGroupValue || 'None'}</div>
          </div>

          <!-- Radio Group with Slotted Content -->
          <div>
            <schmancy-typography type="title" class="mb-2">Radio Group (Using Slotted Content)</schmancy-typography>
            <schmancy-radio-group
              label="Select a color"
              name="color-options"
              .value=${this.colorOption}
              @change=${(e: CustomEvent) => this.colorOption = e.detail.value}
            >
              <schmancy-radio-button value="red">
                <div slot="label" class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-red-500"></div>
                  <span>Red</span>
                </div>
              </schmancy-radio-button>
              
              <schmancy-radio-button value="green">
                <div slot="label" class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-green-500"></div>
                  <span>Green</span>
                </div>
              </schmancy-radio-button>
              
              <schmancy-radio-button value="blue">
                <div slot="label" class="flex items-center gap-2">
                  <div class="w-4 h-4 rounded-full bg-blue-500"></div>
                  <span>Blue</span>
                </div>
              </schmancy-radio-button>
            </schmancy-radio-group>
            <div class="mt-2">Selected color: ${this.colorOption}</div>
          </div>

          <!-- Form Integration Demo -->
          <div class="mt-4 border-t pt-4">
            <schmancy-typography type="title" class="mb-4">Form Integration</schmancy-typography>
            
            <schmancy-form
              @submit=${(e: CustomEvent) => {
                console.log('Form submitted:', e.detail)
                alert('Form submitted! Check console for details.')
              }}
              class="flex flex-col gap-4"
            >
              <schmancy-input
                label="Name"
                name="name"
                placeholder="Enter your name"
                required
              ></schmancy-input>
              
              <div>
                <label class="block text-base font-semibold text-gray-900 mb-2">Gender</label>
                <schmancy-radio-group
                  name="gender"
                  required
                >
                  <schmancy-radio-button value="male">
                    <div slot="label">Male</div>
                  </schmancy-radio-button>
                  
                  <schmancy-radio-button value="female">
                    <div slot="label">Female</div>
                  </schmancy-radio-button>
                  
                  <schmancy-radio-button value="other">
                    <div slot="label">Other</div>
                  </schmancy-radio-button>
                </schmancy-radio-group>
              </div>
              
              <div>
                <label class="block text-base font-semibold text-gray-900 mb-2">Communication Preference</label>
                <schmancy-radio-group
                  name="contact_preference"
                  .options=${[
                    { label: 'Email', value: 'email' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Post', value: 'post' }
                  ]}
                ></schmancy-radio-group>
              </div>
              
              <schmancy-button variant="filled" type="submit" class="mt-2">Submit Form</schmancy-button>
            </schmancy-form>
          </div>

          <!-- V2 Form Integration Demo -->
          <div class="mt-4 border-t pt-4">
            <schmancy-typography type="title" class="mb-4">V2 Form Integration</schmancy-typography>
            
            <sch-form
              @submit=${(e: CustomEvent) => {
                console.log('V2 Form submitted:', e.detail)
                alert('V2 Form submitted! Check console for details.')
              }}
              class="flex flex-col gap-4"
            >
              <sch-input
                label="Full Name"
                name="full_name"
                placeholder="Enter your full name"
                required
              ></sch-input>
              
              <div>
                <label class="block text-base font-semibold text-gray-900 mb-2">Experience Level</label>
                <schmancy-radio-group
                  name="experience"
                  required
                >
                  <schmancy-radio-button value="beginner">
                    <div slot="label">Beginner</div>
                  </schmancy-radio-button>
                  
                  <schmancy-radio-button value="intermediate">
                    <div slot="label">Intermediate</div>
                  </schmancy-radio-button>
                  
                  <schmancy-radio-button value="advanced">
                    <div slot="label">Advanced</div>
                  </schmancy-radio-button>
                </schmancy-radio-group>
              </div>
              
              <div>
                <label class="block text-base font-semibold text-gray-900 mb-2">Subscription Plan</label>
                <schmancy-radio-group
                  name="plan"
                  .options=${[
                    { label: 'Basic', value: 'basic' },
                    { label: 'Premium', value: 'premium' },
                    { label: 'Enterprise', value: 'enterprise' }
                  ]}
                ></schmancy-radio-group>
              </div>
              
              <schmancy-button variant="filled" type="submit" class="mt-2">Submit V2 Form</schmancy-button>
            </sch-form>
          </div>
        </div>
      </schmancy-surface>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'demo-radio': DemoRadio
  }
}