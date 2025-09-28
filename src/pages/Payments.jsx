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
import { paymentsApi } from '@/api/payments'
import { payslipsApi } from '@/api/payslips'
import Papa from 'papaparse'

const paymentSchema = z.object({
  payslipId: z.number().min(1, 'Bulletin requis'),
  amount: z.number().min(0.01, 'Montant doit être positif'),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'ORANGE_MONEY', 'WAVE', 'OTHER']),
  reference: z.string().optional(),
})

const columns = [
  {
    accessorKey: 'payslip.employee.fullName',
    header: 'Employé',
  },
  {
    accessorKey: 'amount',
    header: 'Montant',
    cell: ({ getValue }) => `${getValue()} FCFA`,
  },
  {
    accessorKey: 'method',
    header: 'Méthode',
  },
  {
    accessorKey: 'reference',
    header: 'Référence',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <PaymentActions payment={row.original} />,
  },
]

function PaymentActions({ payment }) {
  const exportMutation = useMutation({
    mutationFn: () => paymentsApi.exportReceipt(payment.id),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recu-${payment.id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    },
  })

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportMutation.mutate()}
        disabled={exportMutation.isPending}
      >
        Télécharger reçu
      </Button>
    </div>
  )
}

export default function Payments() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsApi.getAll(),
  })

  const { data: payslips } = useQuery({
    queryKey: ['payslips'],
    queryFn: () => payslipsApi.getAll(),
  })

  const batchExportMutation = useMutation({
    mutationFn: () => paymentsApi.batchExportReceipts(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'recus-batch.pdf'
      a.click()
      window.URL.revokeObjectURL(url)
    },
  })

  const exportToCSV = () => {
    if (!data?.data) return
    const csv = Papa.unparse(data.data.map(payment => ({
      'Employé': payment.payslip?.employee?.fullName,
      'Montant': payment.amount,
      'Méthode': payment.method,
      'Référence': payment.reference,
      'Date': new Date(payment.createdAt).toLocaleDateString(),
    })))
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'paiements.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const table = useReactTable({
    data: data?.data || [],
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

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-600 mt-2">
            Gérez et enregistrez les paiements
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={exportToCSV}>
            Exporter CSV
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            Enregistrer paiement
          </Button>
          <Button
            variant="outline"
            onClick={() => batchExportMutation.mutate()}
            disabled={batchExportMutation.isPending}
          >
            Exporter reçus
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des paiements</CardTitle>
          <CardDescription>
            {data?.total || 0} paiement(s)
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
                      Aucun paiement trouvé.
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

      <CreatePaymentDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        payslips={payslips?.data || []}
      />
    </div>
  )
}

function CreatePaymentDialog({ open, onOpenChange, payslips }) {
  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payslipId: 0,
      amount: 0,
      method: 'CASH',
      reference: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['payments'])
      onOpenChange(false)
      form.reset()
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Ajoutez un paiement pour un bulletin
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="payslipId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bulletin</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un bulletin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {payslips.map((payslip) => (
                        <SelectItem key={payslip.id} value={payslip.id.toString()}>
                          {payslip.employee.fullName} - {payslip.net} FCFA
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
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
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une méthode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">Espèces</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Virement bancaire</SelectItem>
                      <SelectItem value="ORANGE_MONEY">Orange Money</SelectItem>
                      <SelectItem value="WAVE">Wave</SelectItem>
                      <SelectItem value="OTHER">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence (optionnel)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}