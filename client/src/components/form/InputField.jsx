import React from 'react';

const InputField = ({ label, icon: Icon, type = "text", register, name, rules, errors, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-200 ml-1">
      {label} {rules?.required && <span className="text-pink-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Icon size={18} />
      </div>
      <input
        type={type}
        {...register(name, rules)}
        className={`w-full bg-white/5 border ${errors[name] ? 'border-pink-500' : 'border-gray-700'} text-white text-sm rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 block p-3.5 pl-11 transition-all placeholder-gray-500`}
        placeholder={placeholder}
      />
    </div>
    {errors[name] && <p className="text-xs text-pink-400 ml-1 mt-1">{errors[name].message}</p>}
  </div>
);

export default InputField;
