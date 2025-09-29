import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react'

// Mock data
const mockCompanies = [
  { id: 1, name: 'TechCorp' },
  { id: 2, name: 'FinancePlus' },
  { id: 3, name: 'LogisticsPro' }
]

const mockUsers = [
  { id: 1, fullName: 'Jean Dupont', email: 'jean.dupont@techcorp.com', role: 'Admin', companyId: 1, companyName: 'TechCorp', isActive: true, createdAt: '2024-01-15' },
  { id: 2, fullName: 'Marie Martin', email: 'marie.martin@financeplus.com', role: 'Caissier', companyId: 2, companyName: 'FinancePlus', isActive: true, createdAt: '2024-01-12' },
  { id: 3, fullName: 'Pierre Durand', email: 'pierre.durand@logisticspro.com', role: 'Admin', companyId: 3, companyName: 'LogisticsPro', isActive: false, createdAt: '2024-01-10' },
  { id: 4, fullName: 'Sophie Leroy', email: 'sophie.leroy@techcorp.com', role: 'Caissier', companyId: 1, companyName: 'TechCorp', isActive: true, createdAt: '2024-01-08' },
  { id: 5, fullName: 'Michel Bernard', email: 'michel.bernard@financeplus.com', role: 'Admin', companyId: 2, companyName: 'FinancePlus', isActive: true, createdAt: '2024-01-05' }
]

export default function Users() {
  const [users, setUsers] = useState(mockUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Caissier',
    companyId: ''
  })

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      fullName: '',
      email: '',
      role: 'Caissier',
      companyId: ''
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      companyId: user.companyId.toString()
    })
    setIsDialogOpen(true)
  }

  const handleToggleActive = (id) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ))
  }

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const company = mockCompanies.find(c => c.id.toString() === formData.companyId)
    if (editingUser) {
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? {
              ...user,
              ...formData,
              companyId: parseInt(formData.companyId),
              companyName: company.name
            }
          : user
      ))
    } else {
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...formData,
        companyId: parseInt(formData.companyId),
        companyName: company.name,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, newUser])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom complet</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Entreprise associée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.companyName}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(user.id)}
                        className={user.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
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
              {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Caissier">Caissier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyId">Entreprise assignée</Label>
              <Select value={formData.companyId} onValueChange={(value) => setFormData({ ...formData, companyId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  {mockCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {editingUser ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}