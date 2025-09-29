import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data
const mockKPIs = {
  totalCompanies: 25,
  totalUsers: 150,
  totalActiveEmployees: 1200
}

const mockChartData = [
  { month: 'Jan', companies: 2 },
  { month: 'Fév', companies: 4 },
  { month: 'Mar', companies: 3 },
  { month: 'Avr', companies: 6 },
  { month: 'Mai', companies: 5 },
  { month: 'Jun', companies: 8 },
  { month: 'Jul', companies: 7 },
  { month: 'Aoû', companies: 9 },
  { month: 'Sep', companies: 6 },
  { month: 'Oct', companies: 10 },
  { month: 'Nov', companies: 8 },
  { month: 'Déc', companies: 12 }
]

const mockRecentCompanies = [
  { id: 1, name: 'TechCorp', address: 'Paris', currency: 'EUR', periodType: 'Mensuel', createdAt: '2024-01-15' },
  { id: 2, name: 'FinancePlus', address: 'Lyon', currency: 'EUR', periodType: 'Mensuel', createdAt: '2024-01-12' },
  { id: 3, name: 'LogisticsPro', address: 'Marseille', currency: 'EUR', periodType: 'Mensuel', createdAt: '2024-01-10' },
  { id: 4, name: 'RetailHub', address: 'Toulouse', currency: 'EUR', periodType: 'Mensuel', createdAt: '2024-01-08' },
  { id: 5, name: 'ConsultingGroup', address: 'Nice', currency: 'EUR', periodType: 'Mensuel', createdAt: '2024-01-05' }
]

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Super-Administrateur</h1>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entreprises</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Entreprises actives</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Admins + Caissiers</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employés Actifs</CardTitle>
            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.totalActiveEmployees}</div>
            <p className="text-xs text-muted-foreground">Employés actifs globalement</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Entreprises Créées</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="companies" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Dernières Entreprises Ajoutées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900">{company.name}</h3>
                  <p className="text-sm text-gray-600">{company.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{company.currency} • {company.periodType}</p>
                  <p className="text-xs text-gray-500">{company.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}