import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Mail, Phone, Calendar, DollarSign, FileText, CreditCard } from 'lucide-react'
import { employeesApi } from '@/api/employees'
import { payslipsApi } from '@/api/payslips'
import { paymentsApi } from '@/api/payments'
import { LoadingSpinner } from '@/components/Spinner'

const salaryPaymentSchema = z.object({
  payslipId: z.number().min(1, 'Bulletin requis'),
  amount: z.number().min(0.01, 'Montant doit être positif'),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'ORANGE_MONEY', 'WAVE', 'OTHER']),
  reference: z.string().optional(),
})

export default function EmployeeDetails() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)

  const { data: employee, isLoading: employeeLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeesApi.getById(id),
    enabled: !!id,
  })

  const { data: payslips, isLoading: payslipsLoading } = useQuery({
    queryKey: ['employee-payslips', id],
    queryFn: () => payslipsApi.getByEmployeeId(id),
    enabled: !!id,
  })

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['employee-payments', id],
    queryFn: () => paymentsApi.getByEmployeeId(id),
    enabled: !!id,
  })

  if (employeeLoading) return <LoadingSpinner />

  if (!employee?.data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Employé non trouvé.</p>
        <Link to="/employees">
          <Button className="mt-4">Retour à la liste</Button>
        </Link>
      </div>
    )
  }

  const emp = employee.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/employees">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{emp.fullName}</h1>
            <p className="text-gray-600">{emp.position}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge variant={emp.isActive ? 'default' : 'secondary'}>
            {emp.isActive ? 'Actif' : 'Inactif'}
          </Badge>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Générer bulletin
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="payslips">Bulletins</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="salary">Salaire</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=random&color=fff`}
                    alt={emp.fullName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{emp.email}</span>
                </div>
                {emp.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{emp.phone}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Embauché le {new Date(emp.hireDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Informations professionnelles */}
            <Card>
              <CardHeader>
                <CardTitle>Informations professionnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Poste</p>
                  <p>{emp.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type de contrat</p>
                  <p>{emp.contractType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Salaire de base</p>
                  <p className="text-lg font-semibold">{emp.salary} FCFA</p>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bulletins générés</p>
                  <p className="text-2xl font-bold">{payslips?.data?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Paiements effectués</p>
                  <p className="text-2xl font-bold">{payments?.data?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total payé</p>
                  <p className="text-2xl font-bold">
                    {payments?.data?.reduce((sum, payment) => sum + payment.amount, 0) || 0} FCFA
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payslips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des bulletins</CardTitle>
              <CardDescription>
                Tous les bulletins de salaire générés pour cet employé
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payslipsLoading ? (
                <LoadingSpinner />
              ) : payslips?.data?.length ? (
                <div className="space-y-4">
                  {payslips.data.map((payslip) => (
                    <div key={payslip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Bulletin #{payslip.id}</p>
                        <p className="text-sm text-gray-500">
                          Période: {new Date(payslip.periodStart).toLocaleDateString()} - {new Date(payslip.periodEnd).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">Net à payer: {payslip.net} FCFA</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Télécharger PDF
                        </Button>
                        <Badge variant={payslip.status === 'PAID' ? 'default' : 'secondary'}>
                          {payslip.status === 'PAID' ? 'Payé' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">Aucun bulletin trouvé.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des paiements</CardTitle>
              <CardDescription>
                Tous les paiements effectués pour cet employé
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <LoadingSpinner />
              ) : payments?.data?.length ? (
                <div className="space-y-4">
                  {payments.data.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.amount} FCFA</p>
                        <p className="text-sm text-gray-500">Méthode: {payment.method}</p>
                        {payment.reference && (
                          <p className="text-sm text-gray-500">Référence: {payment.reference}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Date: {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Télécharger reçu
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">Aucun paiement trouvé.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Gestion du salaire
              </CardTitle>
              <CardDescription>
                Effectuer un paiement de salaire pour cet employé
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Salaire de base</p>
                    <p className="text-2xl font-bold">{emp.salary} FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dernier paiement</p>
                    <p className="text-lg">
                      {payments?.data?.length
                        ? `${payments.data[payments.data.length - 1].amount} FCFA`
                        : 'Aucun'
                      }
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full md:w-auto" onClick={() => setIsPaymentOpen(true)}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Effectuer un paiement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SalaryPaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        employeeId={id}
        payslips={payslips?.data || []}
      />
    </div>
  )
}

function SalaryPaymentDialog({ open, onOpenChange, employeeId, payslips }) {
  const queryClient = useQueryClient()
  const form = useForm({
    resolver: zodResolver(salaryPaymentSchema),
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
      queryClient.invalidateQueries(['employee-payments', employeeId])
      queryClient.invalidateQueries(['employee-payslips', employeeId])
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
          <DialogTitle>Effectuer un paiement de salaire</DialogTitle>
          <DialogDescription>
            Enregistrez un paiement pour cet employé
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="payslipId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bulletin de salaire</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un bulletin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {payslips.map((payslip) => (
                        <SelectItem key={payslip.id} value={payslip.id.toString()}>
                          Bulletin #{payslip.id} - {payslip.net} FCFA ({payslip.status === 'PAID' ? 'Payé' : 'En attente'})
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
              {createMutation.isPending ? 'Enregistrement...' : 'Enregistrer le paiement'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
