import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { authApi } from '@/api/auth'

import { ErrorHandler } from "@/utils/ErrorHandler";

const registerSchema = z.object({
  fullName: z.string().min(3, 'Le nom complet doit contenir au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "CASHIER", "EMPLOYEE"]).optional().default("ADMIN"),
  companyId: z.string().optional(), // string pour input, convertir en number si présent
})

export default function Register() {
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'ADMIN',
      companyId: '',
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        ...data,
        isActive:true,
        companyId: data.companyId ? parseInt(data.companyId) : undefined,
      }
      return authApi.register(payload)
    },
    onSuccess: () => {
      navigate('/login') // Rediriger vers login après inscription
    },
    onError: (error) => {
      const message = ErrorHandler.getMessage(error);
      form.setError('root', { message });
    },
  })

  const onSubmit = (data) => {
    registerMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
          <CardDescription>
            Créez votre compte pour accéder à l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom complet" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">USER</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="CASHIER">MANAGER</SelectItem>
                        {/* <SelectItem value="EMPLOYEE">Employé</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID Entreprise (optionnel)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ID de l'entreprise" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Inscription...' : "S'inscrire"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Déjà un compte ? Se connecter
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}