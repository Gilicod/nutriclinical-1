import React, { useMemo } from 'react';
import { useNutri } from '../context';
import { Users, Calendar, AlertTriangle, Activity, ArrowRight } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

const KPICard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')} ${color}`}>
      <Icon size={24} />
    </div>
  </div>
);

export default function Dashboard() {
  const { patients } = useNutri();

  // Mock data calculations
  const totalPatients = patients.length;
  const activeAlerts = 2; // Demo hardcoded
  const monthlyConsults = 12;

  const chartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Consultas',
      data: [12, 19, 3, 5, 2, 8],
      backgroundColor: '#3b82f6',
      borderRadius: 4,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#1e293b' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Panel General</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="PACIENTES TOTALES" value={totalPatients} icon={Users} color="text-blue-500" />
        <KPICard title="CONSULTAS MES" value={monthlyConsults} icon={Calendar} color="text-green-500" />
        <KPICard title="ALERTAS" value={activeAlerts} icon={AlertTriangle} color="text-orange-500" />
        <KPICard title="INGRESOS (EST.)" value="$2.4k" icon={Activity} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Actividad de Consultas</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Seguimientos Pendientes</h3>
          <div className="space-y-4">
            {patients.map(patient => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{patient.name}</p>
                    <p className="text-xs text-slate-400">Última: {patient.notes.length > 0 ? patient.notes[0].date : 'N/A'}</p>
                  </div>
                </div>
                <Link to={`/patients/${patient.id}`} className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1">
                  Ver Ficha <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}