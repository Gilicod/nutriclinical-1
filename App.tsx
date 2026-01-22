import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { NutriProvider, useNutri } from './context';
import { LayoutDashboard, Users, Calculator as CalcIcon, LogOut, Menu, UserCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import PatientsList from './components/PatientsList';
import PatientDetail from './components/PatientDetail';
import Calculator from './components/Calculator';
import Login from './components/Login';

const Sidebar = () => {
  const { currentUser, logout } = useNutri();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white';

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-blue-600 px-2 py-1 rounded text-sm">N</span> NutriClinical
        </h1>
        <p className="text-xs text-blue-400 mt-1 uppercase tracking-wider font-semibold ml-8">Pro System</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {currentUser?.role === 'admin' && (
          <>
            <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/dashboard')}`}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link to="/patients" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/patients')}`}>
              <Users size={20} />
              <span>Pacientes</span>
            </Link>
          </>
        )}
        
        {currentUser?.role === 'patient' && (
          <Link to={`/patients/${currentUser.patientId}`} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(`/patients/${currentUser.patientId}`)}`}>
            <UserCircle size={20} />
            <span>Mi Perfil</span>
          </Link>
        )}

        <Link to="/calculator" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/calculator')}`}>
          <CalcIcon size={20} />
          <span>Calculadora</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{currentUser?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{currentUser?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors text-sm">
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser } = useNutri();
  return currentUser ? <>{children}</> : <Navigate to="/" />;
};

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pl-64">
      <Sidebar />
      <main className="p-8">
        {children}
      </main>
    </div>
  );
};

const AppContent = () => {
  const { currentUser } = useNutri();

  return (
    <Routes>
      <Route path="/" element={!currentUser ? <Login /> : <Navigate to={currentUser.role === 'admin' ? "/dashboard" : `/patients/${currentUser.patientId}`} />} />
      <Route path="/dashboard" element={<PrivateRoute><MainLayout><Dashboard /></MainLayout></PrivateRoute>} />
      <Route path="/patients" element={<PrivateRoute><MainLayout><PatientsList /></MainLayout></PrivateRoute>} />
      <Route path="/patients/:id" element={<PrivateRoute><MainLayout><PatientDetail /></MainLayout></PrivateRoute>} />
      <Route path="/calculator" element={<PrivateRoute><MainLayout><Calculator /></MainLayout></PrivateRoute>} />
    </Routes>
  );
};

export default function App() {
  return (
    <NutriProvider>
      <Router>
        <AppContent />
      </Router>
    </NutriProvider>
  );
}