import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { employeesApi } from '@/api/employees'

export function useEmployees(page = 1, limit = 10, filters = {}) {
  return useQuery({
    queryKey: ['employees', page, limit, filters],
    queryFn: () => employeesApi.getAll({ page, limit, ...filters }),
  })
}

export function useEmployeeMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: employeesApi.create,
    onSuccess: () => queryClient.invalidateQueries(['employees']),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => employeesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['employees']),
  })

  const deleteMutation = useMutation({
    mutationFn: employeesApi.delete,
    onSuccess: () => queryClient.invalidateQueries(['employees']),
  })

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => employeesApi.toggleActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries(['employees']),
  })

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    toggleActive: toggleActiveMutation,
  }
}
