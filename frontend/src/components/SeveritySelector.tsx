import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { TensionSeverity } from '../types';
import { getSeverityColor, getSeverityLabel } from '../utils/helpers';

interface SeveritySelectorProps {
  value: TensionSeverity;
  onChange: (severity: TensionSeverity) => void;
}

export function SeveritySelector({ value, onChange }: SeveritySelectorProps) {
  const severities: TensionSeverity[] = ['high', 'medium', 'low'];

  return (
    <div>
      <label className="block text-sm mb-3 text-slate-300 flex items-center">
        <AlertTriangle className="h-4 w-4 mr-2" />
        Tension Severity *
      </label>
      <div className="grid grid-cols-3 gap-3">
        {severities.map((severity) => {
          const colors = getSeverityColor(severity);
          const isSelected = value === severity;

          return (
            <button
              key={severity}
              type="button"
              onClick={() => onChange(severity)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? `${colors.border} ${colors.bg} ring-2 ring-offset-2 ring-${severity === 'high' ? 'red' : severity === 'medium' ? 'yellow' : 'green'}-500`
                  : 'border-white/10 hover:border-white/20 bg-[#0b1221]'
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full ${colors.badge} mb-2 flex items-center justify-center text-white`}
                >
                  {severity === 'high' && '🔴'}
                  {severity === 'medium' && '🟡'}
                  {severity === 'low' && '🟢'}
                </div>
                <div
                  className={`text-sm ${
                    isSelected ? colors.text : 'text-slate-300'
                  }`}
                >
                  {getSeverityLabel(severity)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {severity === 'high' && 'Critical concern'}
                  {severity === 'medium' && 'Moderate concern'}
                  {severity === 'low' && 'Minor concern'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
