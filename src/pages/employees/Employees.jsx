import { useState, useMemo } from 'react'
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
import { getEmployeesFromResponse } from '@/utils/employees'


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
  const defaultValues = useMemo(() => ({
    fullName: employee.fullName,
    email: employee.email,
    phone: employee.phone || '',
    position: employee.position,
    contractType: employee.contractType,
    baseSalary: employee.baseSalary,
  }), [employee.fullName, employee.email, employee.phone, employee.position, employee.contractType, employee.baseSalary])
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  const onSubmit = (data) => {
    update.mutate({ id: employee.id, data }, { onSuccess: () => onOpenChange(false) })
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
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
                      <SelectItem value="DAILY">Journalier</SelectItem>
                      <SelectItem value="FIXED">Fixe</SelectItem>
                      <SelectItem value="FEE">Honoraire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire de base</FormLabel>
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
  const [globalFilter, setGlobalFilter] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data, isLoading, error } = useEmployees()
  console.log('isLoading:', isLoading);
  console.log('data:', data);
  console.log('error:', error);
  console.log('data?.data:', data?.data);
  console.log('data?.data length:', data?.data?.length);
  const allEmployees = getEmployeesFromResponse(data)

  const filteredEmployees = allEmployees?.filter(employee => {
    const filter = globalFilter.toLowerCase()
    return (
      (employee.fullName?.toLowerCase() || '').includes(filter) ||
      (employee.email?.toLowerCase() || '').includes(filter) ||
      (employee.position?.toLowerCase() || '').includes(filter)
    )
  }) || []

  const handleExportCSV = () => exportEmployeesToCSV(data?.data)

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employés</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos employés
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
            {data?.total || 0} employé(s)
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees?.length ? (
              filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-lg transition-shadow">
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
                        <span className="ml-2">{employee.baseSalary} FCFA</span>
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
          <div className="text-sm text-muted-foreground text-center py-4">
            {filteredEmployees.length} employé(s) trouvé(s)
          </div>
        </CardContent>
      </Card>

      <CreateEmployeeDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  )
}

function CreateEmployeeDialog({ open, onOpenChange }) {
  const mutations = useEmployeeMutations()
  const { create } = mutations
  const defaultValues = useMemo(() => ({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    contractType: 'FIXED',
    baseSalary: 0,
  }), [])
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  const onSubmit = (data) => {
    create.mutate(data, { onSuccess: () => { onOpenChange(false); form.reset() } })
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
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
                      <SelectItem value="DAILY">Journalier</SelectItem>
                      <SelectItem value="FIXED">Fixe</SelectItem>
                      <SelectItem value="FEE">Honoraire</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="baseSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salaire de base</FormLabel>
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