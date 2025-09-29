import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCompanies, useCompanyMutations } from '@/features/companies/hooks/useCompanies'

export default function Companies() {
  const navigate = useNavigate()

  const { data, isLoading, error } = useCompanies()
  const companies = data?.data?.data || []

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    currency: 'EUR',
    periodType: 'Mensuel',
    logo: ''
  })

  const handleCreate = () => {
    setEditingCompany(null)
    setFormData({
      name: '',
      address: '',
      currency: 'EUR',
      periodType: 'Mensuel',
      logo: ''
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      address: company.address,
      currency: company.currency,
      periodType: company.payPeriodType === 'MONTHLY' ? 'Mensuel' : company.payPeriodType === 'WEEKLY' ? 'Hebdomadaire' : 'Journalier',
      logo: company.logo || ''
    })
    setIsDialogOpen(true)
  }

  const { delete: deleteCompany, create, update } = useCompanyMutations()

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      deleteCompany.mutate(id)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const apiData = {
      ...formData,
      payPeriodType: formData.periodType === 'Mensuel' ? 'MONTHLY' : formData.periodType === 'Hebdomadaire' ? 'WEEKLY' : 'DAILY',
    }
    delete apiData.periodType

    if (editingCompany) {
      update.mutate(
        { id: editingCompany.id, data: apiData },
        {
          onSuccess: () => {
            setIsDialogOpen(false)
          },
        }
      )
    } else {
      create.mutate(apiData, {
        onSuccess: () => {
          setIsDialogOpen(false)
        },
      })
    }
  }

  const handleView = (company) => {
    // For now, just log. In real app, could open a detail modal or navigate
    console.log('Viewing company:', company)
  }

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur lors du chargement des entreprises</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Entreprises</h1>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Créer une entreprise
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Entreprises</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Devise</TableHead>
                <TableHead>Type de période</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.address}</TableCell>
                  <TableCell>{company.currency}</TableCell>
                  <TableCell>{company.payPeriodType === 'MONTHLY' ? 'Mensuel' : company.payPeriodType === 'WEEKLY' ? 'Hebdomadaire' : 'Journalier'}</TableCell>
                  <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => navigate(`/employees/`)}
                      >
                        Accéder
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(company)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(company)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(company.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? 'Modifier l\'entreprise' : 'Créer une entreprise'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo (URL)</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodType">Type de période</Label>
              <Select value={formData.periodType} onValueChange={(value) => setFormData({ ...formData, periodType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensuel">Mensuel</SelectItem>
                  <SelectItem value="Quinzaine">Quinzaine</SelectItem>
                  <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingCompany ? 'Modifier' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
