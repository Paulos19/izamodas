'use client'

import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

interface ExportButtonsProps {
  transactions: any[]
}

export function ExportButtons({ transactions }: ExportButtonsProps) {
  
  const handleExportExcel = () => {
    const data = transactions.map(t => ({
      Data: format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
      Tipo: t.type === 'INCOME' ? 'Entrada' : t.type === 'EXPENSE' ? 'Gasto' : 'Troco',
      Descrição: t.description,
      Valor: t.amount
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Financeiro")
    XLSX.writeFile(wb, "relatorio_financeiro.xlsx")
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    
    doc.text("Relatório Financeiro - Izamodas", 14, 15)
    
    const tableColumn = ["Data", "Tipo", "Descrição", "Valor (R$)"];
    const tableRows: string[][] = [];

    transactions.forEach(t => {
      const row = [
        format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
        t.type === 'INCOME' ? 'Entrada' : t.type === 'EXPENSE' ? 'Gasto' : 'Troco',
        t.description,
        t.amount.toFixed(2).replace('.', ',')
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })

    doc.save("relatorio_financeiro.pdf")
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleExportExcel}>
        <Download size={16} className="mr-2" /> Excel
      </Button>
      <Button variant="outline" onClick={handleExportPDF}>
        <FileText size={16} className="mr-2" /> PDF
      </Button>
    </div>
  )
}
