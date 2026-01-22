import React, { useState } from 'react';
import { Patient, Lifestyle } from '../../types';
import { Edit2, Coffee, Moon, Activity, DollarSign } from 'lucide-react';

interface Props {
  patient: Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  readOnly: boolean;
}

const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
    <div className="flex items-center gap-2 mb-4 text-blue-400">
      <Icon size={20} />
      <h3 className="font-bold uppercase tracking-wider text-sm">{title}</h3>
    </div>
    {children}
  </div>
);

export default function LifestyleTab({ patient, updatePatient, readOnly }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<Lifestyle>(patient.lifestyle);

  const handleSave = () => {
    updatePatient(patient.id, { lifestyle: data });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Estilo de Vida y Hábitos</h3>
        {!readOnly && (
            isEditing ? (
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-400">Cancelar</button>
                    <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Guardar</button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Edit2 size={16} /> Editar
                </button>
            )
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity */}
        <Section title="Actividad Física" icon={Activity}>
            <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <input 
                        type="checkbox" 
                        checked={data.activity.regular} 
                        disabled={!isEditing}
                        onChange={e => setData({...data, activity: {...data.activity, regular: e.target.checked}})}
                        className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-200">Realiza Actividad Física regularmente</span>
                </label>
                <div>
                    <p className="text-xs uppercase text-slate-500 font-bold mb-1">Detalles</p>
                    {isEditing ? (
                        <textarea 
                            value={data.activity.details}
                            onChange={e => setData({...data, activity: {...data.activity, details: e.target.value}})}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm"
                        />
                    ) : (
                        <p className="p-3 bg-slate-800 rounded-lg text-slate-300 text-sm">{data.activity.details || 'Sin detalles'}</p>
                    )}
                </div>
            </div>
        </Section>

        {/* Sleep & Stress */}
        <Section title="Sueño, Estrés y Sustancias" icon={Moon}>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-slate-500 font-bold">Horas Sueño</label>
                    <input disabled={!isEditing} value={data.sleep.hours} onChange={e => setData({...data, sleep: {...data.sleep, hours: e.target.value}})} className="w-full bg-slate-800 border-none rounded text-white text-sm mt-1 p-2" />
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-bold">Nivel Estrés</label>
                    <input disabled={!isEditing} value={data.sleep.stress} onChange={e => setData({...data, sleep: {...data.sleep, stress: e.target.value}})} className="w-full bg-slate-800 border-none rounded text-white text-sm mt-1 p-2" />
                </div>
                <div className="col-span-2">
                    <label className="text-xs text-slate-500 font-bold">Horarios Comida</label>
                    <input disabled={!isEditing} value={data.diet.meals} onChange={e => setData({...data, diet: {...data.diet, meals: e.target.value}})} className="w-full bg-slate-800 border-none rounded text-white text-sm mt-1 p-2" />
                </div>
                <div className="col-span-2 flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" disabled={!isEditing} checked={data.diet.alcohol} onChange={e => setData({...data, diet: {...data.diet, alcohol: e.target.checked}})} />
                        <span className="text-sm text-slate-300">Alcohol</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" disabled={!isEditing} checked={data.diet.tobacco} onChange={e => setData({...data, diet: {...data.diet, tobacco: e.target.checked}})} />
                        <span className="text-sm text-slate-300">Tabaco</span>
                    </label>
                </div>
            </div>
        </Section>

        {/* Preferences */}
        <Section title="Preferencias y Economía" icon={DollarSign}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-slate-500 font-bold">Preferencias</label>
                        <input disabled={!isEditing} value={data.preferences.likes} onChange={e => setData({...data, preferences: {...data.preferences, likes: e.target.value}})} className="w-full bg-slate-800 border-none rounded text-white text-sm mt-1 p-2" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 font-bold">Aversiones</label>
                        <input disabled={!isEditing} value={data.preferences.dislikes} onChange={e => setData({...data, preferences: {...data.preferences, dislikes: e.target.value}})} className="w-full bg-slate-800 border-none rounded text-white text-sm mt-1 p-2" />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-slate-500 font-bold">Presupuesto</label>
                    <select disabled={!isEditing} value={data.preferences.budget} onChange={e => setData({...data, preferences: {...data.preferences, budget: e.target.value as any}})} className="w-full bg-slate-800 border-none rounded text-white text-sm mt-1 p-2">
                        <option>Bajo</option>
                        <option>Medio</option>
                        <option>Alto</option>
                    </select>
                </div>
            </div>
        </Section>
      </div>
    </div>
  );
}