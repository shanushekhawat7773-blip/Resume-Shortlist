import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';
import { batchProcessor, BatchProcessingProgress } from '../../services/batchProcessor';

interface BatchUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchUploadModal: React.FC<BatchUploadModalProps> = ({ isOpen, onClose }) => {
  const { selectedJob, addCandidate, setActiveTab, setSelectedCandidateId } = useRecruitment();

  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<BatchProcessingProgress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen || !selectedJob) return null;

  const handleFilesSelected = (selected: FileList | null) => {
    if (!selected) return;
    const validFiles: File[] = [];
    for (let i = 0; i < selected.length; i++) {
      const f = selected[i];
      const nameLower = f.name.toLowerCase();
      if (nameLower.endsWith('.pdf') || nameLower.endsWith('.docx') || nameLower.endsWith('.txt')) {
        validFiles.push(f);
      }
    }
    setFiles(validFiles);
  };

  const handleStartBatch = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const result = await batchProcessor.processBatch(
      files,
      selectedJob,
      (prog) => setProgress({ ...prog }),
      (candidate) => {
        addCandidate(candidate);
      }
    );

    setIsProcessing(false);
  };

  const handleCompleteAndExplore = () => {
    onClose();
    setActiveTab('shortlist');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-2xl shadow-elevation overflow-hidden flex flex-col text-slate-100 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-400" />
              Batch Resume Processing Pipeline
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload 10, 50, or 100 resumes for asynchronous ingestion against <strong className="text-slate-200">{selectedJob.title}</strong>.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* File Picker if not yet processing */}
          {!progress && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-750 hover:border-brand-500 rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-850/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={e => handleFilesSelected(e.target.files)}
                className="hidden"
              />
              <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <span className="text-sm font-bold text-white block">
                Click to select resumes for batch processing
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                Supports PDF, DOCX, and TXT files (e.g. 10 to 100 documents)
              </span>
              {files.length > 0 && (
                <span className="mt-3 inline-block px-3 py-1 rounded-full bg-brand-950 border border-brand-800 text-brand-300 text-xs font-semibold">
                  {files.length} documents selected
                </span>
              )}
            </div>
          )}

          {/* Progress Overview Bar */}
          {progress && (
            <div className="bg-slate-850 border border-slate-750 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                      <span>Processing Batch Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Batch Ingestion Completed</span>
                    </>
                  )}
                </span>
                <span className="font-mono text-slate-300 font-bold">
                  {progress.completed + progress.failed} / {progress.total} Processed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-brand-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((progress.completed + progress.failed) / Math.max(1, progress.total)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">{progress.completed} Successfully Parsed</span>
                {progress.failed > 0 && <span className="text-rose-400 font-semibold">{progress.failed} Failed</span>}
              </div>
            </div>
          )}

          {/* Per-Document Queue Items */}
          {progress && (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {progress.items.map(item => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-850 border border-slate-750 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 truncate max-w-xs">
                    {item.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {item.status === 'processing' && <Loader2 className="w-4 h-4 animate-spin text-brand-400 shrink-0" />}
                    {item.status === 'pending' && <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />}
                    {item.status === 'failed' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    
                    <span className="text-white font-medium truncate">{item.fileName}</span>
                  </div>

                  <div className="text-right">
                    {item.status === 'completed' && (
                      <span className="text-emerald-400 font-bold font-mono">
                        {item.score}% Match ({item.candidateName})
                      </span>
                    )}
                    {item.status === 'processing' && <span className="text-brand-300 italic text-[11px]">Parsing...</span>}
                    {item.status === 'pending' && <span className="text-slate-500 text-[11px]">Queued</span>}
                    {item.status === 'failed' && <span className="text-rose-400 text-[11px]">Corrupt document</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          {!progress ? (
            <button
              onClick={handleStartBatch}
              disabled={files.length === 0}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <span>Process {files.length} Resumes</span>
            </button>
          ) : (
            <button
              onClick={handleCompleteAndExplore}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <span>View in Shortlist Board</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
