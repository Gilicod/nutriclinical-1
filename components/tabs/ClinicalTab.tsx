import React, { useState } from 'react';
import { Patient, ClinicalHistory } from '../../types';
import { Edit2 } from 'lucide-react';

interface Props {
  patient: Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  readOnly: boolean;
}

export default function ClinicalTab({ patient, updatePatient, readOnly }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<ClinicalHistory>(patient.clinical);

  const handleSave = () => {
    updatePatient(patient.id, { clinical: data });
    setIsEditing(false);
  };

  const foodGroups = [
      'Verduras', 'Frutas', 'Cereales', 'Tubérculos', 'Leguminosas', 
      'Carnes Rojas', 'Pollo / Pavo', 'Pescados', 'Huevo', 'Embutidos', 
      'Lácteos', 'Grasas', 'Azúcares'
  ];
  const frequencies = ['Diario', 'Semanal', 'Quincenal', 'Ocasional', 'Nunca'];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Historia Clínica Nutricional</h3>
            {!readOnly && (
                <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`${isEditing ? 'bg-green-600' : 'bg-slate-800'} text-white px-4 py-2 rounded-lg flex items-center gap-2`}>
                    <Edit2 size={16} /> {isEditing ? 'Guardar' : 'Editar'}
                </button>
            )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-blue-400 mb-3 uppercase">Antecedentes Clínicos</h4>
                    <div className="space-y-3">
                        <Field label="Motivo Consulta" value={data.background.motive} editing={isEditing} onChange={v => setData({...data, background: {...data.background, motive: v}})} />
                        <Field label="Medicamentos" value={data.background.medications} editing={isEditing} onChange={v => setData({...data, background: {...data.background, medications: v}})} />
                        <Field label="Heredofamiliares" value={data.background.familyHistory} editing={isEditing} onChange={v => setData({...data, background: {...data.background, familyHistory: v}})} />
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-blue-400 mb-3 uppercase">Recordatorio 24H (Básico)</h4>
                    <div className="space-y-3">
                        <Field label="Desayuno" value={data.recall24h.breakfast} editing={isEditing} onChange={v => setData({...data, recall24h: {...data.recall24h, breakfast: v}})} />
                        <Field label="Comida" value={data.recall24h.lunch} editing={isEditing} onChange={v => setData({...data, recall24h: {...data.recall24h, lunch: v}})} />
                        <Field label="Cena" value={data.recall24h.dinner} editing={isEditing} onChange={v => setData({...data, recall24h: {...data.recall24h, dinner: v}})} />
                    </div>
                </div>
            </div>
       </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
            <h4 className="text-sm font-bold text-blue-400 mb-3 uppercase">Frecuencia de Consumo</h4>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-slate-500 border-b border-slate-800">
                        <th className="text-left py-2">Grupo</th>
                        {frequencies.map(f => <th key={f} className="text-center py-2">{f}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {foodGroups.map(group => (
                        <tr key={group}>
                            <td className="py-2 text-slate-300 font-medium">{group}</td>
                            {frequencies.map(freq => (
                                <td key={freq} className="text-center py-2">
                                    <div 
                                        onClick={() => isEditing && setData({...data, frequencies: {...data.frequencies, [group]: freq}})}
                                        className={`w-4 h-4 rounded-full mx-auto border cursor-pointer ${data.frequencies[group] === freq ? 'bg-green-500 border-green-500' : 'border-slate-600'} ${!isEditing && 'cursor-default'}`}
                                    ></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
       </div>
    </div>
  );
}

const Field = ({ label, value, editing, onChange }: any) => (
    <div>
        <label className="text-xs text-slate-500 font-bold block mb-1">{label}</label>
        {editing ? (
            <input className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm" value={value} onChange={e => onChange(e.target.value)} />
        ) : (
            <p className="text-sm text-slate-200 border-b border-slate-800 pb-1">{value || '-'}</p>
        )}
    </div>
);
