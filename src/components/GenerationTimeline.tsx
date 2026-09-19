import React from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { GenerationStep } from '../types';

interface GenerationTimelineProps {
  steps: GenerationStep[];
  currentStepIndex: number;
}

export const GenerationTimeline: React.FC<GenerationTimelineProps> = ({
  steps,
  currentStepIndex,
}) => {
  return (
    <div className="relative border-l border-slate-800 ml-4 md:ml-6 my-2 space-y-6">
      {steps.map((step, idx) => {
        const isCompleted = step.status === 'completed';
        const isProcessing = step.status === 'processing';
        const isFailed = step.status === 'failed';
        const isPending = step.status === 'pending';

        return (
          <div key={step.id || idx} className="relative pl-6 md:pl-8 group">
            {/* Step Icon Node */}
            <div className="absolute -left-3.5 top-0.5 flex items-center justify-center">
              {isCompleted ? (
                <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-900/40">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : isProcessing ? (
                <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-sm shadow-cyan-900/50 ring-4 ring-cyan-500/10">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : isFailed ? (
                <div className="w-7 h-7 rounded-full bg-rose-950 border border-rose-500 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-500">
                  <Circle className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Step Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono-tech font-semibold text-slate-400 tracking-wider">
                  ETAPA {String(step.step_number).padStart(2, '0')}
                </span>

                <h4
                  className={`text-sm font-semibold tracking-wide ${
                    isCompleted
                      ? 'text-slate-200'
                      : isProcessing
                      ? 'text-cyan-300'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </h4>

                {isProcessing && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
                    <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                    Em execução
                  </span>
                )}
              </div>

              <p
                className={`text-xs leading-relaxed ${
                  isProcessing ? 'text-slate-300' : 'text-slate-400'
                }`}
              >
                {step.description}
              </p>

              {/* Telemetry output if available */}
              {step.telemetry && (
                <div className="mt-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono-tech text-cyan-200/90 flex items-start gap-2">
                  <span className="text-cyan-500 shrink-0">↳</span>
                  <span>{step.telemetry}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
