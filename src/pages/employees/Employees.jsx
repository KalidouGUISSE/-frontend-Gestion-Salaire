import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useParams, Link } from 'react-router-dom'
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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '@/api/companies'
import { employeesApi } from '@/api/employees'
import { LoadingSpinner } from '@/components/Spinner'
import useAuthStore from '@/store/auth'
import {
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  DollarSign,
  Camera,
  Sparkles,
  UserPlus,
  Building2,
  Calendar,
  CheckCircle,
} from 'lucide-react'

function EmployeeForm({ form, onSubmit, submitText, pendingText, isPending }) {
  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" encType="multipart/form-data">
          {/* Section Informations personnelles */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
                <p className="text-sm text-gray-600">Détails de base de l'employé</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      Prénom
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="input-modern h-12 pl-4 pr-4 text-base bg-white/70 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                          placeholder="Entrez le prénom"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      Nom
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="input-modern h-12 pl-4 pr-4 text-base bg-white/70 border-gray-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                          placeholder="Entrez le nom"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Mail className="w-4 h-4 mr-2 text-green-500" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          {...field}
                          className="input-modern h-12 pl-4 pr-4 text-base bg-white/70 border-gray-200 focus:bg-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-200"
                          placeholder="employe@exemple.com"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-purple-500" />
                      Téléphone
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="input-modern h-12 pl-4 pr-4 text-base bg-white/70 border-gray-200 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
                          placeholder="+221 XX XXX XX XX"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section Informations professionnelles */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Informations professionnelles</h3>
                <p className="text-sm text-gray-600">Détails du poste et contrat</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Briefcase className="w-4 h-4 mr-2 text-orange-500" />
                      Poste
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="input-modern h-12 pl-4 pr-4 text-base bg-white/70 border-gray-200 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-200"
                          placeholder="Ex: Développeur Full Stack"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <FileText className="w-4 h-4 mr-2 text-indigo-500" />
                      Type de contrat
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/70 border-gray-200 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-200">
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="JOURNALIER" className="cursor-pointer">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            Journalier
                          </div>
                        </SelectItem>
                        <SelectItem value="FIXE" className="cursor-pointer">
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2 text-green-500" />
                            Fixe
                          </div>
                        </SelectItem>
                        <SelectItem value="HONORAIRE" className="cursor-pointer">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-purple-500" />
                            Honoraire
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                    Salaire (FCFA)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="input-modern h-12 pl-4 pr-4 text-base bg-white/70 border-gray-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                        placeholder="0"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                        FCFA
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Section Photo de profil */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Photo de profil</h3>
                <p className="text-sm text-gray-600">Ajoutez une photo pour identifier l'employé</p>
              </div>
            </div>

            <FormItem>
              <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                <Camera className="w-4 h-4 mr-2 text-pink-500" />
                Sélectionner une image
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => form.setValue('profileImageFile', e.target.files?.[0])}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white hover:file:from-blue-600 hover:file:to-purple-700 file:cursor-pointer file:transition-all file:duration-200 h-12 bg-white/70 border-gray-200 focus:bg-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-200"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-sm mt-1" />
              <p className="text-xs text-gray-500 mt-2">
                Formats acceptés: JPG, PNG, WebP. Taille maximale: 5MB
              </p>
            </FormItem>
          </div>

          {/* Bouton de soumission */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-base rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  <span className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {pendingText}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span>{submitText}</span>
                  <CheckCircle className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

function EmployeeActions({ employee }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const mutations = useEmployeeMutations()
  const { toggleActive, delete: deleteMutation } = mutations
  const { user } = useAuthStore()

  return (
    <div className="flex space-x-2">
      <Link to={`/employees/${employee.id}`}>
        <Button variant="outline" size="sm">
          Voir détails
        </Button>
      </Link>
      {user?.role !== 'CASHIER' && (
        <>
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
        </>
      )}
    </div>
  )
}

function Filters({ statusFilter, setStatusFilter, contractFilter, setContractFilter }) {
  return (
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
  )
}

function EditEmployeeDialog({ employee, open, onOpenChange }) {
  const queryClient = useQueryClient()
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

  const onSubmit = async (data) => {
    const apiData = {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
    }
    update.mutate({ id: employee.id, data: apiData }, {
      onSuccess: async () => {
        const file = form.getValues('profileImageFile')
        if (file) {
          try {
            await employeesApi.uploadPhotos(employee.id, file)
            // Invalidate queries again after photo upload to show the new photo
            queryClient.invalidateQueries(['employees'])
          } catch {
            // Ignore photo upload errors
          }
        }
        onOpenChange(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Modifier l'employé
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Modifiez les informations de {employee.fullName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <EmployeeForm form={form} onSubmit={onSubmit} submitText="Modifier l'employé" pendingText="Modification en cours..." isPending={update.isPending} />
      </DialogContent>
    </Dialog>
  )
}

function EmployeeList({ employees }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees?.length ? (
        employees.map((employee) => (
          <Card key={employee.id} className="hover-lift interactive-card">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <img
                  src={employee.photos ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${employee.photos.replace(/^\/+/, '')}` : '/image.png'}
                  alt={employee.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/image.png' }}
                />
                <div>
                  <CardTitle className="text-lg">{employee.fullName}</CardTitle>
                  <CardDescription>{employee.position}</CardDescription>
                </div>
              </div>
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
  )
}

export default function Employees() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { companyId: paramCompanyId } = useParams()
  const [statusFilter, setStatusFilter] = useState('all')
  const [contractFilter, setContractFilter] = useState('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const { user } = useAuthStore()

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '6')
  const companyId = paramCompanyId || searchParams.get('companyId')

  const filters = {
    isActive: statusFilter === 'actif' ? true : statusFilter === 'inactif' ? false : undefined,
    contractType: contractFilter !== 'all' ? contractFilter : undefined,
    companyId: companyId ? parseInt(companyId) : undefined,
  }

  const { data, isLoading } = useEmployees(page, limit, filters)
  const employees = data?.data?.data || []
  const meta = data?.data?.meta || {}
  console.log('employees',data)
  
  const { data: companyData } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companiesApi.getById(companyId),
    enabled: !!companyId,
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
          {user?.role !== 'CASHIER' && (
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un employé
            </Button>
          )}
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
          <Filters statusFilter={statusFilter} setStatusFilter={setStatusFilter} contractFilter={contractFilter} setContractFilter={setContractFilter} />
          <EmployeeList employees={employees} />
          <Pagination page={page} meta={meta} handlePageChange={handlePageChange} handleItemsPerPageChange={handleItemsPerPageChange} limit={limit} />
        </CardContent>
      </Card>

      {user?.role !== 'CASHIER' && (
        <CreateEmployeeDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} companyId={companyId} />
      )}
    </div>
  )
}

function Pagination({ page, meta, handlePageChange, handleItemsPerPageChange, limit }) {
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

  return (
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
                  variant={page === pageNum ? 'default' : 'outline'}
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
  )
}

function CreateEmployeeDialog({ open, onOpenChange, companyId }) {
  const queryClient = useQueryClient()
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
    profileImageFile: undefined,
  }), [])
  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })

  const onSubmit = async (data) => {
    const { profileImageFile, ...rest } = data
    const apiData = {
      ...rest,
      fullName: `${rest.firstName} ${rest.lastName}`,
      hireDate: new Date().toISOString(),
      isActive: true,
    }
    if (companyId) {
      apiData.companyId = parseInt(companyId)
    }
    create.mutate(apiData, {
      onSuccess: async (res) => {
        console.log('🎉 Employé créé avec succès:', res)
        try {
          const newEmployeeId = res?.data?.id || res?.data?.data?.id || res?.data?.id
          console.log('🆔 ID de l\'employé créé:', newEmployeeId)
          console.log('📁 Fichier image:', profileImageFile)

          if (profileImageFile && newEmployeeId) {
            console.log('📸 Upload de la photo pour le nouvel employé:', newEmployeeId)
            console.log('📎 Détails du fichier:', {
              name: profileImageFile.name,
              size: profileImageFile.size,
              type: profileImageFile.type,
            })

            const uploadResult = await employeesApi.uploadPhotos(newEmployeeId, profileImageFile)
            console.log('✅ Photo uploadée avec succès:', uploadResult)

            // Invalidate queries to show the new photo
            queryClient.invalidateQueries(['employees'])
            console.log('🔄 Queries invalidées')
          } else {
            console.log('⚠️ Pas de fichier image ou ID employé manquant')
          }
        } catch (error) {
          console.error('❌ Erreur lors de l\'upload de la photo:', error)
          console.error('📋 Détails de l\'erreur:', error.response?.data || error.message)
          // Continue without failing the employee creation
        }
        onOpenChange(false)
        form.reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Ajouter un employé
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Créez un nouveau profil employé avec toutes ses informations
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <EmployeeForm form={form} onSubmit={onSubmit} submitText="Créer l'employé" pendingText="Création en cours..." isPending={create.isPending} />
      </DialogContent>
    </Dialog>
  )
}
