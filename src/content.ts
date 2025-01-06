class SearchNavigator {
  private links: HTMLElement[] = []
  private currentIndex: number = 0
  private storageKey = 'searchNavigatorIndex'

  constructor() {
    this.initState()

    const savedIndex = localStorage.getItem(this.storageKey)
    if (savedIndex !== null) {
      this.currentIndex = Math.min(
        parseInt(savedIndex, 10),
        this.links.length - 1,
      )
    }

    this.highlightLink(this.currentIndex)

    document.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  private initState(): void {
    this.fetchLinks()
    this.currentIndex = 0
    this.saveCurrentIndex()
  }

  private fetchLinks(): void {
    this.links = Array.from(document.querySelectorAll<HTMLElement>('#search a'))
      .filter((link) => link.offsetParent !== null)
      // Filter links to include only <a> tags that contain an <h3> tag.
      // This ensures only search result titles are targeted.
      .filter((link) => link.querySelector('h3') !== null)
  }

  private highlightLink(index: number): void {
    this.links.forEach((link, i) => {
      const h3 = link.querySelector('h3')
      if (i === index) {
        if (h3) {
          h3.setAttribute('data-gsrks-anchor', 'focused')
          h3.style.border = '2px solid #3b88c3'
          h3.style.transform = 'translate(5px, 0)'
          h3.style.transition = 'ease-out 0.1s'
        }
        link.focus()
      } else {
        if (h3) {
          h3.removeAttribute('data-gsrks-anchor')
          h3.style.border = ''
          h3.style.transform = ''
          h3.style.transition = ''
        }
      }
    })
  }

  private handleKeydown(event: KeyboardEvent): void {
    // Ignore keydown event if the focus is on an input or textarea element.
    const activeElement = document.activeElement
    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA')
    ) {
      return
    }

    // Skip handling key events if any modifier key (Ctrl, Alt, Shift, Meta) is pressed.
    // This ensures browser shortcuts and other extensions' key bindings are not disrupted.
    if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'j':
        this.currentIndex = Math.min(
          this.currentIndex + 1,
          this.links.length - 1,
        )
        this.highlightLink(this.currentIndex)
        this.saveCurrentIndex()
        event.preventDefault()
        break

      case 'ArrowUp':
      case 'k':
        this.currentIndex = Math.max(this.currentIndex - 1, 0)
        this.highlightLink(this.currentIndex)
        this.saveCurrentIndex()
        event.preventDefault()
        break

      case 'Enter':
        this.links[this.currentIndex].click()
        this.saveCurrentIndex()
        event.preventDefault()
        break

      case 'ArrowRight':
      case 'l':
        this.navigateToNextPage()
        this.initState()
        event.preventDefault()
        break

      case 'ArrowLeft':
      case 'h':
        this.navigateToPrevPage()
        this.initState()
        event.preventDefault()
        break
    }
  }

  private saveCurrentIndex(): void {
    localStorage.setItem(this.storageKey, this.currentIndex.toString())
  }

  private navigateToNextPage(): void {
    const nextPageLink = document.querySelector('#pnnext') as HTMLElement
    if (nextPageLink) {
      nextPageLink.click()
    } else {
      console.log('No next page')
    }
  }

  private navigateToPrevPage(): void {
    const prevPageLink = document.querySelector('#pnprev') as HTMLElement
    if (prevPageLink) {
      prevPageLink.click()
    } else {
      console.log('No previous page')
    }
  }
}

window.addEventListener('load', () => {
  if (document.querySelector('#search')) {
    new SearchNavigator()
  }
})
