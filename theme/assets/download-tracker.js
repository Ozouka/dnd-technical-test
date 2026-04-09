if (!customElements.get('download-tracker')) {
  customElements.define('download-tracker', class DownloadTracker extends HTMLElement {

    // URL de l'App Proxy (faire très attention ici surtout avec le shopify.app.toml avec le subpath et le prefix !!!)
    get API_URL() {
      return '/apps/downloads-tracker/api/track-download'
    }

    connectedCallback() {
      this._handleClick = this.handleClick.bind(this)
      this.addEventListener('click', this._handleClick)
      console.log("download tracker is working !");

    }

    disconnectedCallback() {
      this.removeEventListener('click', this._handleClick)
    }

    handleClick(event) {
      const btn = event.target.closest('.document-card__download')
      if (!btn) return

      const { documentUrl, documentTitle, customerId, customerName } = btn.dataset

      if (!documentUrl || !documentTitle || !customerId) {
        console.warn('DownloadTracker: données manquantes sur le bouton')
        return
      }

      window.open(documentUrl, '_blank', 'noopener,noreferrer')

      this.track({ documentUrl, documentTitle, customerId, customerName })
    }

    async track(payload) {
      try {
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (error) {
        console.error('DownloadTracker: erreur tracking', error)
      }
    }
  })
}
