import React, { useMemo, useState } from 'react';
import { useNutri } from '../context';
import { Users, Calendar, AlertTriangle, Activity, ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

const KPICard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-[var(--card-bg)] border border-slate-800 p-6 rounded-xl flex items-center justify-between">
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Agenda Logic
  const agendaPatients = useMemo(() => {
      return patients.filter(p => {
          // Check if any note has nextAppointment matching selectedDate
          // Or find the latest note and check if that one has the appointment
          // For safety, let's look at all notes to find any appointment scheduled for this date.
          return p.notes.some(n => n.nextAppointment === selectedDate);
      }).map(p => {
          // Extract specific note info for display?
          const note = p.notes.find(n => n.nextAppointment === selectedDate);
          return { ...p, appointmentNote: note };
      });
  }, [patients, selectedDate]);

  const changeDate = (days: number) => {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + days);
      setSelectedDate(d.toISOString().split('T')[0]);
  };

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

  const displayDate = new Date(selectedDate + 'T12:00:00');

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
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[var(--card-bg)] border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Actividad de Consultas</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Agenda / Calendar Section */}
        <div className="bg-[var(--card-bg)] border border-slate-800 rounded-xl flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 rounded-t-xl">
                 <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                     <Calendar size={18} /> Agenda de Citas
                 </h3>
                 <div className="flex items-center justify-between bg-slate-800 p-2 rounded-lg">
                     <button onClick={() => changeDate(-1)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
                     <div className="text-center">
                         <span className="block text-white font-bold capitalize">{displayDate.toLocaleDateString('es-ES', { weekday: 'long' })}</span>
                         <span className="block text-xs text-slate-400">{displayDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                     </div>
                     <button onClick={() => changeDate(1)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"><ChevronRight size={20} /></button>
                 </div>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-3 custom-scrollbar">
                {agendaPatients.length > 0 ? (
                    agendaPatients.map(patient => (
                        <div key={patient.id} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-800 rounded-lg hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
                                    {patient.avatarUrl ? <img src={patient.avatarUrl} alt="" className="w-full h-full object-cover rounded-full" /> : patient.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{patient.name}</p>
                                    <p className="text-xs text-blue-400 flex items-center gap-1">
                                        <Clock size={10} /> Cita Programada
                                    </p>
                                </div>
                            </div>
                            <Link to={`/patients/${patient.id}`} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-500">
                        <Calendar size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No hay citas para este día.</p>
                    </div>
                )}
            </div>
            <div className="p-3 border-t border-slate-800 text-center">
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={e => setSelectedDate(e.target.value)}
                    className="bg-transparent text-xs text-slate-500 uppercase font-bold cursor-pointer outline-none hover:text-blue-400"
                />
            </div>
        </div>

        {/* Recent Activity (Below Chart on Mobile, Side on Desktop if space permits or moved down) */}
        <div className="lg:col-span-3 bg-[var(--card-bg)] border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Pacientes Recientes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.slice(0, 3).map(patient => (
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