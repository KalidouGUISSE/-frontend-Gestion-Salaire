import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, XCircle, Clock, User } from 'lucide-react'
import { attendanceApi } from '@/api/attendance'

export default function Kiosk() {
  const [scanResult, setScanResult] = useState(null)
  const [isScanning, setIsScanning] = useState(true)
  const [scanner, setScanner] = useState(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (isScanning && !scanner) {
      const qrScanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false,
      )

      qrScanner.render(onScanSuccess, onScanError)
      setScanner(qrScanner)
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(console.error)
      }
    }
  }, [isScanning, scanner]) // eslint-disable-line react-hooks/exhaustive-deps

  const onScanSuccess = async (decodedText) => {
    setIsScanning(false)
    if (scanner) {
      scanner.clear().catch(console.error)
    }

    try {
      const response = await attendanceApi.scan({
        qrData: decodedText,
        deviceId: 'kiosk-tablet-001',
      })

      const employeeInfo = response.data?.employeeInfo
      const attendance = response.data?.attendance

      setScanResult({
        success: true,
        message: response.message || 'Pointage enregistré avec succès',
        type: attendance?.type || 'UNKNOWN',
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        employeeInfo: employeeInfo ? {
          fullName: employeeInfo.fullName,
          position: employeeInfo.position,
          email: employeeInfo.email,
          phone: employeeInfo.phone,
          company: employeeInfo.company?.name,
        } : null,
      })
    } catch (error) {
      setScanResult({
        success: false,
        message: error.response?.data?.message || 'Erreur lors du scan',
        type: null,
        timestamp: new Date().toLocaleTimeString('fr-FR'),
        employeeInfo: null,
      })
    }

    // Auto-restart scanning after 8 seconds to show employee info
    setTimeout(() => {
      setScanResult(null)
      setIsScanning(true)
    }, 8000)
  }

  const onScanError = (error) => {
    // Ignore scan errors, just keep scanning
    console.log('Scan error:', error)
  }

  const restartScanning = () => {
    setScanResult(null)
    setIsScanning(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kiosque de Pointage</h1>
                <p className="text-sm text-gray-600">Scannez votre QR code</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {isScanning ? (
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Prêt à scanner
                  </h2>
                  <p className="text-gray-600">
                    Positionnez votre QR code dans le cadre
                  </p>
                </div>

                <div
                  id="qr-reader"
                  className="w-full max-w-sm mx-auto mb-4"
                  ref={scannerRef}
                ></div>

                <div className="text-sm text-gray-500">
                  <p>• Assurez-vous que le QR code est bien visible</p>
                  <p>• Éloignez-vous si nécessaire pour la mise au point</p>
                </div>
              </CardContent>
            </Card>
          ) : scanResult ? (
            <Card className={`text-center border-2 ${
              scanResult.success
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}>
              <CardContent className="pt-6">
                <div className="mb-6">
                  {scanResult.success ? (
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  )}

                  <h2 className={`text-xl font-semibold mb-2 ${
                    scanResult.success ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {scanResult.success ? 'Pointage réussi' : 'Erreur de pointage'}
                  </h2>

                  <p className={`text-sm mb-4 ${
                    scanResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {scanResult.message}
                  </p>

                  {scanResult.success && scanResult.employeeInfo && (
                    <div className="bg-white/50 rounded-lg p-4 mb-4 text-left">
                      <h3 className="font-semibold text-gray-900 mb-2">Informations employé</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Nom:</span> {scanResult.employeeInfo.fullName}</p>
                        <p><span className="font-medium">Poste:</span> {scanResult.employeeInfo.position}</p>
                        {scanResult.employeeInfo.email && (
                          <p><span className="font-medium">Email:</span> {scanResult.employeeInfo.email}</p>
                        )}
                        {scanResult.employeeInfo.phone && (
                          <p><span className="font-medium">Téléphone:</span> {scanResult.employeeInfo.phone}</p>
                        )}
                        {scanResult.employeeInfo.company && (
                          <p><span className="font-medium">Entreprise:</span> {scanResult.employeeInfo.company}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {scanResult.type && (
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {scanResult.type === 'ENTRY' ? 'Entrée' : 'Sortie'} - {scanResult.timestamp}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={restartScanning}
                  className="w-full"
                  variant={scanResult.success ? 'default' : 'outline'}
                >
                  Scanner un nouveau code
                </Button>

                <div className="mt-4 text-xs text-gray-500">
                  Redémarrage automatique dans quelques secondes...
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="text-center text-sm text-gray-500">
            Système de gestion des présences - {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  )
}
