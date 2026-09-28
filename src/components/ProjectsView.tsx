import { useState } from 'react';
import { 
  FolderGit2, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Lightbulb, 
  ListChecks, 
  Plus, 
  Check,
  ExternalLink
} from 'lucide-react';
import { SkillTwinAnalysis, UserProfile, RecommendedProject, ProjectItem } from '../types';

interface ProjectsViewProps {
  analysis: SkillTwinAnalysis;
  profile: UserProfile;
  onAddProjectToProfile: (newProject: ProjectItem) => void;
}

export default function ProjectsView({ analysis, profile, onAddProjectToProfile }: ProjectsViewProps) {
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [expandedProjects, setExpandedProjects] = useState<string[]>(
    analysis.recommendedProjects?.map((p) => p.id) || []
  );
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    if (expandedProjects.includes(id)) {
      setExpandedProjects(expandedProjects.filter((item) => item !== id));
    } else {
      setExpandedProjects([...expandedProjects, id]);
    }
  };

  const handleAddProject = (project: RecommendedProject) => {
    const newProjItem: ProjectItem = {
      id: `p-${Date.now()}`,
      name: project.title,
      description: project.problemStatement.slice(0, 140) + '...',
      technologies: project.technologies,
      link: '',
    };
    onAddProjectToProfile(newProjItem);
    setAddedIds([...addedIds, project.id]);
  };

  const projects = analysis.recommendedProjects || [];
  const filteredProjects = filterDifficulty === 'All' 
    ? projects 
    : projects.filter((p) => p.difficulty === filterDifficulty);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored To Your Skill Gaps</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Projects You Should Build
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Recruiters judge candidates on tangible builds. These projects are engineered to prove competence in your target missing skills.
            </p>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterDifficulty === diff
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Cards List */}
      <div className="space-y-6">
        {filteredProjects.map((project, idx) => {
          const isExpanded = expandedProjects.includes(project.id);
          const isAdded = addedIds.includes(project.id) || profile.projects.some((p) => p.name.toLowerCase() === project.title.toLowerCase());

          const diffColor =
            project.difficulty === 'Beginner'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : project.difficulty === 'Intermediate'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';

          return (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition"
            >
              {/* Project Card Header */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${diffColor}`}>
                        {project.difficulty}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Recommendation #{idx + 1}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      {project.title}
                    </h2>
                  </div>

                  {/* Add to my projects action */}
                  <button
                    onClick={() => handleAddProject(project)}
                    disabled={isAdded}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer flex-shrink-0 ${
                      isAdded
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added to Profile</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to My Projects</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Problem Statement */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Problem Statement</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.problemStatement}
                  </p>
                </div>

                {/* Technologies & Skills Learned Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      Technologies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      Skills Learned
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skillsLearned.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Why recommended rationale */}
                <div className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  💡 <strong>SkillTwin Rationale: </strong> {project.whyRecommended}
                </div>
              </div>

              {/* Toggle Step-by-Step Plan Drawer */}
              <div className="border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="w-full px-6 py-3 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer transition select-none"
                >
                  <span className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-indigo-500" />
                    <span>View Step-by-Step Development Plan & Core Features</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="p-6 sm:p-8 bg-slate-50/30 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 space-y-6">
                    {/* Main Features */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                        Main Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {project.mainFeatures.map((feature, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-Step Plan */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                        Step-by-Step Development Plan
                      </h4>
                      <div className="space-y-2.5">
                        {project.stepByStepPlan.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3"
                          >
                            <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {sIdx + 1}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug">
                              {step}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
