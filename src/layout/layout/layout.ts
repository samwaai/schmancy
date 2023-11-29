import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { property } from 'lit/decorators.js'

export default class Layout extends TailwindElement() {
  static styles = [this.styles]
  layout = true
  @property({ type: Boolean }) center: boolean | undefined = undefined
  @property({ type: String }) padding: string | undefined
  @property({ type: String }) margin: string | undefined
  @property({ type: String }) width: string | undefined
  @property({ type: String }) height: string | undefined
  @property({ type: String }) minWidth: string | undefined
  @property({ type: String }) minHeight: string | undefined
  @property({ type: String }) maxWidth: string | undefined
  @property({ type: String }) maxHeight: string | undefined
  @property({ type: String }) display:
    | 'block'
    | 'inline-block'
    | 'inline'
    | 'flex'
    | 'inline-flex'
    | 'grid'
    | 'inline-grid'
    | 'table'
    | 'inline-table'
    | 'flow-root'
    | 'none'
    | undefined = undefined
  @property({ type: String }) overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | undefined =
    undefined
  @property({ type: String }) overflowX: 'visible' | 'hidden' | 'scroll' | 'auto' | undefined =
    undefined
  @property({ type: String }) overflowY: 'visible' | 'hidden' | 'scroll' | 'auto' | undefined =
    undefined
  @property({ type: String }) position:
    | 'static'
    | 'relative'
    | 'absolute'
    | 'fixed'
    | 'sticky'
    | undefined = undefined
  @property({ type: String }) top: string | undefined
  @property({ type: String }) right: string | undefined
  @property({ type: String }) bottom: string | undefined
  @property({ type: String }) left: string | undefined
  @property({ type: String }) inset: string | undefined
  @property({ type: String }) zIndex: string | undefined

  @property({ type: String }) border: string | undefined
  @property({ type: String }) borderTop: string | undefined
  @property({ type: String }) borderRight: string | undefined
  @property({ type: String }) borderBottom: string | undefined
  @property({ type: String }) borderLeft: string | undefined
  @property({ type: String }) borderColor: string | undefined
  @property({ type: String }) borderRadius: string | undefined
  @property({ type: String }) borderWidth: string | undefined

  @property({ type: String }) boxShadow: string | undefined
  @property({ type: String }) opacity: string | undefined
  @property({ type: String }) background: string | undefined
  @property({ type: String }) backgroundImage: string | undefined
  @property({ type: String }) backgroundPosition: string | undefined
  @property({ type: String }) backgroundSize: string | undefined
  @property({ type: String }) backgroundRepeat: string | undefined
  @property({ type: String }) backgroundAttachment: string | undefined
  @property({ type: String }) backgroundColor: string | undefined
  @property({ type: String }) backgroundClip: string | undefined
  @property({ type: String }) backgroundOrigin: string | undefined
  @property({ type: String }) backgroundBlendMode: string | undefined
  @property({ type: String }) filter: string | undefined
  @property({ type: String }) backdropFilter: string | undefined

  connectedCallback(): void {
    super.connectedCallback()
    this.style.setProperty('padding', this.padding ?? '')
    this.style.setProperty('margin', this.margin ?? '')
    this.style.setProperty('width', this.width ?? '')
    this.style.setProperty('height', this.height ?? '')
    this.style.setProperty('min-width', this.minWidth ?? '')
    this.style.setProperty('min-height', this.minHeight ?? '')
    this.style.setProperty('max-width', this.maxWidth ?? '')
    this.style.setProperty('max-height', this.maxHeight ?? '')
    this.style.setProperty('display', this.display ?? '')
    this.style.setProperty('overflow', this.overflow ?? '')
    this.style.setProperty('overflow-x', this.overflowX ?? '')
    this.style.setProperty('overflow-y', this.overflowY ?? '')
    this.style.setProperty('position', this.position ?? '')
    this.style.setProperty('top', this.top ?? '')
    this.style.setProperty('right', this.right ?? '')
    this.style.setProperty('bottom', this.bottom ?? '')
    this.style.setProperty('left', this.left ?? '')
    this.style.setProperty('inset', this.inset ?? '')
    this.style.setProperty('z-index', this.zIndex ?? '')
    this.style.setProperty('border', this.border ?? '')
    this.style.setProperty('border-top', this.borderTop ?? '')
    this.style.setProperty('border-right', this.borderRight ?? '')
    this.style.setProperty('border-bottom', this.borderBottom ?? '')
    this.style.setProperty('border-left', this.borderLeft ?? '')
    this.style.setProperty('border-color', this.borderColor ?? '')
    this.style.setProperty('border-radius', this.borderRadius ?? '')
    this.style.setProperty('border-width', this.borderWidth ?? '')
    this.style.setProperty('box-shadow', this.boxShadow ?? '')
    this.style.setProperty('opacity', this.opacity ?? '')
    this.style.setProperty('background', this.background ?? '')
    this.style.setProperty('background-image', this.backgroundImage ?? '')
    this.style.setProperty('background-position', this.backgroundPosition ?? '')
    this.style.setProperty('background-size', this.backgroundSize ?? '')
    this.style.setProperty('background-repeat', this.backgroundRepeat ?? '')
    this.style.setProperty('background-attachment', this.backgroundAttachment ?? '')
    this.style.setProperty('background-color', this.backgroundColor ?? '')
    this.style.setProperty('background-clip', this.backgroundClip ?? '')
    this.style.setProperty('background-origin', this.backgroundOrigin ?? '')
    this.style.setProperty('background-blend-mode', this.backgroundBlendMode ?? '')
    this.style.setProperty('filter', this.filter ?? '')
    this.style.setProperty('backdrop-filter', this.backdropFilter ?? '')
    if (this.center) {
      this.style.setProperty('margin-left', 'auto')
      this.style.setProperty('margin-right', 'auto')
    }
  }
}
