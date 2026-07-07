'use client'

import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ProfileExportButtonsProps {
  transactions: any[]
}

export function ProfileExportButtons({ transactions }: ProfileExportButtonsProps) {
  
  const handleExportExcel = () => {
    const data = transactions.map(t => ({
      Data: format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
      Tipo: t.type === 'INCOME' ? 'Entrada' : t.type === 'EXPENSE' ? 'Gasto' : 'Troco',
      Descrição: t.description,
      'Valor (R$)': t.amount,
      'Método de Pagamento': t.paymentMethod === 'CASH' ? 'Dinheiro/Pix' : t.paymentMethod === 'CARD' ? 'Cartão' : '-'
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio_Iza_Modas")
    XLSX.writeFile(wb, "Relatorio_Iza_Modas.xlsx")
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    
    // Iza Modas Premium Header
    doc.setFillColor(194, 24, 91) // Iza Pink (#C2185B)
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("Iza Modas", 14, 22)
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Relatório Financeiro Geral", 14, 30)
    
    doc.setFontSize(10)
    doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 130, 26)

    // Calculate Totals
    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0)
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0)
    const netProfit = totalIncome - totalExpense

    // Table Data
    const tableColumn = ["Data", "Tipo", "Descrição", "Pagamento", "Valor (R$)"]
    const tableRows: string[][] = []

    transactions.forEach(t => {
      const row = [
        format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
        t.type === 'INCOME' ? 'Entrada' : t.type === 'EXPENSE' ? 'Gasto' : 'Troco',
        t.description,
        t.paymentMethod === 'CASH' ? 'Dinheiro/Pix' : t.paymentMethod === 'CARD' ? 'Cartão' : '-',
        `R$ ${t.amount.toFixed(2).replace('.', ',')}`
      ]
      tableRows.push(row)
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { 
        fillColor: [194, 24, 91], 
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [250, 245, 247]
      },
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 4,
      },
    })

    // Summary Section
    const finalY = (doc as any).lastAutoTable.finalY || 45
    
    doc.setFillColor(245, 245, 245)
    doc.rect(14, finalY + 10, 182, 40, 'F')
    
    doc.setTextColor(50, 50, 50)
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Resumo Financeiro", 20, finalY + 20)
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Total de Entradas: R$ ${totalIncome.toFixed(2).replace('.', ',')}`, 20, finalY + 30)
    doc.text(`Total de Saídas: R$ ${totalExpense.toFixed(2).replace('.', ',')}`, 20, finalY + 38)
    
    doc.setFont("helvetica", "bold")
    doc.setTextColor(netProfit >= 0 ? 34 : 200, netProfit >= 0 ? 197 : 0, netProfit >= 0 ? 94 : 0) // Green if positive, Red if negative
    doc.text(`Saldo Líquido: R$ ${netProfit.toFixed(2).replace('.', ',')}`, 120, finalY + 34)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text("Documento gerado automaticamente pela Plataforma Iza Modas", 105, 290, { align: "center" })

    doc.save("Iza_Modas_Relatorio_Geral.pdf")
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-iza-50 overflow-hidden mt-8">
      <div className="p-5 border-b border-iza-50">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-iza-50 flex items-center justify-center shrink-0">
            <Download size={20} className="text-iza-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Exportar Relatórios</h3>
            <p className="text-sm text-gray-500">Baixe um consolidado dos seus dados financeiros</p>
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col sm:flex-row gap-4 bg-gray-50/30">
        <button 
          onClick={handleExportPDF}
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-iza-600 hover:bg-iza-700 text-white rounded-2xl font-bold shadow-md shadow-iza-500/20 transition-all active:scale-95"
        >
          <FileText size={20} />
          Exportar PDF Premium
        </button>
        <button 
          onClick={handleExportExcel}
          className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-md shadow-green-500/20 transition-all active:scale-95"
        >
          <FileSpreadsheet size={20} />
          Exportar Excel
        </button>
      </div>
    </div>
  )
}
