'use client'
import { useState } from 'react'
import { Printer, Download, Loader2 } from 'lucide-react'

export default function InvoiceActions({ invoiceId }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    const node = document.getElementById('invoice-content')
    if (!node) return
    setDownloading(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
      const pageWidth  = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth   = pageWidth
      const imgHeight  = (canvas.height * imgWidth) / canvas.width
      const imgData    = canvas.toDataURL('image/png')

      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${invoiceId}.pdf`)
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la génération du PDF')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 bg-white border border-primary-200 hover:bg-primary-50 text-primary-800 font-medium text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        {downloading ? 'Génération…' : 'Télécharger PDF'}
      </button>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 bg-primary-800 hover:bg-primary-700 text-white font-medium text-sm px-4 py-2 rounded-xl transition-colors"
      >
        <Printer size={15} />
        Imprimer
      </button>
    </div>
  )
}
