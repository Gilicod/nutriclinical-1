import React, { useState } from 'react';
import { Patient, Anthropometry } from '../../types';
import { Line } from 'react-chartjs-2';
import { Plus } from 'lucide-react';

interface Props {
  patient: Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  readOnly: boolean;
}

export default function AnthroTab({ patient, updatePatient, readOnly }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [newMeasure, setNewMeasure] = useState<Partial<Anthropometry>>({
      date: new Date().toISOString().split('T')[0],
      weight: 0, height: 0, imc: 0,
      circumference: { waist: 0, hip: 0, abdomen: 0, chest: 0, armR: 0, armL: 0, thigh: 0, calf: 0 },
      folds: { tricipital: 0, bicipital: 0, subscapular: 0, suprailiac: 0, abdominal: 0, quadriceps: 0 },
      notes: ''
  });

  // Calculate IMC Helper
  const calculateIMC = (w: number, h: number) => {
    if(h === 0) return 0;
    const hM = h / 100;
    return parseFloat((w / (hM * hM)).toFixed(1));
  }

  const handleInputChange = (field: string, val: string, nested?: string, nestedKey?: string) => {
      const numVal = parseFloat(val) || 0;
      if (nested && nestedKey) {
          setNewMeasure(prev => ({
              ...prev,
              [nested]: { ...prev[nested as keyof Anthropometry] as any, [nestedKey]: numVal }
          }));
      } else {
          const updated = { ...newMeasure, [field]: field === 'notes' || field === 'date' ? val : numVal };
          if(field === 'weight' || field === 'height') {
             updated.imc = calculateIMC(updated.weight as number, updated.height as number);
          }
          setNewMeasure(updated);
      }
  };

  const handleSave = () => {
      const entry: Anthropometry = {
          ...newMeasure as Anthropometry,
          id: Date.now().toString()
      };
      updatePatient(patient.id, { anthropometry: [entry, ...patient.anthropometry] });
      setShowModal(false);
  };

  // Chart Data Preparation
  const sortedRecords = [...patient.anthropometry].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const imcData = {
      labels: sortedRecords.map(r => r.date),
      datasets: [
          {
              label: 'IMC',
              data: sortedRecords.map(r => r.imc),
              borderColor: '#3b82f6',
              yAxisID: 'y',
          },
          {
            label: 'Peso (kg)',
            data: sortedRecords.map(r => r.weight),
            borderColor: '#10b981',
            yAxisID: 'y1',
            borderDash: [5, 5],
        }
      ]
  };

  const measureData = {
    labels: sortedRecords.map(r => r.date),
    datasets: [
        { label: 'Cintura', data: sortedRecords.map(r => r.circumference.waist), borderColor: '#8b5cf6' },
        { label: 'Cadera', data: sortedRecords.map(r => r.circumference.hip), borderColor: '#f43f5e' }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: { legend: { position: 'bottom' as const } },
    scales: {
        y: { type: 'linear' as const, display: true, position: 'left' as const, grid: { color: '#1e293b' } },
        y1: { type: 'linear' as const, display: true, position: 'right' as const, grid: { drawOnChartArea: false } },
        x: { grid: { display: false } }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IMC Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Evolución Peso vs IMC</h3>
            <div className="h-64"><Line data={imcData} options={chartOptions} /></div>
        </div>
        
        {/* Reference Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Referencia IMC (OMS)</h3>
            <table className="w-full text-xs text-slate-300">
                <thead><tr className="border-b border-slate-700"><th className="text-left py-2">Categoría</th><th className="text-right">Rango</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                    <tr><td className="py-2 text-blue-400">Bajo Peso</td><td className="text-right text-blue-400">&lt; 18.5</td></tr>
                    <tr><td className="py-2 text-green-400">Normal</td><td className="text-right text-green-400">18.5 - 24.9</td></tr>
                    <tr><td className="py-2 text-yellow-400">Sobrepeso</td><td className="text-right text-yellow-400">25.0 - 29.9</td></tr>
                    <tr><td className="py-2 text-orange-400">Obesidad I</td><td className="text-right text-orange-400">30.0 - 34.9</td></tr>
                    <tr><td className="py-2 text-red-400">Obesidad II</td><td className="text-right text-red-400">35.0 - 39.9</td></tr>
                </tbody>
            </table>
        </div>

        {/* Measures Chart */}
        <div className="col-span-1 lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white mb-4">Evolución de Medidas (cm)</h3>
            <div className="h-64"><Line data={measureData} options={{...chartOptions, scales: { y: { grid: { color: '#1e293b' } }, x: { grid: { display: false } } }}} /></div>
        </div>
      </div>

      {/* Table & Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-white font-bold">Registro de Medidas</h3>
            {!readOnly && (
                <button onClick={() => setShowModal(true)} className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded text-sm border border-slate-700">
                    NUEVA MEDIDA
                </button>
            )}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
                <thead className="bg-slate-800 text-xs uppercase">
                    <tr>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Peso</th>
                        <th className="px-4 py-3">IMC</th>
                        <th className="px-4 py-3">Cintura</th>
                        <th className="px-4 py-3">Cadera</th>
                        <th className="px-4 py-3">Brazo</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {patient.anthropometry.map(r => (
                        <tr key={r.id}>
                            <td className="px-4 py-3">{r.date}</td>
                            <td className="px-4 py-3">{r.weight} kg</td>
                            <td className="px-4 py-3 font-bold">{r.imc}</td>
                            <td className="px-4 py-3">{r.circumference.waist}</td>
                            <td className="px-4 py-3">{r.circumference.hip}</td>
                            <td className="px-4 py-3">{r.circumference.armR}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Nueva Visita - Antropometría</h3>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  
                  <div className="space-y-6">
                      {/* Basics */}
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                          <h4 className="text-sm font-bold text-blue-400 mb-3 uppercase">Básicos</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <Input label="Fecha" type="date" value={newMeasure.date} onChange={v => handleInputChange('date', v)} />
                              <Input label="Peso (kg)" type="number" value={newMeasure.weight} onChange={v => handleInputChange('weight', v)} />
                              <Input label="Altura (cm)" type="number" value={newMeasure.height} onChange={v => handleInputChange('height', v)} />
                              <Input label="IMC" type="number" value={newMeasure.imc} readOnly />
                          </div>
                      </div>

                      {/* Circumferences */}
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                          <h4 className="text-sm font-bold text-purple-400 mb-3 uppercase">Circunferencias (cm)</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <Input label="Cintura" value={newMeasure.circumference?.waist} onChange={v => handleInputChange('circumference', v, 'circumference', 'waist')} />
                              <Input label="Cadera" value={newMeasure.circumference?.hip} onChange={v => handleInputChange('circumference', v, 'circumference', 'hip')} />
                              <Input label="Abdomen" value={newMeasure.circumference?.abdomen} onChange={v => handleInputChange('circumference', v, 'circumference', 'abdomen')} />
                              <Input label="Pecho" value={newMeasure.circumference?.chest} onChange={v => handleInputChange('circumference', v, 'circumference', 'chest')} />
                              <Input label="Brazo Der" value={newMeasure.circumference?.armR} onChange={v => handleInputChange('circumference', v, 'circumference', 'armR')} />
                              <Input label="Muslo" value={newMeasure.circumference?.thigh} onChange={v => handleInputChange('circumference', v, 'circumference', 'thigh')} />
                          </div>
                      </div>

                      {/* Folds */}
                      <div className="bg-slate-800/50 p-4 rounded-lg">
                          <h4 className="text-sm font-bold text-orange-400 mb-3 uppercase">Pliegues (mm)</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              <Input label="Tricipital" value={newMeasure.folds?.tricipital} onChange={v => handleInputChange('folds', v, 'folds', 'tricipital')} />
                              <Input label="Subescapular" value={newMeasure.folds?.subscapular} onChange={v => handleInputChange('folds', v, 'folds', 'subscapular')} />
                              <Input label="Abdominal" value={newMeasure.folds?.abdominal} onChange={v => handleInputChange('folds', v, 'folds', 'abdominal')} />
                          </div>
                      </div>

                      <button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
                          Guardar Medida
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

const Input = ({ label, value, onChange, type = "number", readOnly = false }: any) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={e => onChange && onChange(e.target.value)}
            readOnly={readOnly}
            className={`w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none ${readOnly ? 'opacity-50' : ''}`}
        />
    </div>
);
