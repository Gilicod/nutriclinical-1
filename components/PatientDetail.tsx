import React, { useState, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useNutri } from '../context';
import { Edit2, Send, Phone, Mail, Calendar, X, Upload, Camera } from 'lucide-react';
import clsx from 'clsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Import Tabs
import NotesTab from './tabs/NotesTab';
import LifestyleTab from './tabs/LifestyleTab';
import AnthroTab from './tabs/AnthroTab';
import ClinicalTab from './tabs/ClinicalTab';
import PlansTab from './tabs/PlansTab';
import LabsTab from './tabs/LabsTab';

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { patients, updatePatient, currentUser } = useNutri();
  const [activeTab, setActiveTab] = useState('notes');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
      name: '',
      email: '',
      phone: '',
      dob: '',
      avatarUrl: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const patient = patients.find(p => p.id === id);

  if (!patient) return <Navigate to="/dashboard" />;

  const isPatientView = currentUser?.role === 'patient';
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();

  const handleSendReminder = () => {
    // Simulation
    alert('Recordatorio enviado por Email y SMS.');
    setShowReminderModal(false);
  };

  const openEditProfile = () => {
      setEditForm({
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          dob: patient.dob,
          avatarUrl: patient.avatarUrl || ''
      });
      setShowEditProfileModal(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file) {
          const url = URL.createObjectURL(file);
          setEditForm(prev => ({ ...prev, avatarUrl: url }));
      }
  };

  const saveProfile = () => {
      updatePatient(patient.id, {
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          dob: editForm.dob,
          avatarUrl: editForm.avatarUrl
      });
      setShowEditProfileModal(false);
  };

  const tabs = [
    { id: 'notes', label: 'Notas Evolución' },
    { id: 'lifestyle', label: 'Estilo de Vida' },
    { id: 'anthro', label: 'Antropometría' },
    { id: 'clinical', label: 'Historia Clínica' },
    { id: 'plans', label: 'Planes (Grid)' },
    { id: 'labs', label: 'Analíticas' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-900 text-2xl font-bold border-2 border-slate-700">
            {patient.avatarUrl ? <img src={patient.avatarUrl} alt="" className="w-full h-full object-cover"/> : patient.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm mt-1">
              <span className="flex items-center gap-1"><Calendar size={14} /> {age} años</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {patient.phone}</span>
              <span className="flex items-center gap-1"><Mail size={14} /> {patient.email}</span>
            </div>
          </div>
        </div>

        {!isPatientView && (
          <div className="flex items-center gap-3">
            <button 
                onClick={openEditProfile}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Edit2 size={16} /> Editar Perfil
            </button>
            <button onClick={() => setShowReminderModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20">
              <Send size={16} /> Enviar Recordatorio
            </button>
          </div>
        )}
      </div>

      {/* Tabs Nav */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-thin">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeTab === tab.id 
                ? "bg-slate-800 text-blue-400 border border-slate-700 shadow-sm" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'notes' && <NotesTab patient={patient} updatePatient={updatePatient} readOnly={isPatientView} />}
        {activeTab === 'lifestyle' && <LifestyleTab patient={patient} updatePatient={updatePatient} readOnly={isPatientView} />}
        {activeTab === 'anthro' && <AnthroTab patient={patient} updatePatient={updatePatient} readOnly={isPatientView} />}
        {activeTab === 'clinical' && <ClinicalTab patient={patient} updatePatient={updatePatient} readOnly={isPatientView} />}
        {activeTab === 'plans' && <PlansTab patient={patient} updatePatient={updatePatient} readOnly={false} />} 
        {/* PlansTab handles internal readonly logic for editing plan vs checking adherence */}
        {activeTab === 'labs' && <LabsTab patient={patient} updatePatient={updatePatient} readOnly={isPatientView} />}
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Enviar Recordatorio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Medio</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white">
                  <option>Email</option>
                  <option>SMS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Mensaje</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white h-24"
                  defaultValue={`Hola ${patient.name}, recuerda tu consulta mañana a las 10:00 AM.`}
                ></textarea>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button onClick={() => setShowReminderModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancelar</button>
                <button onClick={handleSendReminder} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Enviar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-[#0070b8] p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg">Editar Perfil de Paciente</h3>
                    <button onClick={() => setShowEditProfileModal(false)} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-5">
                    {/* Avatar Upload */}
                    <div className="flex justify-center mb-4">
                        <div className="relative group">
                             <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-blue-500 transition-colors bg-slate-800 flex items-center justify-center">
                                 {editForm.avatarUrl ? (
                                     <img src={editForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                 ) : (
                                     <span className="text-2xl font-bold text-slate-500">{editForm.name.charAt(0)}</span>
                                 )}
                             </div>
                             <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                             >
                                 <Camera size={14} />
                             </button>
                             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                        <input 
                            type="text" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})} 
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teléfono</label>
                            <input 
                                type="text" 
                                value={editForm.phone} 
                                onChange={e => setEditForm({...editForm, phone: e.target.value})} 
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" 
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha Nacimiento (Edad)</label>
                             <input 
                                type="date" 
                                value={editForm.dob} 
                                onChange={e => setEditForm({...editForm, dob: e.target.value})} 
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
                        <input 
                            type="email" 
                            value={editForm.email} 
                            onChange={e => setEditForm({...editForm, email: e.target.value})} 
                            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none" 
                        />
                    </div>

                    <div className="pt-2">
                        <button onClick={saveProfile} className="w-full bg-[#0085db] hover:bg-[#0070b8] text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20">
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
