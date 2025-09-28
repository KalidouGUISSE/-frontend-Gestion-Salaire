import { z } from 'zod'

export const employeeSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  position: z.string().min(1, 'Poste requis'),
  contractType: z.enum(['JOURNALIER', 'FIXE', 'HONORAIRE']),
  salary: z.number().min(0, 'Salaire doit être positif'),
  companyId: z.number().optional(),
})
