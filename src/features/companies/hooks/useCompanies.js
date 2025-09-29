import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesApi } from '@/api/companies'

export function useCompanies(page = 1, limit = 10, filters = {}) {
  return useQuery({
    queryKey: ['companies', page, limit, filters],
    queryFn: () => companiesApi.getAll({ page, limit, ...filters }),
  })
}

export function useCompanyMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: companiesApi.create,
    onSuccess: () => queryClient.invalidateQueries(['companies']),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => companiesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['companies']),
  })

  const deleteMutation = useMutation({
    mutationFn: companiesApi.delete,
    onSuccess: () => queryClient.invalidateQueries(['companies']),
  })

  const activateMutation = useMutation({
    mutationFn: ({ id, isActive }) => companiesApi.activate(id, isActive),
    onSuccess: () => queryClient.invalidateQueries(['companies']),
  })

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    activate: activateMutation,
  }
}
