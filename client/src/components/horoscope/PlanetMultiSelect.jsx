import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Check } from 'lucide-react';
import { PLANETS } from '../../constants/horoscope';

const PlanetMultiSelect = ({ selected = [], onChange, disabledPlanets = [], error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [pos, setPos] = useState({});

  const filtered = PLANETS.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.abbr.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (!triggerRef.current?.contains(e.target) && !menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left, width: Math.max(rect.width, 260) });
  }, [open]);

  const toggle = (planetId) => {
    if (disabledPlanets.includes(planetId) && !selected.includes(planetId)) return;
    if (selected.includes(planetId)) {
      onChange(selected.filter((p) => p !== planetId));
    } else {
      onChange([...selected, planetId]);
    }
  };

  const selectedLabels = selected
    .map((id) => PLANETS.find((p) => p.id === id)?.abbr || id)
    .join(', ');

  return (
    <div className="space-y-1">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
          error ? 'border-pink-400 bg-pink-50/50' : 'border-[#E9D5FF] bg-white hover:border-[#9B7EBD]'
        }`}
      >
        <span className={selected.length ? 'text-[#3B1E54] font-medium' : 'text-gray-400'}>
          {selected.length ? selectedLabels : 'Select planets…'}
        </span>
        <Search size={14} className="text-[#9B7EBD] shrink-0" />
      </button>
      {error && <p className="text-xs text-pink-500">{error}</p>}

      {open && createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="fixed z-[10000] bg-white rounded-xl border border-[#E9D5FF] shadow-2xl overflow-hidden"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div className="p-2 border-b border-[#F3E8FF]">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search planets…"
                  className="w-full pl-8 pr-8 py-2 text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7F55B1]/30"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
            <ul className="max-h-52 overflow-y-auto py-1">
              {filtered.map((planet) => {
                const isSelected = selected.includes(planet.id);
                const isDisabled = disabledPlanets.includes(planet.id) && !isSelected;
                return (
                  <li key={planet.id}>
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => toggle(planet.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                        isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#FDF4FF] cursor-pointer'
                      } ${isSelected ? 'bg-[#F3E8FF] text-[#7F55B1] font-semibold' : 'text-gray-700'}`}
                    >
                      <span className="w-6 text-center font-bold text-[#B8860B]">{planet.abbr}</span>
                      <span className="flex-1">{planet.label}</span>
                      {isSelected && <Check size={14} className="text-[#7F55B1]" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default PlanetMultiSelect;
