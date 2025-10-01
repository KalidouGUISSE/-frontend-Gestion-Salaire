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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-modern rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-accent rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand Section */}
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-modern rounded-3xl flex items-center justify-center shadow-floating">
              <span className="text-3xl font-bold text-white">GS</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-accent rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Créer un compte</h1>
          <p className="text-lg text-muted-foreground">Rejoignez notre plateforme professionnelle</p>
        </div>

        {/* Register Card */}
        <div className="glass-premium rounded-3xl p-8 shadow-floating border border-white/20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Inscription</h2>
            <p className="text-muted-foreground">Créez votre compte pour accéder à l'application</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Nom complet</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Votre nom complet"
                          className="input-modern h-12 pl-12 pr-4 bg-white/50 border-white/30 focus:bg-white focus:border-primary"
                          {...field}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="votre@email.com"
                          className="input-modern h-12 pl-12 pr-4 bg-white/50 border-white/30 focus:bg-white focus:border-primary"
                          {...field}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="input-modern h-12 pl-12 pr-4 bg-white/50 border-white/30 focus:bg-white focus:border-primary"
                          {...field}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Rôle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-modern h-12 bg-white/50 border-white/30 focus:bg-white focus:border-primary">
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
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">ID Entreprise (optionnel)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="ID de l'entreprise"
                          className="input-modern h-12 pl-12 pr-4 bg-white/50 border-white/30 focus:bg-white focus:border-primary"
                          {...field}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm" />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-destructive text-sm font-medium">{form.formState.errors.root.message}</span>
                  </div>
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-modern hover:shadow-glow text-white font-semibold rounded-2xl transition-modern"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Inscription...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    S'inscrire
                  </div>
                )}
              </Button>
              <div className="text-center pt-4">
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:text-primary-hover font-semibold transition-modern"
                  onClick={() => navigate('/login')}
                >
                  Déjà un compte ? Se connecter
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Gestion des Salaires • Version Pro 2025</span>
          </div>
        </div>
      </div>
    </div>
  )
}