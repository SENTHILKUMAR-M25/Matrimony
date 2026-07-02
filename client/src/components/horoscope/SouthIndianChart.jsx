import { motion } from 'framer-motion';
import { HOUSE_GRID, getPlanetAbbr } from '../../constants/horoscope';

const COLORS = {
  primary: '#7F55B1',
  secondary: '#9B7EBD',
  accent: '#F49BAB',
  gold: '#B8860B',
  bg: '#FFFBFA',
  house: '#FDF4FF',
  center: '#F3E8FF',
};

const SouthIndianChart = ({
  title,
  chart,
  activeHouse,
  onHouseClick,
  readOnly = false,
  compact = false,
  centerLabel = 'Chart',
}) => {
  const cellH = compact ? 'h-12 sm:h-14' : 'h-16 sm:h-20 md:h-24';
  const textSize = compact ? 'text-[8px] sm:text-[9px]' : 'text-[9px] sm:text-[10px]';
  const abbrSize = compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm';

  return (
    <div className="flex flex-col items-center w-full">
      {title && (
        <h4 className={`font-bold text-[#3B1E54] mb-2 sm:mb-3 tracking-wide uppercase ${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-sm'}`}>
          {title}
        </h4>
      )}
      <div
        className={`relative w-full max-w-[280px] sm:max-w-xs border-2 rounded-lg overflow-hidden shadow-md ${compact ? 'shadow-sm' : ''}`}
        style={{ borderColor: COLORS.gold, background: COLORS.bg }}
      >
        <div className="grid grid-cols-4 grid-rows-4 gap-0">
          {HOUSE_GRID.flat().map((houseNum, idx) => {
            if (houseNum === null) {
              if (idx === 5) {
                return (
                  <div
                    key="center"
                    className={`col-span-2 row-span-2 flex flex-col items-center justify-center ${cellH}`}
                    style={{ background: COLORS.center }}
                  >
                    <span className={`${textSize} font-bold text-[#7F55B1] uppercase tracking-widest`}>{centerLabel}</span>
                    <span className={`${textSize} text-[#9B7EBD] italic`}>Chart</span>
                  </div>
                );
              }
              return null;
            }

            const planets = chart[String(houseNum)] || [];
            const isActive = activeHouse === houseNum;

            return (
              <motion.button
                key={`h-${houseNum}`}
                type="button"
                disabled={readOnly}
                onClick={() => !readOnly && onHouseClick?.(houseNum)}
                whileHover={readOnly ? {} : { scale: 1.02 }}
                whileTap={readOnly ? {} : { scale: 0.98 }}
                className={`
                  relative flex flex-col items-center justify-center border p-0.5 sm:p-1 transition-all duration-200
                  ${cellH}
                  ${readOnly ? 'cursor-default' : 'cursor-pointer hover:bg-[#FCE7F3]'}
                  ${isActive ? 'ring-2 ring-[#7F55B1] ring-inset bg-[#FDF2F8] z-10' : ''}
                `}
                style={{
                  background: isActive ? '#FDF2F8' : COLORS.house,
                  borderColor: '#E9D5FF',
                }}
              >
                <span
                  className={`absolute top-0.5 left-0.5 ${textSize} font-mono text-[#9B7EBD]/70 leading-none`}
                >
                  {houseNum}
                </span>
                <div className={`flex flex-wrap justify-center gap-0.5 ${abbrSize} font-bold text-[#3B1E54] leading-tight px-0.5`}>
                  {planets.length > 0 ? (
                    planets.map((p) => (
                      <span
                        key={p}
                        className="px-0.5 rounded"
                        style={{ color: p === 'Lagna' ? COLORS.gold : COLORS.primary }}
                        title={p}
                      >
                        {getPlanetAbbr(p)}
                      </span>
                    ))
                  ) : (
                    <span className={`${textSize} text-gray-300 font-normal`}>—</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SouthIndianChart;
