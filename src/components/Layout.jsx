import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/store/auth'

export default function Layout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    localStorage.removeItem('auth-token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 text-foreground flex">
      {/* Modern Sidebar */}
      <aside className="w-72 bg-white/95 backdrop-blur-xl border-r border-border/50 shadow-xl">
        <div className="p-8">
          {/* Brand Section */}
          <div className="flex items-center space-x-4 mb-12">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-modern rounded-2xl flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">GS</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-accent rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Gestion Salaires
              </h1>
              <p className="text-sm text-muted-foreground">Version Pro 2025</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {user?.role === 'SUPER_ADMIN' ? (
              <>
                <NavLink
                  to="/super-admin-dashboard"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Dashboard Super-Admin</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Vue d'ensemble globale</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/companies"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Entreprises</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Gestion des entreprises</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Utilisateurs</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Gestion des utilisateurs</div>
                      </div>
                    </>
                  )}
                </NavLink>
              </>
            ) : user?.role === 'CASHIER' ? (
              // Navigation limitée pour les caissiers - seulement paiements et bulletins
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Dashboard</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Vue d'ensemble</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/payments"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paiements</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Gestion des paiements</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/payslips"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Bulletins</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Fiches de paie</div>
                      </div>
                    </>
                  )}
                </NavLink>
              </>
            ) : (
              // Navigation complète pour ADMIN et autres rôles
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Dashboard</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Vue d'ensemble</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/employees"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Employés</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Gestion du personnel</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/payruns"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M9 11h6" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Cycles de Paie</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Gestion des cycles</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/payments"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Paiements</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Gestion des paiements</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/payslips"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Bulletins</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Fiches de paie</div>
                      </div>
                    </>
                  )}
                </NavLink>

                <NavLink
                  to="/documents"
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-4 rounded-2xl text-sm font-medium transition-modern ${
                      isActive
                        ? 'bg-gradient-modern text-white shadow-glow'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                        isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                      }`}>
                        <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Documents</div>
                        <div className={`text-xs ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>Gestion documentaire</div>
                      </div>
                    </>
                  )}
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Modern Header */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Tableau de bord</h2>
                  <p className="text-sm text-muted-foreground">Bienvenue dans votre espace de gestion</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* User Profile */}
                <div className="flex items-center space-x-4 bg-muted/30 rounded-2xl px-4 py-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-modern rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold text-sm">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground text-sm">{user?.fullName}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</div>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  className="hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-modern rounded-xl px-6"
                  onClick={handleLogout}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )

}