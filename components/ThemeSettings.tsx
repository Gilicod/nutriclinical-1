import React from 'react';
import { useNutri } from '../context';
import { Palette, Type, Layout, RefreshCcw } from 'lucide-react';
import { ThemeConfig } from '../types';

const DEFAULT_THEME: ThemeConfig = {
    appBg: '#020617', 
    cardBg: '#0f172a', 
    textColor: '#f1f5f9', 
    primaryColor: '#2563eb', 
    fontFamily: "'Inter', sans-serif"
};

export default function ThemeSettings() {
  const { theme, updateTheme } = useNutri();

  const handleChange = (key: keyof ThemeConfig, value: string) => {
      updateTheme({ ...theme, [key]: value });
  };

  const resetTheme = () => {
      updateTheme(DEFAULT_THEME);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Diseño y Personalización</h2>
            <p className="text-slate-400">Personaliza la apariencia de la plataforma.</p>
        </div>
        <button 
            onClick={resetTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
        >
            <RefreshCcw size={16} /> Restaurar Predeterminado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colors */}
          <div className="bg-[var(--card-bg)] border border-slate-800 rounded-xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                  <Palette size={20} className="text-[var(--primary)]" /> Colores del Sistema
              </h3>
              
              <div className="space-y-4">
                  <ColorInput 
                    label="Fondo Principal" 
                    desc="El color de fondo de toda la aplicación."
                    value={theme.appBg} 
                    onChange={v => handleChange('appBg', v)} 
                  />
                  <ColorInput 
                    label="Fondo de Tarjetas" 
                    desc="Color de los paneles, modales y barras laterales."
                    value={theme.cardBg} 
                    onChange={v => handleChange('cardBg', v)} 
                  />
                  <ColorInput 
                    label="Color Primario" 
                    desc="Botones principales, enlaces y acentos."
                    value={theme.primaryColor} 
                    onChange={v => handleChange('primaryColor', v)} 
                  />
                  <ColorInput 
                    label="Color de Texto" 
                    desc="Color principal de la tipografía."
                    value={theme.textColor} 
                    onChange={v => handleChange('textColor', v)} 
                  />
              </div>
          </div>

          {/* Typography */}
          <div className="bg-[var(--card-bg)] border border-slate-800 rounded-xl p-6 space-y-6 h-fit">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4 pb-2 border-b border-slate-700">
                  <Type size={20} className="text-[var(--primary)]" /> Tipografía
              </h3>
              
              <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Fuente Principal</label>
                  <select 
                    value={theme.fontFamily}
                    onChange={e => handleChange('fontFamily', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-[var(--primary)]"
                  >
                      <option value="'Inter', sans-serif">Inter (Moderno, Default)</option>
                      <option value="'Merriweather', serif">Merriweather (Elegante, Serif)</option>
                      <option value="'Roboto Mono', monospace">Roboto Mono (Técnico)</option>
                      <option value="system-ui, sans-serif">Sistema (Nativo del OS)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-2">
                      La fuente seleccionada se aplicará a todos los textos de la aplicación.
                  </p>
              </div>

              <div className="mt-8 p-4 rounded-lg bg-[var(--app-bg)] border border-slate-700">
                  <h4 className="font-bold text-[var(--primary)] mb-2">Vista Previa</h4>
                  <p className="text-[var(--text-main)] mb-4">
                      Así es como se visualiza el texto con la configuración actual. Los colores y la fuente reaccionan en tiempo real.
                  </p>
                  <button className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg font-medium shadow-lg">
                      Botón de Ejemplo
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}

const ColorInput = ({ label, desc, value, onChange }: { label: string, desc: string, value: string, onChange: (v: string) => void }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
        <div>
            <p className="text-sm font-bold text-white">{label}</p>
            <p className="text-xs text-slate-400">{desc}</p>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-500 uppercase">{value}</span>
            <input 
                type="color" 
                value={value} 
                onChange={e => onChange(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0 bg-transparent" 
            />
        </div>
    </div>
);