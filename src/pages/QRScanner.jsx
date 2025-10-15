import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/Spinner'
import { QrCode, User, Building, Phone, Mail, Briefcase } from 'lucide-react'

export default function QRScanner() {
  const [token, setToken] = useState('')
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScan = async () => {
    if (!token.trim()) {
      setError('Veuillez entrer un token QR')
      return
    }

    setLoading(true)
    setError('')
    setEmployee(null)

    try {
      // For demo purposes, we'll use a direct API call
      // In a real app, you'd use a QR scanner library
      const response = await fetch(`http://localhost:3000/employees/verify-qr/${token}`)
      const data = await response.json()

      if (data.success) {
        setEmployee(data.data)
      } else {
        setError(data.error?.message || 'Token QR invalide')
      }
    } catch {
      setError('Erreur lors de la vérification du QR code')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleScan()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scanner QR Code</h1>
          <p className="text-gray-600">Vérifiez l'identité d'un employé via son QR code</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              Scanner QR
            </CardTitle>
            <CardDescription>
              Entrez le token QR ou utilisez un scanner pour lire le code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="qr-token">Token QR</Label>
              <Input
                id="qr-token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Entrez le token QR..."
                className="mt-1"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleScan}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Vérification...' : 'Vérifier QR Code'}
            </Button>

            <div className="text-sm text-gray-500">
              <p>• Scannez le QR code de l'employé</p>
              <p>• Ou entrez manuellement le token affiché</p>
            </div>
          </CardContent>
        </Card>

        {/* Employee Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Détails de l'employé
            </CardTitle>
            <CardDescription>
              Informations de l'employé scanné
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner />
            ) : employee ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold">{employee.fullName}</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{employee.email || 'Non spécifié'}</span>
                  </div>

                  {employee.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{employee.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{employee.position || 'Non spécifié'}</span>
                  </div>

                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{employee.company?.name || 'Entreprise inconnue'}</span>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Type de contrat: <span className="font-medium">{employee.contractType}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" variant="outline">
                    Procéder au paiement
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Scannez un QR code pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
