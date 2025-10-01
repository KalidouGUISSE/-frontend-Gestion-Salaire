import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { payslipsApi } from '@/api/payslips'
import Papa from 'papaparse'
import { LoadingSpinner } from '@/components/Spinner'

const payslipSchema = z.object({
  gross: z.number().min(0, 'Brut doit être positif'),
  deductions: z.number().min(0, 'Déductions doivent être positives'),
})

const columns = [
  {
    accessorKey: 'employee.fullName',
    header: 'Employé',
  },
  {
    accessorKey: 'payrun.periodIdentifier',
    header: 'Cycle',
    cell: ({ row }) => row.original.payrun?.periodIdentifier || `${row.original.payrun?.periodStart} - ${row.original.payrun?.periodEnd}`,
  },
  {
    accessorKey: 'gross',
    header: 'Brut',
    cell: ({ getValue }) => `${getValue()} FCFA`,
  },
  {
    accessorKey: 'deductions',
    header: 'Déductions',
    cell: ({ getValue }) => `${getValue()} FCFA`,
  },
  {
    accessorKey: 'net',
    header: 'Net',
    cell: ({ getValue }) => `${getValue()} FCFA`,
  },
  {
    accessorKey: 'status',
    header: 'Statut',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <PayslipActions payslip={row.original} />,
  },
]

function PayslipActions({ payslip }) {
//   const queryClient = useQueryClient()
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const exportMutation = useMutation({
    mutationFn: () => payslipsApi.exportPDF(payslip.id),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bulletin-${payslip.id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    },
  })

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsViewOpen(true)}
      >
        Voir
      </Button>
      {payslip.payrun?.status === 'DRAFT' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditOpen(true)}
        >
          Modifier
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportMutation.mutate()}
        disabled={exportMutation.isPending}
      >
        Exporter PDF
      </Button>
      <PayslipViewDialog
        payslip={payslip}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />
      <PayslipEditDialog
        payslip={payslip}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  )
}

function PayslipViewDialog({ payslip, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulletin de paie</DialogTitle>
          <DialogDescription>
            Détails du bulletin pour {payslip.employee?.fullName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <strong>Employé:</strong> {payslip.employee?.fullName}
          </div>
          <div>
            <strong>Cycle:</strong> {payslip.payrun?.periodIdentifier || `${payslip.payrun?.periodStart} - ${payslip.payrun?.periodEnd}`}
          </div>
          <div>
            <strong>Salaire brut:</strong> {payslip.gross} FCFA
          </div>
          <div>
            <strong>Déductions:</strong> {payslip.deductions} FCFA
          </div>
          <div>
            <strong>Salaire net:</strong> {payslip.net} FCFA
          </div>
          <div>
            <strong>Statut:</strong> {payslip.status}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PayslipEditDialog({ payslip, open, onOpenChange }) {
  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(payslipSchema),
    defaultValues: {
      gross: payslip.gross,
      deductions: payslip.deductions,
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data) => payslipsApi.update(payslip.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['payslips'])
      onOpenChange(false)
    },
  })

  const onSubmit = (data) => {
    updateMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le bulletin</DialogTitle>
          <DialogDescription>
            Modifiez les montants du bulletin
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="gross"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire brut</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deductions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Déductions</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Modification...' : 'Modifier'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function Payslips() {
  const [globalFilter, setGlobalFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['payslips'],
    queryFn: () => payslipsApi.getAll(),
  })

  const batchExportMutation = useMutation({
    mutationFn: () => payslipsApi.batchExport(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bulletins-batch.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
    },
  })

  const exportToCSV = () => {
    if (!data?.data) return
    const csv = Papa.unparse(data.data.map(payslip => ({
      'Employé': payslip.employee?.fullName,
      'Cycle': payslip.payrun?.periodIdentifier || `${payslip.payrun?.periodStart} - ${payslip.payrun?.periodEnd}`,
      'Brut': payslip.gross,
      'Déductions': payslip.deductions,
      'Net': payslip.net,
      'Statut': payslip.status,
    })))
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulletins.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const table = useReactTable({
    data: data?.data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  console.log(table)
  
  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulletins de paie</h1>
          <p className="text-gray-600 mt-2">
            Gérez et exportez vos bulletins
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportToCSV}>
            Exporter CSV
          </Button>
          <Button
            onClick={() => batchExportMutation.mutate()}
            disabled={batchExportMutation.isPending}
          >
            Exporter tous en PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des bulletins</CardTitle>
          <CardDescription>
            {data?.total || 0} bulletin(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Rechercher..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Aucun bulletin trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} sur{' '}
              {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée(s).
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Suivant
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
