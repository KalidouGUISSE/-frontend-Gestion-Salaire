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
import { payrunsApi } from '@/api/payruns'
import { LoadingSpinner } from '@/components/Spinner'

const payrunSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  type: z.enum(['MONTHLY', 'WEEKLY', 'DAILY'], { required_error: 'Type requis' }),
  periodStart: z.string().min(1, 'Date de début requise'),
  periodEnd: z.string().min(1, 'Date de fin requise'),
})

const columns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Titre',
  },
  {
    accessorKey: 'periodStart',
    header: 'Début',
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  },
  {
    accessorKey: 'periodEnd',
    header: 'Fin',
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    cell: ({ getValue }) => {
      const status = getValue()
      return status === 'DRAFT' ? 'Brouillon' : status === 'APPROVED' ? 'Approuvé' : 'Fermé'
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Créé le',
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <PayRunActions payrun={row.original} />,
  },
]

function PayRunActions({ payrun }) {
  const queryClient = useQueryClient()
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const generateMutation = useMutation({
    mutationFn: () => payrunsApi.generatePayslips(payrun.id),
    onSuccess: () => queryClient.invalidateQueries(['payruns']),
  })

  const approveMutation = useMutation({
    mutationFn: () => payrunsApi.approve(payrun.id),
    onSuccess: () => queryClient.invalidateQueries(['payruns']),
  })

  const closeMutation = useMutation({
    mutationFn: () => payrunsApi.close(payrun.id),
    onSuccess: () => queryClient.invalidateQueries(['payruns']),
  })

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDetailOpen(true)}
      >
        Détails
      </Button>
      {payrun.status === 'DRAFT' && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
          >
            Générer bulletins
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending}
          >
            Approuver
          </Button>
        </>
      )}
      {payrun.status === 'APPROVED' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => closeMutation.mutate()}
          disabled={closeMutation.isPending}
        >
          Fermer
        </Button>
      )}
      <PayRunDetailDialog
        payrun={payrun}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}

function PayRunDetailDialog({ payrun, open, onOpenChange }) {
  const { data: payslips, isLoading } = useQuery({
    queryKey: ['payruns', payrun.id, 'payslips'],
    queryFn: () => payrunsApi.getPayslips(payrun.id),
    enabled: open,
  })

  console.log(payslips?.data?.data);
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Détails du cycle de paie</DialogTitle>
          <DialogDescription>
            Période: {new Date(payrun.periodStart).toLocaleDateString()} - {new Date(payrun.periodEnd).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Bulletins de paie</h3>
            {payslips?.data?.data?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employé</TableHead>
                    <TableHead>Brut</TableHead>
                    <TableHead>Déductions</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payslips.data.data.map((payslip) => (
                    <TableRow key={payslip.id}>
                      <TableCell>{payslip.employee.fullName}</TableCell>
                      <TableCell>{payslip.gross} FCFA</TableCell>
                      <TableCell>{payslip.deductions} FCFA</TableCell>
                      <TableCell>{payslip.net} FCFA</TableCell>
                      <TableCell>{payslip.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Aucun bulletin généré.</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function PayRuns() {
  const [globalFilter, setGlobalFilter] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['payruns'],
    queryFn: () => payrunsApi.getAll(),
  })

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

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cycles de paie</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos cycles de paie et bulletins
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          Créer un cycle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des cycles</CardTitle>
          <CardDescription>
            {data?.total || 0} cycle(s)
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
                      Aucun cycle trouvé.
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

      <CreatePayRunDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  )
}

function CreatePayRunDialog({ open, onOpenChange }) {
  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(payrunSchema),
    defaultValues: {
      title: '',
      type: 'MONTHLY',
      periodStart: '',
      periodEnd: '',
    },
  })

  const createMutation = useMutation({
    mutationFn: payrunsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['payruns'])
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
          <DialogTitle>Créer un cycle de paie</DialogTitle>
          <DialogDescription>
            Définissez la période du cycle
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du cycle</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: PayRun September 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Mensuel</SelectItem>
                      <SelectItem value="WEEKLY">Hebdomadaire</SelectItem>
                      <SelectItem value="DAILY">Quotidien</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="periodStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="periodEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de fin</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Création...' : 'Créer'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}