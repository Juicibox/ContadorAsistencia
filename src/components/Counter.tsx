import React, { useState, useEffect } from 'react';
import { Plus, Minus, MapPin, Palette, History, ChevronDown, Building2, Hash, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Place, Area, AttendanceRecord, FilterState, Municipality } from '../types';
import { supabase } from '../lib/supabase';

const PLACES: Place[] = ['Abierto', 'Cerrado'];
const AREAS: Area[] = ['Danza', 'Música', 'Teatro', 'Artes Visuales', 'Literatura', 'Cinematografia'];
const MUNICIPALITIES: Municipality[] = [
  'Tunja', 'Duitama'.'Sogamoso', 'Paipa'
];
const SUB_PLACES_ABIERTO = ['Plaza de Bolivar', 'Parque principal'];
const SUB_PLACES_CERRADO = ['Teatro Bicentenario', 'Auditorio Boyaquira', 'Casa Teb'];

export default function Counter() {
  const [filters, setFilters] = useState<FilterState>({
    place: 'Abierto',
    subPlace: SUB_PLACES_ABIERTO[0],
    area: 'Danza',
    municipality: 'San Salvador'
  });
  
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [inputMode, setInputMode] = useState<'button' | 'manual'>('button');
  const [manualCount, setManualCount] = useState<string>('');

  // Load records from Supabase
  useEffect(() => {
    loadRecords();
  }, []);

  // Calculate total count when records change
  useEffect(() => {
    setTotalCount(records.reduce((acc: number, curr: AttendanceRecord) => acc + curr.count, 0));
  }, [records]);

  // Load records from Supabase
  const loadRecords = async () => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Failed to load records from Supabase", error);
      return;
    }

    if (data) {
      // Convert Supabase data to AttendanceRecord format
      const formattedRecords: AttendanceRecord[] = data.map((record: any) => ({
        id: record.id,
        timestamp: record.timestamp,
        place: record.place,
        subPlace: record.sub_place,
        area: record.area,
        municipality: record.municipality,
        count: record.count
      }));
      setRecords(formattedRecords);
    }
  };

  const handleAdd = async (count: number = 1) => {
    if (count <= 0) return;

    // Insert record into Supabase
    const { data, error } = await supabase
      .from('attendance_records')
      .insert({
        timestamp: Date.now(),
        place: filters.place,
        sub_place: filters.subPlace,
        area: filters.area,
        municipality: filters.municipality,
        count: count
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save record to Supabase", error);
      return;
    }

    if (data) {
      const newRecord: AttendanceRecord = {
        id: data.id,
        timestamp: data.timestamp,
        place: data.place,
        subPlace: data.sub_place,
        area: data.area,
        municipality: data.municipality,
        count: data.count
      };
      setRecords([newRecord, ...records]);
      if (inputMode === 'manual') setManualCount('');
    }
  };

  const handleRemoveLast = async () => {
    if (records.length === 0) return;

    const lastRecord = records[0];
    const { error } = await supabase
      .from('attendance_records')
      .delete()
      .eq('id', lastRecord.id);

    if (error) {
      console.error("Failed to delete record from Supabase", error);
      return;
    }

    setRecords(records.slice(1));
  };

  const currentSubPlaces = filters.place === 'Abierto' ? SUB_PLACES_ABIERTO : SUB_PLACES_CERRADO;

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Asistencia FICC 2026</h1>
        <p className="text-zinc-500 text-sm">Registro de asistencia en tiempo real</p>
      </header>

      {/* Stats */}
      <div className="glass-card p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900/10" />
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Total Acumulado</span>
        <motion.div 
          key={totalCount}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl font-bold tabular-nums text-zinc-900 my-2"
        >
          {totalCount}
        </motion.div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1"><MapPin size={10} /> {filters.place}{filters.subPlace ? ` (${filters.subPlace})` : ''}</span>
          <span className="flex items-center gap-1"><Palette size={10} /> {filters.area}</span>
          <span className="flex items-center gap-1"><Building2 size={10} /> {filters.municipality}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Lugar</label>
          <div className="grid grid-cols-2 gap-2">
            {PLACES.map(p => (
              <button
                key={p}
                onClick={() => setFilters(f => ({ 
                  ...f, 
                  place: p,
                  subPlace: p === 'Abierto' ? SUB_PLACES_ABIERTO[0] : SUB_PLACES_CERRADO[0]
                }))}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  filters.place === p 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/10' 
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={filters.place}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-2"
          >
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Ubicación Específica</label>
            <div className="relative">
              <select
                value={filters.subPlace}
                onChange={(e) => setFilters(f => ({ ...f, subPlace: e.target.value }))}
                className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 appearance-none cursor-pointer hover:border-zinc-300 transition-all font-medium"
              >
                {currentSubPlaces.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Municipio</label>
            <div className="relative">
              <select
                value={filters.municipality}
                onChange={(e) => setFilters(f => ({ ...f, municipality: e.target.value }))}
                className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 appearance-none cursor-pointer hover:border-zinc-300 transition-all font-medium"
              >
                {MUNICIPALITIES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1">Área</label>
            <div className="relative">
              <select
                value={filters.area}
                onChange={(e) => setFilters(f => ({ ...f, area: e.target.value as Area }))}
                className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl focus:ring-emerald-500 focus:border-emerald-500 block p-3 appearance-none cursor-pointer hover:border-zinc-300 transition-all font-medium"
              >
                {AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Mode Switch */}
      <div className="flex p-1 bg-zinc-100 rounded-2xl">
        <button
          onClick={() => setInputMode('button')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            inputMode === 'button' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'
          }`}
        >
          <MousePointer2 size={14} /> Botón
        </button>
        <button
          onClick={() => setInputMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            inputMode === 'manual' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'
          }`}
        >
          <Hash size={14} /> Manual
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 pt-2">
        <AnimatePresence mode="wait">
          {inputMode === 'button' ? (
            <motion.button
              key="btn-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdd(1)}
              className="flex-1 bg-emerald-600 text-white h-24 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-colors"
            >
              <Plus size={32} />
              <span className="font-bold text-lg uppercase tracking-wide">Contar</span>
            </motion.button>
          ) : (
            <motion.div
              key="manual-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex gap-2 h-24"
            >
              <input
                type="number"
                inputMode="numeric"
                value={manualCount}
                onChange={(e) => setManualCount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-white border-2 border-zinc-200 rounded-3xl px-6 text-3xl font-bold text-center focus:border-emerald-600 outline-none transition-all"
              />
              <button
                onClick={() => handleAdd(parseInt(manualCount) || 0)}
                disabled={!manualCount || parseInt(manualCount) <= 0}
                className="bg-emerald-600 text-white px-8 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 disabled:opacity-50 transition-all font-bold uppercase tracking-widest text-sm"
              >
                Enviar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {inputMode === 'button' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemoveLast}
              disabled={records.length === 0}
              className="w-24 h-24 rounded-3xl border-2 border-zinc-200 flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-red-500 hover:border-red-200 disabled:opacity-50 disabled:hover:text-zinc-400 disabled:hover:border-zinc-200 transition-all"
              title="Borrar último"
            >
              <Minus size={24} />
              <span className="text-[10px] font-bold uppercase">Error</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Recent History */}
      <div className="pt-6 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-800">
            <History size={16} /> Historial Reciente
          </h2>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {records.length === 0 ? (
              <p className="text-center py-8 text-zinc-400 text-sm italic">No hay registros aún</p>
            ) : (
              records.slice(0, 10).map((record) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-zinc-100 p-3 rounded-xl flex items-center justify-between shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-800">{record.area}</span>
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <MapPin size={8} /> {record.municipality} • {record.place}{record.subPlace ? ` (${record.subPlace})` : ''} • {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-zinc-50 px-3 py-1 rounded-lg font-mono font-bold text-zinc-600">
                    +{record.count}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          {records.length > 10 && (
            <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest pt-2">
              Mostrando los últimos 10 de {records.length}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
