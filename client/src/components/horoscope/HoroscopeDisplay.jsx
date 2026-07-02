import SouthIndianChart from './SouthIndianChart';

const Field = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2 py-1.5 border-b border-[#E9D5FF]/40 text-[11px] sm:text-xs">
      <span className="text-[#9B7EBD] font-semibold shrink-0">{label}</span>
      <span className="text-[#3B1E54] text-right">{value}</span>
    </div>
  );
};

const HoroscopeDisplay = ({ horoscopeData, compact = false }) => {
  if (!horoscopeData) return null;
  const { birthDetails, fields, rasiChart, navamsaChart } = horoscopeData;
  const f = fields || {};

  const hasCharts = rasiChart && Object.values(rasiChart).some((p) => p?.length > 0);

  return (
    <div className="space-y-4">
      {birthDetails && (birthDetails.dateOfBirth || birthDetails.placeOfBirth) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-xs">
          {birthDetails.dateOfBirth && (
            <div className="p-2 rounded-lg bg-[#FDF4FF] border border-[#E9D5FF]">
              <p className="text-[#9B7EBD] font-semibold uppercase text-[9px]">DOB</p>
              <p className="text-[#3B1E54] font-medium">{birthDetails.dateOfBirth}</p>
            </div>
          )}
          {birthDetails.timeOfBirth && (
            <div className="p-2 rounded-lg bg-[#FDF4FF] border border-[#E9D5FF]">
              <p className="text-[#9B7EBD] font-semibold uppercase text-[9px]">Time</p>
              <p className="text-[#3B1E54] font-medium">{birthDetails.timeOfBirth}</p>
            </div>
          )}
          {birthDetails.placeOfBirth && (
            <div className="p-2 rounded-lg bg-[#FDF4FF] border border-[#E9D5FF] col-span-2">
              <p className="text-[#9B7EBD] font-semibold uppercase text-[9px]">Place</p>
              <p className="text-[#3B1E54] font-medium truncate">{birthDetails.placeOfBirth}</p>
            </div>
          )}
        </div>
      )}

      {hasCharts && (
        <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} gap-4 sm:gap-6`}>
          <SouthIndianChart title="Rasi Chart" chart={rasiChart} readOnly compact={compact} />
          <SouthIndianChart title="Navamsa Chart" chart={navamsaChart} readOnly compact={compact} />
        </div>
      )}

      <div className="space-y-0.5">
        <Field label="Rasi" value={f.rasi} />
        <Field label="Nakshatra" value={f.nakshatra} />
        <Field label="Lagnam" value={f.lagnam} />
        <Field label="Pada" value={f.pada} />
        <Field label="Gothram" value={f.gothram} />
        <Field label="Dosham" value={f.dosham} />
        <Field label="Chevvai Dosham" value={f.chevvaiDosham} />
        <Field label="Nadi" value={f.nadi} />
        <Field label="Yoni" value={f.yoni} />
        <Field label="Rajju" value={f.rajju} />
        <Field label="Gana" value={f.gana} />
        <Field label="Dasa" value={f.dasa} />
        <Field label="Mahadasa" value={f.mahadasa} />
      </div>
    </div>
  );
};

export default HoroscopeDisplay;
