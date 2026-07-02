import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Calendar, Clock, MapPin, Globe, Sparkles, PenLine,
  Eraser, RotateCcw, ChevronLeft, Save, Eye, ChevronRight, X, CheckCircle2,
} from 'lucide-react';
import SouthIndianChart from './SouthIndianChart';
import PlanetMultiSelect from './PlanetMultiSelect';
import HoroscopeDisplay from './HoroscopeDisplay';
import {
  createEmptyHoroscopeData,
  TIMEZONE_OPTIONS,
  RASI_OPTIONS,
  NAKSHATRA_OPTIONS,
  LAGNAM_OPTIONS,
  PADA_OPTIONS,
  DOSHAM_OPTIONS,
  CHEVVAI_OPTIONS,
  NADI_OPTIONS,
  YONI_OPTIONS,
  RAJJU_OPTIONS,
  GANA_OPTIONS,
  DASA_OPTIONS,
  UNIQUE_PLANETS,
  canAssignPlanet,
  findPlanetHouse,
  emptyChart,
} from '../../constants/horoscope';

const STEPS = ['Birth Details', 'Horoscope Charts', 'Astro Fields'];

const HoroscopeModule = ({
  value,
  onChange,
  onSyncFormFields,
  onNextStep,
  gothramOptions = [],
}) => {
  const data = value || createEmptyHoroscopeData();
  const [step, setStep] = useState(0);
  const [activeChart, setActiveChart] = useState('rasi');
  const [activeHouse, setActiveHouse] = useState(null);
  const [planetError, setPlanetError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const chartKey = activeChart === 'rasi' ? 'rasiChart' : 'navamsaChart';
  const currentChart = data[chartKey] || emptyChart();

  const update = useCallback((patch) => {
    onChange({ ...data, ...patch });
  }, [data, onChange]);

  const updateBirth = (field, val) => {
    const birthDetails = { ...data.birthDetails, [field]: val };
    update({ birthDetails });
    if (field === 'dateOfBirth') onSyncFormFields?.({ dateOfBirth: val });
    if (field === 'timeOfBirth') onSyncFormFields?.({ timeOfBirth: val });
    if (field === 'placeOfBirth') onSyncFormFields?.({ placeOfBirth: val });
  };

  const updateField = (field, val) => {
    const fields = { ...data.fields, [field]: val };
    update({ fields });
    const legacyMap = {
      rasi: 'rasi', nakshatra: 'nakshatra', lagnam: 'laknam',
      gothram: 'gothram', dosham: 'dhosham',
    };
    if (legacyMap[field]) onSyncFormFields?.({ [legacyMap[field]]: val });
  };

  const handleHouseClick = (houseNum) => {
    setActiveHouse(houseNum);
    setPlanetError('');
  };

  const handlePlanetsChange = (planets) => {
    if (activeHouse == null) return;
    for (const p of planets) {
      const check = canAssignPlanet(currentChart, p, activeHouse);
      if (!check.ok) {
        setPlanetError(check.message);
        return;
      }
    }
    const newChart = { ...currentChart, [String(activeHouse)]: planets };
    update({ [chartKey]: newChart });
    setPlanetError('');
  };

  const disabledPlanets = UNIQUE_PLANETS.filter((p) => {
    const existingHouse = findPlanetHouse(currentChart, p);
    return existingHouse != null && existingHouse !== activeHouse;
  });

  const clearActiveChart = () => {
    update({ [chartKey]: emptyChart() });
    setActiveHouse(null);
    setPlanetError('');
  };

  const resetAll = () => {
    if (!window.confirm('Reset all horoscope data? This cannot be undone.')) return;
    onChange(createEmptyHoroscopeData());
    setStep(0);
    setActiveHouse(null);
    setPlanetError('');
  };

  const handleSave = () => {
    const saved = {
      ...data,
      saved: true,
      savedAt: new Date().toISOString(),
    };
    onChange(saved);
    onSyncFormFields?.({
      dateOfBirth: saved.birthDetails.dateOfBirth,
      timeOfBirth: saved.birthDetails.timeOfBirth,
      placeOfBirth: saved.birthDetails.placeOfBirth,
      rasi: saved.fields.rasi,
      nakshatra: saved.fields.nakshatra,
      laknam: saved.fields.lagnam,
      gothram: saved.fields.gothram,
      dhosham: saved.fields.dosham,
      horoscopeAvailable: 'true',
    });
  };

  const selectedPlanets = activeHouse != null ? (currentChart[String(activeHouse)] || []) : [];

  const inputCls = 'w-full bg-white border border-[#E9D5FF] hover:border-[#9B7EBD] text-[#3B1E54] text-sm rounded-xl focus:ring-2 focus:ring-[#7F55B1]/25 focus:border-[#7F55B1]/60 p-3 transition-all';

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex flex-wrap gap-2 justify-center">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              step === i
                ? 'bg-gradient-to-r from-[#7F55B1] to-[#9B7EBD] text-white shadow-md'
                : 'bg-white text-[#9B7EBD] border border-[#E9D5FF] hover:border-[#9B7EBD]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === i ? 'bg-white/20' : 'bg-[#F3E8FF]'
            }`}>{i + 1}</span>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 0: Birth Details ── */}
        {step === 0 && (
          <motion.div
            key="birth"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-4 sm:p-6 rounded-2xl border border-[#E9D5FF] bg-gradient-to-br from-[#FFFBFA] to-[#FDF4FF]">
              <h4 className="text-sm font-bold text-[#7F55B1] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar size={16} /> Birth Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#3B1E54] mb-1.5 block">Date of Birth *</label>
                  <input type="date" value={data.birthDetails.dateOfBirth} onChange={(e) => updateBirth('dateOfBirth', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3B1E54] mb-1.5 block">Time of Birth *</label>
                  <input type="time" value={data.birthDetails.timeOfBirth} onChange={(e) => updateBirth('timeOfBirth', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3B1E54] mb-1.5 block">Place of Birth *</label>
                  <input type="text" value={data.birthDetails.placeOfBirth} onChange={(e) => updateBirth('placeOfBirth', e.target.value)} placeholder="City, State" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#3B1E54] mb-1.5 block">Time Zone</label>
                  <select value={data.birthDetails.timeZone} onChange={(e) => updateBirth('timeZone', e.target.value)} className={inputCls}>
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => { update({ entryMode: 'manual' }); setStep(1); }}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-dashed border-[#7F55B1]/40 bg-gradient-to-br from-[#FDF4FF] to-[#F3E8FF] hover:border-[#7F55B1] transition-all group"
              >
                <PenLine size={28} className="text-[#7F55B1] group-hover:scale-110 transition-transform" />
                <span className="font-bold text-[#3B1E54] text-sm">Manual Entry</span>
                <span className="text-[10px] text-gray-500 text-center">Draw your Rasi & Navamsa charts by hand</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 1: Charts ── */}
        {step === 1 && (
          <motion.div
            key="charts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {['rasi', 'navamsa'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setActiveChart(c); setActiveHouse(null); setPlanetError(''); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    activeChart === c
                      ? 'bg-[#7F55B1] text-white shadow-md'
                      : 'bg-white text-[#9B7EBD] border border-[#E9D5FF]'
                  }`}
                >
                  {c === 'rasi' ? 'Rasi Chart' : 'Navamsa Chart'}
                </button>
              ))}
            </div>

            <p className="text-xs text-center text-gray-500">
              Click a house to assign planets. Lagna, Rahu & Ketu can appear only once per chart.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <SouthIndianChart
                title={activeChart === 'rasi' ? 'Rasi Chart (D1)' : 'Navamsa Chart (D9)'}
                chart={currentChart}
                activeHouse={activeHouse}
                onHouseClick={handleHouseClick}
                centerLabel={activeChart === 'rasi' ? 'Rasi' : 'Navamsa'}
              />

              <div className="p-4 sm:p-5 rounded-2xl border border-[#E9D5FF] bg-white space-y-4">
                <h4 className="text-sm font-bold text-[#7F55B1] flex items-center gap-2">
                  <Sparkles size={16} />
                  {activeHouse ? `House ${activeHouse}` : 'Select a House'}
                </h4>
                {activeHouse != null ? (
                  <>
                    <PlanetMultiSelect
                      selected={selectedPlanets}
                      onChange={handlePlanetsChange}
                      disabledPlanets={disabledPlanets}
                      error={planetError}
                    />
                    <button
                      type="button"
                      onClick={() => handlePlanetsChange([])}
                      className="text-xs text-gray-400 hover:text-pink-500 flex items-center gap-1"
                    >
                      <Eraser size={12} /> Clear this house
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 italic py-4 text-center">Tap any house on the chart to begin</p>
                )}
              </div>
            </div>

            {/* Side-by-side preview of both charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#F3E8FF]">
              <SouthIndianChart title="Rasi Chart" chart={data.rasiChart} readOnly compact centerLabel="Rasi" />
              <SouthIndianChart title="Navamsa Chart" chart={data.navamsaChart} readOnly compact centerLabel="Navamsa" />
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Structured Fields ── */}
        {step === 2 && (
          <motion.div
            key="fields"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'rasi', label: 'Rasi', options: RASI_OPTIONS },
                { key: 'nakshatra', label: 'Nakshatra', options: NAKSHATRA_OPTIONS },
                { key: 'lagnam', label: 'Lagnam', options: LAGNAM_OPTIONS },
                { key: 'pada', label: 'Pada', options: PADA_OPTIONS },
                { key: 'gothram', label: 'Gothram', options: gothramOptions.length ? gothramOptions : ['Others'] },
                { key: 'dosham', label: 'Dosham', options: DOSHAM_OPTIONS },
                { key: 'chevvaiDosham', label: 'Chevvai Dosham', options: CHEVVAI_OPTIONS },
                { key: 'nadi', label: 'Nadi', options: NADI_OPTIONS },
                { key: 'yoni', label: 'Yoni', options: YONI_OPTIONS },
                { key: 'rajju', label: 'Rajju', options: RAJJU_OPTIONS },
                { key: 'gana', label: 'Gana', options: GANA_OPTIONS },
                { key: 'dasa', label: 'Dasa', options: DASA_OPTIONS },
                { key: 'mahadasa', label: 'Mahadasa', options: DASA_OPTIONS },
              ].map(({ key, label, options }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-[#3B1E54] mb-1.5 block">
                    {label} {(key === 'rasi' || key === 'nakshatra') && <span className="text-pink-500">*</span>}
                  </label>
                  <select
                    value={data.fields[key] || ''}
                    onChange={(e) => updateField(key, e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select {label}</option>
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {data.saved && (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-100 rounded-xl p-3">
                <CheckCircle2 size={14} />
                Horoscope saved {data.savedAt ? `on ${new Date(data.savedAt).toLocaleString()}` : ''}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t border-[#F3E8FF]">
        <button type="button" onClick={clearActiveChart} className="action-btn-secondary">
          <Eraser size={14} /> Clear Chart
        </button>
        <button type="button" onClick={resetAll} className="action-btn-secondary">
          <RotateCcw size={14} /> Reset
        </button>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="action-btn-secondary">
            <ChevronLeft size={14} /> Previous
          </button>
        )}
        <button type="button" onClick={handleSave} className="action-btn-primary">
          <Save size={14} /> Save Horoscope
        </button>
        <button type="button" onClick={() => setShowPreview(true)} className="action-btn-secondary">
          <Eye size={14} /> Preview
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="action-btn-gold ml-auto">
            Next <ChevronRight size={14} />
          </button>
        ) : (
          <button type="button" onClick={onNextStep} className="action-btn-gold ml-auto">
            Next Step <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B1E54]/50 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#3B1E54] flex items-center gap-2">
                  <Star className="text-[#B8860B]" size={20} /> Horoscope Preview
                </h3>
                <button type="button" onClick={() => setShowPreview(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X size={18} />
                </button>
              </div>
              <HoroscopeDisplay horoscopeData={data} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .action-btn-primary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 12px; font-size: 12px; font-weight: 700;
          background: linear-gradient(135deg, #7F55B1, #9B7EBD); color: white;
          border: none; cursor: pointer; transition: all 0.2s;
        }
        .action-btn-primary:hover { box-shadow: 0 4px 14px rgba(127,85,177,0.35); transform: translateY(-1px); }
        .action-btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 12px; font-size: 12px; font-weight: 600;
          background: white; color: #7F55B1; border: 1px solid #E9D5FF; cursor: pointer; transition: all 0.2s;
        }
        .action-btn-secondary:hover { border-color: #9B7EBD; background: #FDF4FF; }
        .action-btn-gold {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 12px; font-size: 12px; font-weight: 700;
          background: linear-gradient(135deg, #B8860B, #D4A847); color: white;
          border: none; cursor: pointer; transition: all 0.2s;
        }
        .action-btn-gold:hover { box-shadow: 0 4px 14px rgba(184,134,11,0.35); transform: translateY(-1px); }
      `}</style>
    </div>
  );
};

export default HoroscopeModule;
