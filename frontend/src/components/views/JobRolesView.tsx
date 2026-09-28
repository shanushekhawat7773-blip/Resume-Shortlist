import React from 'react';
import {
  Briefcase,
  PlusCircle,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Trash2,
  Layers,
} from 'lucide-react';
import { useRecruitment } from '../../context/RecruitmentContext';

interface JobRolesViewProps {
  onOpenCreateJob: () => void;
}

export const JobRolesView: React.FC<JobRolesViewProps> = ({ onOpenCreateJob }) => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    deleteJob,
    candidates,
    setActiveTab,
  } = useRecruitment();

  const handleSelectAndInspect = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveTab('overview');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-400" />
            Job Profiles & Target Requirements
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active roles with structured NLP skill taxonomies and responsibility benchmarks.
          </p>
        </div>

        <button
          onClick={onOpenCreateJob}
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Job Role</span>
        </button>
      </div>

      {/* Job Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map(job => {
          const isSelected = job.id === selectedJobId;
          const candidateCount = candidates.filter(c => c.appliedJobId === job.id || !c.appliedJobId).length;

          return (
            <div
              key={job.id}
              className={`rounded-2xl p-6 transition-all border flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-850 border-brand-500 ring-1 ring-brand-500/30 shadow-card'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                
                {/* Title & Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{job.title}</h3>
                      {isSelected && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800">
                          Active Target
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-brand-400 font-medium block mt-0.5">
                      {job.company} &bull; {job.department}
                    </span>
                  </div>

                  {jobs.length > 1 && (
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete Job Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {job.experienceRequired}+ yrs experience
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    {job.domain}
                  </span>
                </div>

                {/* Description Excerpt */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Required Skills */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Mandatory Skills ({job.requiredSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map(s => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-brand-950 border border-brand-800 text-brand-300 text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preferred Skills */}
                {job.preferredSkills.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Preferred Skills ({job.preferredSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.preferredSkills.map(s => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  <strong className="text-white">{candidateCount}</strong> candidates in pool
                </span>

                <button
                  onClick={() => handleSelectAndInspect(job.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-slate-200 hover:text-white'
                      : 'bg-brand-600 hover:bg-brand-500 text-white'
                  }`}
                >
                  <span>{isSelected ? 'View Candidates' : 'Set as Active Target'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
