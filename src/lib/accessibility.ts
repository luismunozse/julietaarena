// Accessibility utilities and helpers

export const accessibility = {
  // ARIA labels and roles
  roles: {
    button: 'button',
    link: 'link',
    navigation: 'navigation',
    main: 'main',
    banner: 'banner',
    contentinfo: 'contentinfo',
    complementary: 'complementary',
    search: 'search',
    form: 'form',
    dialog: 'dialog',
    alert: 'alert',
    alertdialog: 'alertdialog',
    status: 'status',
    log: 'log',
    marquee: 'marquee',
    timer: 'timer',
    tablist: 'tablist',
    tab: 'tab',
    tabpanel: 'tabpanel',
    menu: 'menu',
    menuitem: 'menuitem',
    menubar: 'menubar',
    toolbar: 'toolbar',
    grid: 'grid',
    gridcell: 'gridcell',
    row: 'row',
    columnheader: 'columnheader',
    rowheader: 'rowheader',
    table: 'table',
    cell: 'cell',
    rowgroup: 'rowgroup',
    column: 'column',
    list: 'list',
    listitem: 'listitem',
    tree: 'tree',
    treeitem: 'treeitem',
    group: 'group',
    radiogroup: 'radiogroup',
    checkbox: 'checkbox',
    radio: 'radio',
    switch: 'switch',
    slider: 'slider',
    spinbutton: 'spinbutton',
    textbox: 'textbox',
    combobox: 'combobox',
    listbox: 'listbox',
    option: 'option',
    progressbar: 'progressbar',
    meter: 'meter',
    scrollbar: 'scrollbar',
    separator: 'separator',
    img: 'img',
    presentation: 'presentation',
    figure: 'figure',
    article: 'article',
    region: 'region',
    heading: 'heading'
  },

  // ARIA states and properties
  states: {
    expanded: 'aria-expanded',
    selected: 'aria-selected',
    checked: 'aria-checked',
    pressed: 'aria-pressed',
    disabled: 'aria-disabled',
    hidden: 'aria-hidden',
    invalid: 'aria-invalid',
    required: 'aria-required',
    readonly: 'aria-readonly',
    multiselectable: 'aria-multiselectable',
    sort: 'aria-sort',
    live: 'aria-live',
    atomic: 'aria-atomic',
    relevant: 'aria-relevant',
    busy: 'aria-busy',
    current: 'aria-current',
    describedby: 'aria-describedby',
    labelledby: 'aria-labelledby',
    controls: 'aria-controls',
    owns: 'aria-owns',
    flowto: 'aria-flowto',
    posinset: 'aria-posinset',
    setsize: 'aria-setsize',
    level: 'aria-level',
    valuemin: 'aria-valuemin',
    valuemax: 'aria-valuemax',
    valuenow: 'aria-valuenow',
    valuetext: 'aria-valuetext',
    orientation: 'aria-orientation',
    autocomplete: 'aria-autocomplete',
    haspopup: 'aria-haspopup',
    modal: 'aria-modal',
    multiline: 'aria-multiline',
    placeholder: 'aria-placeholder',
    rowcount: 'aria-rowcount',
    colcount: 'aria-colcount',
    rowindex: 'aria-rowindex',
    colindex: 'aria-colindex',
    rowspan: 'aria-rowspan',
    colspan: 'aria-colspan'
  },

  // Keyboard navigation
  keys: {
    enter: 'Enter',
    space: ' ',
    escape: 'Escape',
    tab: 'Tab',
    shiftTab: 'Shift+Tab',
    arrowUp: 'ArrowUp',
    arrowDown: 'ArrowDown',
    arrowLeft: 'ArrowLeft',
    arrowRight: 'ArrowRight',
    home: 'Home',
    end: 'End',
    pageUp: 'PageUp',
    pageDown: 'PageDown',
    delete: 'Delete',
    backspace: 'Backspace'
  },

  // Focus management
  focus: {
    trap: (container: HTMLElement) => {
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus()
              e.preventDefault()
            }
          }
        }
      }

      container.addEventListener('keydown', handleTabKey)
      firstElement?.focus()

      return () => {
        container.removeEventListener('keydown', handleTabKey)
      }
    },

    restore: (element: HTMLElement | null) => {
      if (element) {
        element.focus()
      }
    },

    next: (currentElement: HTMLElement) => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const currentIndex = Array.from(focusableElements).indexOf(currentElement)
      const nextElement = focusableElements[currentIndex + 1] as HTMLElement
      nextElement?.focus()
    },

    previous: (currentElement: HTMLElement) => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const currentIndex = Array.from(focusableElements).indexOf(currentElement)
      const previousElement = focusableElements[currentIndex - 1] as HTMLElement
      previousElement?.focus()
    }
  },

  // Screen reader utilities
  screenReader: {
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', priority)
      announcement.setAttribute('aria-atomic', 'true')
      announcement.className = 'sr-only'
      announcement.textContent = message
      
      document.body.appendChild(announcement)
      
      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    },

    hide: (element: HTMLElement) => {
      element.setAttribute('aria-hidden', 'true')
    },

    show: (element: HTMLElement) => {
      element.removeAttribute('aria-hidden')
    }
  },

  // Color contrast utilities
  contrast: {
    getLuminance: (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    },

    getContrast: (color1: string, color2: string) => {
      const rgb1 = accessibility.contrast.hexToRgb(color1)
      const rgb2 = accessibility.contrast.hexToRgb(color2)
      
      if (!rgb1 || !rgb2) return 0
      
      const lum1 = accessibility.contrast.getLuminance(rgb1.r, rgb1.g, rgb1.b)
      const lum2 = accessibility.contrast.getLuminance(rgb2.r, rgb2.g, rgb2.b)
      
      const brightest = Math.max(lum1, lum2)
      const darkest = Math.min(lum1, lum2)
      
      return (brightest + 0.05) / (darkest + 0.05)
    },

    hexToRgb: (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    },

    isAccessible: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA') => {
      const contrast = accessibility.contrast.getContrast(foreground, background)
      return level === 'AA' ? contrast >= 4.5 : contrast >= 7
    }
  },

  // Form validation
  validation: {
    getErrorMessage: (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      const validity = field.validity
      
      if (validity.valueMissing) {
        return 'Este campo es obligatorio'
      }
      if (validity.typeMismatch) {
        if (field.type === 'email') {
          return 'Por favor ingresa un email válido'
        }
        if (field.type === 'url') {
          return 'Por favor ingresa una URL válida'
        }
        return 'El formato no es válido'
      }
      if (validity.patternMismatch) {
        return 'El formato no coincide con el patrón requerido'
      }
      if (validity.tooShort) {
        return `Debe tener al menos ${field.minLength} caracteres`
      }
      if (validity.tooLong) {
        return `No puede tener más de ${field.maxLength} caracteres`
      }
      if (validity.rangeUnderflow) {
        return `El valor debe ser mayor o igual a ${field.min}`
      }
      if (validity.rangeOverflow) {
        return `El valor debe ser menor o igual a ${field.max}`
      }
      if (validity.stepMismatch) {
        return `El valor debe ser un múltiplo de ${field.step}`
      }
      if (validity.badInput) {
        return 'El valor ingresado no es válido'
      }
      if (validity.customError) {
        return field.validationMessage
      }
      
      return 'El valor no es válido'
    },

    announceError: (field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      const errorMessage = accessibility.validation.getErrorMessage(field)
      accessibility.screenReader.announce(errorMessage, 'assertive')
    }
  },

  // Skip links
  skipLinks: {
    create: (targets: Array<{ href: string; text: string }>) => {
      const skipLinks = document.createElement('div')
      skipLinks.className = 'skip-links'
      
      targets.forEach(target => {
        const link = document.createElement('a')
        link.href = target.href
        link.textContent = target.text
        link.className = 'skip-link'
        skipLinks.appendChild(link)
      })
      
      return skipLinks
    }
  }
}

// Utility functions
export const createAriaLabel = (label: string, description?: string) => ({
  'aria-label': label,
  ...(description && { 'aria-describedby': description })
})

export const createAriaExpanded = (expanded: boolean) => ({
  'aria-expanded': expanded
})

export const createAriaSelected = (selected: boolean) => ({
  'aria-selected': selected
})

export const createAriaChecked = (checked: boolean) => ({
  'aria-checked': checked
})

export const createAriaPressed = (pressed: boolean) => ({
  'aria-pressed': pressed
})

export const createAriaDisabled = (disabled: boolean) => ({
  'aria-disabled': disabled,
  ...(disabled && { tabIndex: -1 })
})

export const createAriaHidden = (hidden: boolean) => ({
  'aria-hidden': hidden
})

export const createAriaLive = (live: 'off' | 'polite' | 'assertive') => ({
  'aria-live': live
})

export const createAriaAtomic = (atomic: boolean) => ({
  'aria-atomic': atomic
})

export const createAriaRelevant = (relevant: 'additions' | 'removals' | 'text' | 'all') => ({
  'aria-relevant': relevant
})

export const createAriaBusy = (busy: boolean) => ({
  'aria-busy': busy
})

export const createAriaCurrent = (current: boolean | 'page' | 'step' | 'location' | 'date' | 'time') => ({
  'aria-current': current
})

export const createAriaControls = (controls: string) => ({
  'aria-controls': controls
})

export const createAriaOwns = (owns: string) => ({
  'aria-owns': owns
})

export const createAriaDescribedBy = (describedBy: string) => ({
  'aria-describedby': describedBy
})

export const createAriaLabelledBy = (labelledBy: string) => ({
  'aria-labelledby': labelledBy
})

export const createAriaOrientation = (orientation: 'horizontal' | 'vertical') => ({
  'aria-orientation': orientation
})

export const createAriaSort = (sort: 'none' | 'ascending' | 'descending' | 'other') => ({
  'aria-sort': sort
})

export const createAriaValue = (min: number, max: number, now: number, text?: string) => ({
  'aria-valuemin': min,
  'aria-valuemax': max,
  'aria-valuenow': now,
  ...(text && { 'aria-valuetext': text })
})

export const createAriaSetSize = (posInSet: number, setSize: number) => ({
  'aria-posinset': posInSet,
  'aria-setsize': setSize
})

export const createAriaLevel = (level: number) => ({
  'aria-level': level
})

export const createAriaHasPopup = (hasPopup: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog') => ({
  'aria-haspopup': hasPopup
})

export const createAriaModal = (modal: boolean) => ({
  'aria-modal': modal
})

export const createAriaMultiline = (multiline: boolean) => ({
  'aria-multiline': multiline
})

export const createAriaPlaceholder = (placeholder: string) => ({
  'aria-placeholder': placeholder
})

export const createAriaAutocomplete = (autocomplete: 'none' | 'inline' | 'list' | 'both') => ({
  'aria-autocomplete': autocomplete
})

export const createAriaRequired = (required: boolean) => ({
  'aria-required': required
})

export const createAriaReadOnly = (readOnly: boolean) => ({
  'aria-readonly': readOnly
})

export const createAriaInvalid = (invalid: boolean) => ({
  'aria-invalid': invalid
})

export const createAriaMultiselectable = (multiselectable: boolean) => ({
  'aria-multiselectable': multiselectable
})
