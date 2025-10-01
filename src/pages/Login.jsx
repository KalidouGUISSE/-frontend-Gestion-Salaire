import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { authApi } from '@/api/auth'
import useAuthStore from '@/store/auth'
import { ErrorHandler } from "@/utils/ErrorHandler";

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe doit contenir au moins 6 caractères'),
})

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.user, data.accessToken)
      localStorage.setItem('auth-token', data.accessToken)
      console.log('data.token',data.accessToken);

      // Redirect based on role
      if (data.user.role === 'SUPER_ADMIN') {
        navigate('/super-admin-dashboard')
      } else {
        navigate('/dashboard')
      }
    },
    onError: (error) => {
      const message = ErrorHandler.getMessage(error);
      form.setError('root', { message });
    },
  })

  const onSubmit = (data) => {
    loginMutation.mutate(data)
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
          <h1 className="text-4xl font-bold text-foreground mb-3">Bienvenue</h1>
          <p className="text-lg text-muted-foreground">Connectez-vous à votre espace professionnel</p>
        </div>

        {/* Login Card */}
        <div className="glass-premium rounded-3xl p-8 shadow-floating border border-white/20">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">Adresse email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="votre@email.com"
                          className="input-modern h-14 pl-12 pr-4 text-base bg-white/50 border-white/30 focus:bg-white focus:border-primary"
                          {...field}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm mt-2"/>
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
                          className="input-modern h-14 pl-12 pr-4 text-base bg-white/50 border-white/30 focus:bg-white focus:border-primary"
                          {...field}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-destructive text-sm mt-2" />
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
                className="w-full h-14 bg-gradient-modern hover:shadow-glow text-white font-semibold text-base rounded-2xl transition-modern"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </div>
                )}
              </Button>

              <div className="text-center pt-4">
                <Button
                  type="button"
                  variant="link"
                  className="text-primary hover:text-primary-hover font-semibold transition-modern text-base"
                  onClick={() => navigate('/register')}
                >
                  Pas encore de compte ? S'inscrire
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