// Mock of the Schmancy dialog bundle for the playground
// This file would normally be generated from your actual components

(function() {
  // Simple dialog implementation for the demo
  class DialogService {
    static instance;
    
    static getInstance() {
      if (!DialogService.instance) {
        DialogService.instance = new DialogService();
      }
      return DialogService.instance;
    }
    
    constructor() {
      this.activeDialogs = [];
    }
    
    confirm(options) {
      const dialog = this._createDialog(options);
      this.activeDialogs.push(dialog);
      
      return new Promise((resolve) => {
        dialog._resolve = resolve;
        
        dialog.querySelector('.confirm-btn')?.addEventListener('click', () => {
          this._closeDialog(dialog);
          resolve(true);
        });
        
        dialog.querySelector('.cancel-btn')?.addEventListener('click', () => {
          this._closeDialog(dialog);
          resolve(false);
        });
        
        dialog.querySelector('.overlay')?.addEventListener('click', () => {
          this._closeDialog(dialog);
          resolve(false);
        });
      });
    }
    
    component(content, options = {}) {
      const dialog = document.createElement('div');
      dialog.className = 'schmancy-dialog-component';
      dialog.style.position = 'fixed';
      dialog.style.zIndex = '10000';
      dialog.style.inset = '0';
      dialog.style.display = 'flex';
      dialog.style.justifyContent = 'center';
      dialog.style.alignItems = 'center';
      
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
      
      const contentContainer = document.createElement('div');
      contentContainer.className = 'dialog-content';
      contentContainer.style.position = 'relative';
      contentContainer.style.maxWidth = options.width || '360px';
      contentContainer.style.width = 'max-content';
      contentContainer.style.maxHeight = 'calc(100vh - 40px)';
      contentContainer.style.overflow = 'auto';
      contentContainer.style.zIndex = '1';
      
      // Append content (string or DOM node)
      if (typeof content === 'string') {
        contentContainer.innerHTML = content;
      } else if (content instanceof Node) {
        contentContainer.appendChild(content.cloneNode(true));
      } else if (content && typeof content === 'object' && 'strings' in content) {
        // Handle lit-html templates
        const template = document.createElement('template');
        
        // This is a simplification - in real life you'd use lit.render
        // For demo purposes, we'll convert the template to string
        const tempDiv = document.createElement('div');
        const clone = content.cloneNode(true);
        tempDiv.appendChild(clone);
        template.innerHTML = tempDiv.innerHTML;
        
        const fragment = template.content.cloneNode(true);
        contentContainer.appendChild(fragment);
      }
      
      dialog.appendChild(overlay);
      dialog.appendChild(contentContainer);
      document.body.appendChild(dialog);
      
      this.activeDialogs.push(dialog);
      
      return new Promise((resolve) => {
        dialog._resolve = resolve;
        
        overlay.addEventListener('click', () => {
          this._closeDialog(dialog);
          resolve(false);
        });
      });
    }
    
    dismiss() {
      if (this.activeDialogs.length > 0) {
        const dialog = this.activeDialogs[this.activeDialogs.length - 1];
        this._closeDialog(dialog);
        if (dialog._resolve) {
          dialog._resolve(false);
        }
        return true;
      }
      return false;
    }
    
    _createDialog(options) {
      const dialog = document.createElement('div');
      dialog.className = 'schmancy-dialog';
      dialog.style.position = 'fixed';
      dialog.style.zIndex = '10000';
      dialog.style.inset = '0';
      dialog.style.display = 'flex';
      dialog.style.justifyContent = 'center';
      dialog.style.alignItems = 'center';
      
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
      
      const content = document.createElement('div');
      content.className = 'dialog-content';
      content.style.position = 'relative';
      content.style.backgroundColor = 'white';
      content.style.borderRadius = '8px';
      content.style.padding = '24px';
      content.style.maxWidth = options.width || '360px';
      content.style.width = 'auto';
      content.style.maxHeight = 'calc(100vh - 40px)';
      content.style.overflow = 'auto';
      content.style.zIndex = '1';
      content.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      
      // Dialog header
      if (options.title) {
        const title = document.createElement('h2');
        title.textContent = options.title;
        title.style.margin = '0 0 8px 0';
        title.style.fontSize = '20px';
        title.style.fontWeight = '600';
        content.appendChild(title);
      }
      
      // Dialog subtitle
      if (options.subtitle) {
        const subtitle = document.createElement('p');
        subtitle.textContent = options.subtitle;
        subtitle.style.margin = '0 0 16px 0';
        subtitle.style.fontSize = '14px';
        subtitle.style.color = '#6b7280';
        content.appendChild(subtitle);
      }
      
      // Dialog message
      if (options.message) {
        const message = document.createElement('p');
        message.textContent = options.message;
        message.style.margin = '0 0 24px 0';
        message.style.fontSize = '16px';
        content.appendChild(message);
      }
      
      // Dialog actions
      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.justifyContent = 'flex-end';
      actions.style.gap = '8px';
      
      if (options.cancelText) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = options.cancelText;
        cancelBtn.style.padding = '8px 16px';
        cancelBtn.style.borderRadius = '4px';
        cancelBtn.style.backgroundColor = 'white';
        cancelBtn.style.color = '#374151';
        cancelBtn.style.border = '1px solid #d1d5db';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.style.fontSize = '14px';
        actions.appendChild(cancelBtn);
      }
      
      if (options.confirmText) {
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirm-btn';
        confirmBtn.textContent = options.confirmText;
        confirmBtn.style.padding = '8px 16px';
        confirmBtn.style.borderRadius = '4px';
        confirmBtn.style.backgroundColor = options.variant === 'danger' ? '#dc2626' : '#4f46e5';
        confirmBtn.style.color = 'white';
        confirmBtn.style.border = 'none';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.style.fontSize = '14px';
        actions.appendChild(confirmBtn);
      }
      
      content.appendChild(actions);
      dialog.appendChild(overlay);
      dialog.appendChild(content);
      document.body.appendChild(dialog);
      
      return dialog;
    }
    
    _closeDialog(dialog) {
      const index = this.activeDialogs.indexOf(dialog);
      if (index !== -1) {
        this.activeDialogs.splice(index, 1);
      }
      document.body.removeChild(dialog);
    }
  }
  
  // Export the dialog service API
  const $dialog = {
    confirm: (options) => DialogService.getInstance().confirm(options),
    component: (content, options) => DialogService.getInstance().component(content, options),
    simple: (content, options) => DialogService.getInstance().component(content, options),
    dismiss: () => DialogService.getInstance().dismiss()
  };
  
  // Export for use in the playground
  window.$dialog = $dialog;
  
  // For ES module compatibility
  export { $dialog };
})();