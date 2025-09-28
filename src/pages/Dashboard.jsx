import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dashboardApi } from '@/api/dashboard'

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: () => dashboardApi.getKPIs(),
  })

  const { data: evolution, isLoading: evolutionLoading } = useQuery({
    queryKey: ['dashboard-evolution'],
    queryFn: () => dashboardApi.getEvolution(),
  })

  const { data: nextPayments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['dashboard-next-payments'],
    queryFn: () => dashboardApi.getNextPayments(),
  })

  if (kpisLoading || evolutionLoading || paymentsLoading) return <div>Chargement...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de votre gestion des salaires
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.data?.activeEmployees || 0}</div>
            <p className="text-xs text-muted-foreground">
              Employés actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Masse Salariale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.data?.totalPayroll || 0} FCFA</div>
            <p className="text-xs text-muted-foreground">
              Ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Paiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.data?.totalPaid || 0} FCFA</div>
            <p className="text-xs text-muted-foreground">
              Payé ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis?.data?.totalOutstanding || 0} FCFA</div>
            <p className="text-xs text-muted-foreground">
              À payer
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution sur 6 mois</CardTitle>
            <CardDescription>
              Graphique des salaires et paiements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={evolution?.data || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="gross" stroke="#8884d8" name="Brut" />
                <Line type="monotone" dataKey="paid" stroke="#82ca9d" name="Payé" />
                <Line type="monotone" dataKey="outstanding" stroke="#ff7300" name="En attente" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochains Paiements</CardTitle>
            <CardDescription>
              Paiements à effectuer bientôt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextPayments?.data?.length ? (
                nextPayments.data.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{payment.employee?.fullName}</p>
                      <p className="text-sm text-gray-500">{payment.amount} FCFA</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucun paiement prévu</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}