import Papa from 'papaparse'

export function exportEmployeesToCSV(employees) {
  if (!employees || employees.length === 0) return

  const csv = Papa.unparse(employees.map(employee => ({
    'Nom complet': employee.fullName,
    Email: employee.email,
    Téléphone: employee.phone,
    Poste: employee.position,
    'Type de contrat': employee.contractType,
    'Salaire de base': employee.baseSalary,
    'Statut': employee.isActive ? 'Actif' : 'Inactif',
  })))

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'employes.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}
