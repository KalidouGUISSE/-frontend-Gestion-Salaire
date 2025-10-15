import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'

export function useUsers(page = 1, limit = 10, filters = {}) {
  return useQuery({
    queryKey: ['users', page, limit, filters],
    queryFn: () => usersApi.getAll({ page, limit, ...filters }),
  })
}

export function useUserMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => queryClient.invalidateQueries(['users']),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => queryClient.invalidateQueries(['users']),
  })

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
  }
}