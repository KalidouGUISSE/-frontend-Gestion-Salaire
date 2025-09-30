import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { employeeSchema } from '@/validators/employeeValidator'
import { exportEmployeesToCSV } from '@/utils/csvExporter'
import { useEmployees, useEmployeeMutations } from '@/features/employees/hooks/useEmployees'
import { useQuery } from '@tanstack/react-query'
import { companiesApi } from '@/api/companies'
import { LoadingSpinner } from '@/components/Spinner'


function EmployeeActions({ employee }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const mutations = useEmployeeMutations()
  const { toggleActive, delete: deleteMutation } = mutations

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditOpen(true)}
      >
        Modifier
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleActive.mutate({ id: employee.id, isActive: !employee.isActive })}
        disabled={toggleActive.isPending}
      >
        {employee.isActive ? 'Désactiver' : 'Activer'}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
            deleteMutation.mutate(employee.id)
          }
        }}
        disabled={deleteMutation.isPending}
      >
        Supprimer
      </Button>
      <EditEmployeeDialog
        employee={employee}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </div>
  )
}

function EditEmployeeDialog({ employee, open, onOpenChange }) {
  const mutations = useEmployeeMutations()
  const { update } = mutations
  const defaultValues = useMemo(() => {
    const [firstName, ...lastNameParts] = (employee.fullName || '').split(' ')
    const lastName = lastNameParts.join(' ')
    return {
      firstName,
      lastName,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position,
      contractType: employee.contractType,
      salary: employee.salary || employee.baseSalary || 0,
    }
  }, [employee.fullName, employee.email, employee.phone, employee.position, employee.contractType, employee.salary, employee.baseSalary])
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  const onSubmit = (data) => {
    const apiData = {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
    }
    update.mutate({ id: employee.id, data: apiData }, { onSuccess: () => onOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier Employé</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l'employé
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de contrat</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="JOURNALIER">Journalier</SelectItem>
                      <SelectItem value="FIXE">Fixe</SelectItem>
                      <SelectItem value="HONORAIRE">Honoraire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire</FormLabel>
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
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? 'Modification...' : 'Modifier'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function Employees() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { companyId: paramCompanyId } = useParams()
  const [statusFilter, setStatusFilter] = useState('all')
  const [contractFilter, setContractFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '6')
  const companyId = paramCompanyId || searchParams.get('companyId')

  const filters = {
    isActive: statusFilter === 'actif' ? true : statusFilter === 'inactif' ? false : undefined,
    contractType: contractFilter !== 'all' ? contractFilter : undefined,
    companyId: companyId ? parseInt(companyId) : undefined,
  }

  const { data, isLoading, error } = useEmployees(page, limit, filters)
  console.log('isLoading:', isLoading);
  console.log('data:', data);
  console.log('error:', error);
  console.log('data?.data:', data?.data);
  console.log('data?.data length:', data?.length);
  const employees = data?.data?.data || []
  const meta = data?.data?.meta || {}
  console.log('Debug - data:', data)
  console.log('Debug - meta:', meta)
  console.log('Debug - page:', page, 'lastPage:', meta.lastPage, 'hasNextPage:', meta.hasNextPage, 'hasPrevPage:', meta.hasPrevPage)

  const { data: companyData } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companiesApi.getById(companyId),
    enabled: !!companyId
  })

  const handleExportCSV = () => exportEmployeesToCSV(employees)

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() })
  }

  const handleItemsPerPageChange = (value) => {
    setSearchParams({ page: '1', limit: value })
  }

  // Reset to first page when filter changes
  useEffect(() => {
    setSearchParams({ page: '1', limit: limit.toString() })
  }, [statusFilter, contractFilter, limit, setSearchParams])

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const totalPages = meta.lastPage || 1

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
      }
    }

    return pages
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {companyData?.data?.name ? `Employés de ${companyData.data.name}` : 'Employés'}
          </h1>
          <p className="text-gray-600 mt-2">
            {companyData?.data?.name ? `Gérez les employés de ${companyData.data.name}` : 'Gérez vos employés'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportCSV}>
            Exporter CSV
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            Ajouter un employé
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des employés</CardTitle>
          <CardDescription>
            {meta.total || 0} employé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="flex items-center py-4">
            <Input
              placeholder="Rechercher..."
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm"
            />
          </div> */}
          <div className="flex items-center gap-4 py-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
            <Select value={contractFilter} onValueChange={setContractFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="JOURNALIER">Journalier</SelectItem>
                <SelectItem value="FIXE">Fixe</SelectItem>
                <SelectItem value="HONORAIRE">Honoraire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees?.length ? (
              employees.map((employee) => (
                <Card key={employee.id} className="hover-lift interactive-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{employee.fullName}</CardTitle>
                    <CardDescription>{employee.position}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Contrat:</span>
                        <span className="ml-2">{employee.contractType}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Salaire:</span>
                        <span className="ml-2">{employee.salary} FCFA</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium">Statut:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          employee.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <EmployeeActions employee={employee} />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Aucun employé trouvé.</p>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{meta.total || 0} employé(s) trouvé(s)</span>
              <Select value={limit.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="9">9</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                </SelectContent>
              </Select>
              <span>par page</span>
            </div>

            {(meta.lastPage || 1) > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={!meta.hasPrevPage && page === 1}
                >
                  Première page
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!meta.hasPrevPage}
                >
                  Précédent
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={index} className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        key={index}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!meta.hasNextPage}
                >
                  Suivant
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(meta.lastPage || 1)}
                  disabled={!meta.hasNextPage && page === (meta.lastPage || 1)}
                >
                  Dernière page
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateEmployeeDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} companyId={companyId} />
    </div>
  )
}

function CreateEmployeeDialog({ open, onOpenChange, companyId }) {
  const mutations = useEmployeeMutations()
  const { create } = mutations
  const defaultValues = useMemo(() => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    contractType: 'FIXE',
    salary: 0,
  }), [])
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  const onSubmit = (data) => {
    const apiData = {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
      hireDate: new Date().toISOString(),
      isActive: true,
    }
    if (companyId) {
      apiData.companyId = parseInt(companyId)
    }
    create.mutate(apiData, { onSuccess: () => { onOpenChange(false); form.reset() } })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un employé</DialogTitle>
          <DialogDescription>
            Créez un nouveau profil employé
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contractType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de contrat</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="JOURNALIER">Journalier</SelectItem>
                      <SelectItem value="FIXE">Fixe</SelectItem>
                      <SelectItem value="HONORAIRE">Honoraire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire</FormLabel>
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
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Création...' : 'Créer'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
