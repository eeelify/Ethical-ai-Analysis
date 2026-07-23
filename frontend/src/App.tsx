import React, { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { HomePage } from "./components/HomePage";
import { AnimatePresence } from "framer-motion";
import { AdminDashboardEnhanced } from "./components/AdminDashboardEnhanced";
import { UserDashboard } from "./components/UserDashboard";
import { UseCaseOwnerDashboard } from "./components/UseCaseOwnerDashboard";
import { ProjectDetail } from "./components/ProjectDetail";
import { TensionDetail } from "./components/TensionDetail";
import { UseCaseOwnerDetail } from "./components/UseCaseOwnerDetail";
import { UseCaseDetail } from "./components/UseCaseDetail";
import { EvaluationForm } from "./components/EvaluationForm";
import { GeneralQuestions } from "./components/GeneralQuestions";
import { AddGeneralQuestion } from "./components/AddGeneralQuestion";
import { SharedArea } from "./components/SharedArea";
import { OtherMembers } from "./components/OtherMembers";
import { PreconditionApproval } from "./components/PreconditionApproval";
import { ReportReview } from "./components/ReportReview";
import { AdminReportReview } from "./components/AdminReportReview";
import {
  User,
  Project,
  Tension,
  UseCase,
} from "./types";
import { api } from "./api";
import { saveUser, loadUser, clearUser } from "./utils/auth";
import { saveViewState, loadViewState, clearViewState } from "./utils/persistence";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";
import { fetchUserProgress, fetchUserDetailedProgress } from "./utils/userProgress";
function App() {
  // User requested to disable "resume from where left off" behavior for security and predictability
  // const initialViewState = loadViewState();

  const [currentUser, setCurrentUser] = useState<User | null>(() => loadUser());
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTension, setSelectedTension] = useState<Tension | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<User | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  const isPopStateRef = React.useRef(false);
  const isInitialMountRef = React.useRef(true);
  const lastHistoryUrlRef = React.useRef<string | null>(null);

  // Global navigation sync with browser history
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.appNavState) {
        isPopStateRef.current = true; // Prevent the pushState effect from running
        lastHistoryUrlRef.current = window.location.pathname + window.location.search;
        const s = e.state.appNavState;
        setCurrentView(s.currentView);
        setSelectedProject(s.selectedProject);
        setSelectedTension(s.selectedTension);
        setSelectedOwner(s.selectedOwner);
        setSelectedUseCase(s.selectedUseCase);
        setSelectedReportId(s.selectedReportId);
      }
    };
    
    const constructUrl = () => {
      const params = new URLSearchParams();
      if (currentView !== 'dashboard') params.set('view', currentView);
      if (selectedProject) params.set('projectId', (selectedProject as any).id || (selectedProject as any)._id);
      if (selectedUseCase) params.set('useCaseId', (selectedUseCase as any).id || (selectedUseCase as any)._id);
      if (selectedReportId) params.set('reportId', selectedReportId);
      const query = params.toString();
      return window.location.pathname + (query ? '?' + query : '');
    };

    // Replace initial state so we have something to pop back to
    const initialUrl = constructUrl();
    window.history.replaceState({
      appNavState: { currentView, selectedProject, selectedTension, selectedOwner, selectedUseCase, selectedReportId }
    }, '', initialUrl);
    lastHistoryUrlRef.current = initialUrl;
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []); // Run once on mount

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (isPopStateRef.current) {
      isPopStateRef.current = false;
      return;
    }
    // Push new state to history when any view-related state changes
    const params = new URLSearchParams();
    if (currentView !== 'dashboard') params.set('view', currentView);
    if (selectedProject) params.set('projectId', (selectedProject as any).id || (selectedProject as any)._id);
    if (selectedUseCase) params.set('useCaseId', (selectedUseCase as any).id || (selectedUseCase as any)._id);
    if (selectedReportId) params.set('reportId', selectedReportId);
    const query = params.toString();
    const newUrl = window.location.pathname + (query ? '?' + query : '');
    if (newUrl === lastHistoryUrlRef.current) return;

    window.history.pushState({
      appNavState: { currentView, selectedProject, selectedTension, selectedOwner, selectedUseCase, selectedReportId }
    }, '', newUrl);
    lastHistoryUrlRef.current = newUrl;
  }, [currentView, selectedProject, selectedTension, selectedOwner, selectedUseCase, selectedReportId]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [needsPrecondition, setNeedsPrecondition] = useState(false);
  const [dashboardPreferredTab, setDashboardPreferredTab] = useState<"assigned" | "finished" | null>(null);
  const [assignmentsRefreshToken, setAssignmentsRefreshToken] = useState(0);

  // --- DATA FETCHING ---
  // Only fetch heavy dashboard data AFTER login to avoid stressing the backend while on the login screen.
  useEffect(() => {
    if (!currentUser) return;

    // Fetch all data in parallel - faster, with timeout
    const fetchAllData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        // Pass userId for all users (for backend strict project filtering)
        const userId = currentUser?.id || (currentUser as any)?._id;
        const useCasesQuery = currentUser?.role === 'admin' ? `?adminId=${userId}` : (userId ? `?ownerId=${userId}` : '');
        const [projectsRes, usersRes, useCasesRes] = await Promise.all([
          fetch(api(`/api/projects${userId ? `?userId=${userId}` : ''}`), { signal: controller.signal }),
          fetch(api('/api/users'), { signal: controller.signal }),
          fetch(api(`/api/use-cases${useCasesQuery}`), { signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        if (projectsRes.ok) {
          const data = await projectsRes.json();
          console.log('✅ Projects fetched:', data.length);
          const formattedProjects = data.map((p: any) => {
            // Normalize assignedUsers: if populated (objects), extract _id; if already strings, keep as is
            const normalizedAssignedUsers = (p.assignedUsers || []).map((user: any) => {
              if (typeof user === 'string') return user;
              if (user && user._id) return user._id.toString();
              return user;
            });
            return { ...p, id: p._id, assignedUsers: normalizedAssignedUsers };
          });
          setProjects(formattedProjects);
        } else {
          const errorText = await projectsRes.text().catch(() => 'Unknown error');
          console.error('❌ Failed to fetch projects:', projectsRes.status, projectsRes.statusText, errorText);
        }

        if (usersRes.ok) {
          const data = await usersRes.json();
          console.log('✅ Users fetched:', data.length);
          const formattedUsers = data.map((u: any) => ({ ...u, id: u._id }));
          setUsers(formattedUsers);
        } else {
          const errorText = await usersRes.text().catch(() => 'Unknown error');
          console.error('❌ Failed to fetch users:', usersRes.status, usersRes.statusText, errorText);
        }

        if (useCasesRes.ok) {
          const data = await useCasesRes.json();
          console.log('✅ Use cases fetched:', data.length);
          const formattedUseCases = data.map((u: any) => ({ ...u, id: u._id }));
          setUseCases(formattedUseCases);
        } else {
          const errorText = await useCasesRes.text().catch(() => 'Unknown error');
          console.error('❌ Failed to fetch use cases:', useCasesRes.status, useCasesRes.statusText, errorText);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Data loading error:", error);
        }
      }
    };

    fetchAllData();

    // Listen for projects update events (e.g., after assignment)
    const handleProjectsUpdate = (event: CustomEvent) => {
      const updatedProjects = event.detail;
      setProjects(updatedProjects);

      // Also update selectedProject if it exists and is in the updated list
      setSelectedProject(prev => {
        if (!prev) return prev;
        const updatedProject = updatedProjects.find((p: Project) => (p.id || (p as any)._id) === (prev.id || (prev as any)._id));
        return updatedProject || prev;
      });
    };

    window.addEventListener('projects-updated', handleProjectsUpdate as EventListener);

    // Periodically refresh projects (every 10 seconds) to catch assignment updates
    const refreshInterval = setInterval(() => {
      if (currentUser) {
        // Pass userId for all users (for strict backend project filtering)
        const userId = currentUser?.id || (currentUser as any)?._id;
        fetch(api(`/api/projects${userId ? `?userId=${userId}` : ''}`))
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data) {
              const formattedProjects = data.map((p: any) => {
                // Normalize assignedUsers: if populated (objects), extract _id; if already strings, keep as is
                const normalizedAssignedUsers = (p.assignedUsers || []).map((user: any) => {
                  if (typeof user === 'string') return user;
                  if (user && user._id) return user._id.toString();
                  return user;
                });
                return { ...p, id: p._id, assignedUsers: normalizedAssignedUsers };
              });
              setProjects(formattedProjects);

              // Also update selectedProject if it exists
              setSelectedProject(prev => {
                if (!prev) return prev;
                const updatedProject = formattedProjects.find((p: Project) => (p.id || (p as any)._id) === (prev.id || (prev as any)._id));
                return updatedProject || prev;
              });
            }
          })
          .catch(err => console.error('Error refreshing projects:', err));
      }
    }, 10000); // Refresh every 10 seconds

    return () => {
      window.removeEventListener('projects-updated', handleProjectsUpdate as EventListener);
      clearInterval(refreshInterval);
    };
  }, [currentUser]);

  // Persist view state whenever navigation changes
  useEffect(() => {
    /* 
     // Disabled to ensure users always start fresh on the dashboard
    if (currentUser) {
      saveViewState({
        currentView,
        selectedProject,
        selectedTension,
        selectedOwner,
        selectedUseCase,
        selectedReportId
      });
    }
    */
  }, [currentUser, currentView, selectedProject, selectedTension, selectedOwner, selectedUseCase, selectedReportId]);

  // Minimal URL-based route support for report review screen: /reports/:reportId/review
  useEffect(() => {
    const syncRouteFromUrl = () => {
      const path = window.location.pathname || "";
      const m = path.match(/^\/reports\/([^/]+)\/review\/?$/);
      if (m && m[1]) {
        setSelectedReportId(m[1]);
        setCurrentView("report-review");
      }
    };

    syncRouteFromUrl();
    window.addEventListener("popstate", syncRouteFromUrl);
    return () => window.removeEventListener("popstate", syncRouteFromUrl);
  }, []);

  // --- LOGIN ---
  const [loginRetrying, setLoginRetrying] = useState(false);

  const handleLogin = async (
    email: string,
    password: string,
    role: string,
  ) => {
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 2500;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const loginUrl = api('/api/login');
        console.log(`Login attempt ${attempt}/${MAX_RETRIES}...`);

        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role }),
        });

        console.log('Response status:', response.status, response.statusText);

        // 503 = DB not ready yet → retry silently
        if (response.status === 503 && attempt < MAX_RETRIES) {
          setLoginRetrying(true);
          console.warn(`DB not ready (attempt ${attempt}), retrying in ${RETRY_DELAY_MS}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          continue;
        }

        setLoginRetrying(false);

        if (response.ok) {
          const userDB = await response.json();
          const userFrontend = {
            ...userDB,
            id: userDB._id
          };

          setCurrentUser(userFrontend);
          saveUser(userFrontend);

          // Fetch profile image separately (login response excludes profileImage for performance)
          (async () => {
            try {
              const userId = userDB._id || userDB.id;
              if (!userId) return;
              const imgRes = await fetch(api(`/api/users/${userId}/profile-image`));
              if (imgRes.ok) {
                const img = await imgRes.json();
                setCurrentUser((prev) => {
                  if (!prev) return prev;
                  const updated = { ...(prev as any), profileImage: img.profileImage || null } as any;
                  saveUser(updated);
                  return updated;
                });
              }
            } catch (e) {
              // ignore; avatar fallback will be used
            }
          })();

          if (role !== "admin") {
            // Server provides `preconditionApproved` flag on the user object
            const approved = (userFrontend as any).preconditionApproved;
            setNeedsPrecondition(!Boolean(approved));
          }
          return; // success
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error', message: 'Unknown error' }));
          const errorMessage = errorData.error || errorData.message || "Login failed! Please check your credentials.";
          alert(errorMessage);
          return; // don't retry on real errors (wrong password, etc.)
        }
      } catch (error: any) {
        setLoginRetrying(false);
        console.error("Login error:", error);

        if (error.name === 'TypeError' && (error.message?.includes('fetch') || error.message?.includes('Failed to fetch'))) {
          alert("Could not connect to the server!\n\nPlease check:\n1. Is the backend running at http://localhost:5000?\n2. Is the Vite dev server running?\n3. Are there any errors in the backend terminal?");
        } else {
          alert(`Login error: ${error.message || 'Unknown error'}\n\nPlease make sure the backend is running.`);
        }
        return;
      }
    }

    // Exhausted all retries
    setLoginRetrying(false);
    alert("The server is still starting up. Please wait a few more seconds and try again.");
  };

  const handlePreconditionApproval = () => {
    // Call server to persist approval
    if (!currentUser?.id) return;
    (async () => {
      try {
        const res = await fetch(api(`/api/users/${currentUser.id}/precondition-approval`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const updatedUser = await res.json();
          setCurrentUser(prev => {
            const updated = prev ? { ...prev, ...updatedUser } : prev;
            if (updated) saveUser(updated);
            return updated;
          });
          setNeedsPrecondition(false);
        } else {
          console.error('Approval save failed');
        }
      } catch (err) {
        console.error('Approval error', err);
      }
    })();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearUser();
    clearViewState();
    setCurrentView("dashboard");
    setSelectedProject(null);
    setNeedsPrecondition(false);
  };

  // --- NAVIGATION ---
  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    if ((project as any).openAdminReview) {
      setCurrentView("admin-report-review");
    } else {
      setCurrentView("project-detail");
    }
  };

  const handleStartEvaluation = async (project: Project) => {
    if (!currentUser) return;
    
    setSelectedProject(project);
    
    // Show general questions first for non-usecase and non-admin users
    if (currentUser.role !== 'use-case-owner' && currentUser.role !== 'admin') {
      try {
        console.log('🔍 Checking user progress for navigation...');
        const { questionnaireStats, answeredQuestionnaireKeys } = await fetchUserDetailedProgress(project, currentUser);
        
        // Determine role-specific general questionnaire key
        const roleMap: Record<string, string> = {
          'ethical-expert': 'ethical-expert-v1',
          'medical-expert': 'medical-expert-v1',
          'technical-expert': 'technical-expert-v1',
          'legal-expert': 'legal-expert-v1',
          'education-expert': 'education-expert-v1',
        };
        const roleKey = roleMap[currentUser.role] || null;
        
        const isGeneralFinished = questionnaireStats['general-v1']?.isCompleted;
        const isRoleGeneralFinished = roleKey ? questionnaireStats[roleKey]?.isCompleted : true;
        
        // If they have already started the assessment (ethical-v1 or technical-v1), jump to evaluation
        const hasAssessmentStarted = answeredQuestionnaireKeys.some(key => 
          key === 'ethical-v1' || key === 'technical-v1'
        );
        
        if (hasAssessmentStarted) {
          console.log('⏩ Assessment already started, jumping to evaluation view');
          setCurrentView("evaluation");
        } else if (isGeneralFinished && isRoleGeneralFinished) {
          console.log('⏩ General questions finished, jumping to add-general-question view');
          setCurrentView("add-general-question");
        } else {
          console.log('📂 Starting at general questions');
          setCurrentView("general-questions");
        }
      } catch (error) {
        console.error('Error fetching progress for navigation:', error);
        setCurrentView("general-questions");
      }
    } else {
      setCurrentView("evaluation");
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedProject(null);
    setSelectedTension(null);
    setSelectedOwner(null);
    setSelectedUseCase(null);
    setSelectedReportId(null);
  };

  const handleReviewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentView("report-review");
    try {
      window.history.pushState({}, "", `/reports/${reportId}/review`);
    } catch {
      // ignore
    }
  };

  const handleFinishEvolution = async (project: Project) => {
    try {
      const projectId = project?.id || (project as any)?._id;
      const userId = currentUser?.id || (currentUser as any)?._id;
      if (!projectId || !userId) return;

      const res = await fetch(api(`/api/projects/${projectId}/finish-evolution`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const rawText = await res.text().catch(() => "");
        const err = (() => {
          try {
            return rawText ? JSON.parse(rawText) : {};
          } catch {
            return {};
          }
        })();

        if ((err as any)?.error === "NOT_ALL_TENSIONS_VOTED") {
          const totalTensions = (err as any)?.totalTensions || 0;
          const expertNames = (err as any)?.expertNames || 'some experts';
          alert(
            `Cannot finish evolution: Not all experts have voted on all tensions.\n\n` +
            `Total tensions: ${totalTensions}\n` +
            `Please wait for ${expertNames} to vote on all tensions.`
          );
          return;
        }
        if ((err as any)?.error === "NOT_ALL_QUESTIONS_ANSWERED") {
          const unansweredCount = (err as any)?.unansweredCount || 0;
          const totalQuestions = (err as any)?.totalQuestions || 0;
          const answeredQuestions = (err as any)?.answeredQuestions || 0;
          const unansweredList = Array.isArray((err as any)?.unansweredQuestions)
            ? (err as any).unansweredQuestions
            : [];
          const unansweredText = unansweredList.length > 0
            ? `\nUnanswered (sample): ${unansweredList.slice(0, 10).join(", ")}\n`
            : "\n";
          alert(
            `Cannot finish evolution: ${unansweredCount} question(s) are not answered.\n\n` +
            `Progress: ${answeredQuestions}/${totalQuestions} questions answered.\n\n` +
            unansweredText +
            `Please answer all questions before finishing evolution.`
          );
          return;
        }
        if ((err as any)?.error === "WAITING_FOR_OTHER_EXPERTS") {
          const totalExperts = (err as any)?.totalExperts || 0;
          const completedExperts = (err as any)?.completedExperts || 0;
          const incompleteExperts = (err as any)?.incompleteExperts || 0;
          const expertProgresses = (err as any)?.expertProgresses || [];
          const incompleteList = expertProgresses
            .filter((ep: any) => ep.progress < 100)
            .map((ep: any) => `- ${ep.name || 'Expert'}: ${ep.progress}%`)
            .join('\n');

          alert(
            `Please wait for other experts to complete their evaluations.\n\n` +
            `Progress: ${completedExperts}/${totalExperts} experts completed (100%)\n` +
            `${incompleteExperts} expert(s) still working:\n${incompleteList || 'No experts listed'}\n\n` +
            `All experts must complete their evaluations before the project can be finished.`
          );
          return;
        }
        const details = rawText && rawText.length < 500 ? rawText : "";
        alert((err as any)?.error || `Failed to finish evolution.${details ? `\n\n${details}` : ""}`);
        return;
      }

      setAssignmentsRefreshToken((x) => x + 1);
      setDashboardPreferredTab("finished");
      setCurrentView("dashboard");
      setSelectedProject(null);
      setSelectedTension(null);
      setSelectedOwner(null);
      setSelectedUseCase(null);

      window.dispatchEvent(new Event("message-sent"));
    } catch (error) {
      console.error("Finish evolution error:", error);
      alert("Could not connect to the server.");
    }
  };

  const handleViewTension = (tension: Tension) => {
    setSelectedTension(tension);
    setCurrentView("tension-detail");
  };

  const handleBackToProject = () => {
    // Clear one-shot tab flags when going back
    if (selectedProject) {
      const { openTensionsTab, ...projectWithoutFlag } = selectedProject as any;
      setSelectedProject(projectWithoutFlag);
    }
    setCurrentView("project-detail");
    setSelectedTension(null);
    setSelectedOwner(null);
  };

  const handleViewOwner = (owner: User) => {
    setSelectedOwner(owner);
    setCurrentView("owner-detail");
  };

  const handleViewUseCase = (useCase: UseCase) => {
    setSelectedUseCase(useCase);
    setCurrentView("usecase-detail");
  };

  const handleViewReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setCurrentView("report-review");
  };

  // --- CREATION HANDLERS (BACKEND'E KAYIT) ---
  const handleCreateProject = async (projectData: Partial<Project>): Promise<Project | null> => {
    try {
      // Only send userId for admin users (so backend can set createdByAdmin)
      const isAdmin = currentUser?.role?.toLowerCase().includes('admin');
      const userId = isAdmin ? (currentUser?.id || (currentUser as any)?._id) : null;
      const response = await fetch(api('/api/projects'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectData,
          ...(userId && { userId }), // Only add userId if admin
          status: "ongoing",
          stage: "set-up",
          progress: 0,
          assignedUsers: projectData.assignedUsers || [],
          useCase: projectData.useCase
        })
      });

      if (response.ok) {
        const newProjectDB = await response.json();
        const newProjectFrontend: Project = {
          ...newProjectDB,
          id: newProjectDB._id,
          isNew: true,
        };
        setProjects([newProjectFrontend, ...projects]);
        alert("Project created successfully!");
        return newProjectFrontend;
      } else {
        alert("An error occurred while creating the project.");
        return null;
      }
    } catch (error) {
      console.error("Project creation error:", error);
      alert("Could not connect to the server.");
      return null;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(api(`/api/projects/${projectId}`), {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects((prev) => prev.filter((project) => project.id !== projectId));
        alert("Project deleted successfully.");
      } else {
        alert("Failed to delete the project.");
      }
    } catch (error) {
      console.error("Project deletion error:", error);
      alert("Could not connect to the server.");
    }
  };

  const handleCreateUseCase = async (useCaseData: Partial<UseCase>) => {
    try {
      console.log('Creating use case with data:', useCaseData);
      const response = await fetch(api('/api/use-cases'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...useCaseData,
          ownerId: currentUser?.id,
          status: 'assigned',
          progress: 0,
          assignedExperts: [],
          supportingFiles: useCaseData.supportingFiles || [],
          answers: useCaseData.answers || []
        })
      });

      if (response.ok) {
        const newUseCaseDB = await response.json();
        const newUseCaseFrontend = {
          ...newUseCaseDB,
          id: newUseCaseDB._id
        };
        // Update list so we can see it immediately
        setUseCases([newUseCaseFrontend, ...useCases]);
        alert("Use Case created successfully!");
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error("Use Case creation error:", errorData);
        alert(`Failed to create Use Case: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Use Case creation error:", error);
      alert("Could not connect to the server.");
    }
  };

  const handleDeleteUseCase = async (useCaseId: string) => {
    try {
      const response = await fetch(api(`/api/use-cases/${useCaseId}`), {
        method: 'DELETE'
      });

      if (response.ok) {
        setUseCases((prev) => prev.filter((uc) => uc.id !== useCaseId));
        alert("Use case deleted successfully.");
      } else {
        alert("Failed to delete the use case.");
      }
    } catch (error) {
      console.error("Use case deletion error:", error);
      alert("Could not connect to the server.");
    }
  };

  // --- TENSION EKLEME ---
  const handleCreateTension = async (tensionData: any) => {
    if (!selectedProject) return;

    try {
      const response = await fetch(api('/api/tensions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tensionData,
          projectId: selectedProject.id
        })
      });

      if (response.ok) {
        console.log("Tension created successfully");
      } else {
        alert("An error occurred while adding the tension.");
      }
    } catch (error) {
      console.error("Tension create error:", error);
      alert("Could not connect to the server.");
    }
  };

  // Client-side routing state for unauthenticated views
  const [unauthPath, setUnauthPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => setUnauthPath(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateUnauth = (path: string) => {
    window.history.pushState({}, '', path);
    setUnauthPath(path);
  };

  if (!currentUser) {
    let unauthContent;
    
    if (unauthPath === '/forgot-password') {
      unauthContent = (
        <ForgotPassword
          key="forgot-password"
          onBackToLogin={() => navigateUnauth('/login')}
        />
      );
    } else if (unauthPath === '/reset-password') {
      unauthContent = (
        <ResetPassword
          key="reset-password"
          onBackToLogin={() => navigateUnauth('/login')}
        />
      );
    } else if (unauthPath === '/login') {
      unauthContent = <LoginScreen key="login" onLogin={handleLogin} initialView="login" navigateTo={navigateUnauth} />;
    } else if (unauthPath === '/register' || unauthPath === '/signup') {
      unauthContent = <LoginScreen key="register" onLogin={handleLogin} initialView="register" navigateTo={navigateUnauth} />;
    } else {
      unauthContent = <HomePage key="home" navigateTo={navigateUnauth} />;
    }

    return (
      <div className="min-h-screen bg-[#050b14]">
        <AnimatePresence mode="wait">
          {unauthContent}
        </AnimatePresence>
      </div>
    );
  }

  if (needsPrecondition) {
    return (
      <PreconditionApproval
        userRole={currentUser.role}
        onApproval={handlePreconditionApproval}
        onBack={handleLogout}
      />
    );
  }

  const renderContent = () => {
    if (currentView === "admin-report-review" && currentUser && selectedProject) {
      return (
        <AdminReportReview
          projectId={(selectedProject as any).id || (selectedProject as any)._id}
          currentUser={currentUser}
          onViewReport={handleViewReport}
          onBack={() => {
            try { window.history.pushState({}, "", "/"); } catch {}
            setCurrentView("dashboard");
          }}
        />
      );
    }

    if (currentView === "report-review" && currentUser && selectedReportId) {
      return (
        <ReportReview
          reportId={selectedReportId}
          currentUser={currentUser}
          onBack={() => {
            try {
              window.history.pushState({}, "", "/");
            } catch {
              // ignore
            }
            setSelectedReportId(null);
            setCurrentView("dashboard");
          }}
        />
      );
    }

    switch (currentView) {
      case "project-detail":
        return selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            currentUser={currentUser}
            users={users}
            onBack={handleBackToDashboard}
            onStartEvaluation={() => handleStartEvaluation(selectedProject)}
            onFinishEvolution={() => handleFinishEvolution(selectedProject)}
            onViewTension={handleViewTension}
            onViewOwner={handleViewOwner}
            onCreateTension={handleCreateTension}
            onViewReport={(reportId) => {
              setSelectedReportId(reportId);
              setCurrentView("report-review");
            }}
            onOpenAdminReview={() => setCurrentView("admin-report-review")}
            initialTab={(selectedProject as any).openOntologyTab ? 'ontologyReport' : ((selectedProject as any).openReportsTab ? 'reports' : ((selectedProject as any).openTensionsTab ? 'tensions' : undefined))}
            key={(selectedProject as any).openOntologyTab ? 'ontology-tab' : ((selectedProject as any).openReportsTab ? 'reports-tab' : ((selectedProject as any).openTensionsTab ? 'tensions-tab' : 'default-tab'))}
          />
        ) : null;
      case "owner-ontology-chat":
        return currentUser?.role === "use-case-owner" ? (
          <UseCaseOwnerDashboard
            currentUser={currentUser}
            useCases={useCases}
            users={users}
            projects={projects}
            onCreateUseCase={handleCreateUseCase}
            onViewUseCase={handleViewUseCase}
            onDeleteUseCase={handleDeleteUseCase}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            dashboardSection="ontology"
          />
        ) : null;
      case "tension-detail":
        return selectedTension ? (
          <TensionDetail
            tension={selectedTension}
            currentUser={currentUser}
            users={users}
            onBack={handleBackToProject}
          />
        ) : null;
      case "owner-detail":
        return selectedOwner ? (
          <UseCaseOwnerDetail
            owner={selectedOwner}
            currentUser={currentUser}
            onBack={handleBackToProject}
            onViewUseCase={handleViewUseCase}
          />
        ) : null;
      case "general-questions":
        if (!selectedProject) {
          console.warn('⚠️ No project selected in general-questions view, showing dashboard');
          return currentUser?.role === "use-case-owner" ? (
            <UseCaseOwnerDashboard
              currentUser={currentUser}
              useCases={useCases}
              users={users}
              projects={projects}
              onCreateUseCase={handleCreateUseCase}
              onViewUseCase={handleViewUseCase}
              onDeleteUseCase={handleDeleteUseCase}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          ) : currentUser?.role === "admin" ? (
            <AdminDashboardEnhanced
              currentUser={currentUser}
              projects={projects}
              users={users}
              useCases={useCases}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
              onViewReport={handleViewReport}
            />
          ) : (
            <UserDashboard
              currentUser={currentUser}
              projects={projects}
              users={users}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onFinishEvolution={handleFinishEvolution}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onViewUseCase={handleViewUseCase}
              onReviewReport={handleReviewReport}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
              preferredTab={dashboardPreferredTab}
              onPreferredTabApplied={() => setDashboardPreferredTab(null)}
              assignmentsRefreshToken={assignmentsRefreshToken}
            />
          );
        }
        return (
          <GeneralQuestions
            project={selectedProject}
            currentUser={currentUser}
            onBack={() => {
              try {
                // Always go to dashboard first, then navigate to project-detail if project exists
                if (selectedProject) {
                  // Preserve selectedProject and go to project detail
                  setCurrentView("project-detail");
                } else {
                  // No project selected, go to dashboard
                  setCurrentView("dashboard");
                }
              } catch (error) {
                console.error('Error in general-questions onBack:', error);
                // On error, always go to dashboard
                setCurrentView("dashboard");
              }
            }}
            onComplete={() => {
              try {
                const projectToUse = selectedProject;
                if (projectToUse) {
                  setCurrentView("add-general-question");
                } else {
                  setCurrentView("dashboard");
                }
              } catch (error) {
                console.error('Error in general-questions onComplete:', error);
                setCurrentView("dashboard");
              }
            }}
          />
        );
      case "add-general-question":
        if (!selectedProject) {
          console.warn('⚠️ No project selected in add-general-question view, showing dashboard');
          return currentUser?.role === "use-case-owner" ? (
            <UseCaseOwnerDashboard
              currentUser={currentUser}
              useCases={useCases}
              users={users}
              projects={projects}
              onCreateUseCase={handleCreateUseCase}
              onViewUseCase={handleViewUseCase}
              onDeleteUseCase={handleDeleteUseCase}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          ) : currentUser?.role === "admin" ? (
            <AdminDashboardEnhanced
              currentUser={currentUser}
              projects={projects}
              users={users}
              useCases={useCases}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          ) : (
            <UserDashboard
              currentUser={currentUser}
              projects={projects}
              users={users}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onFinishEvolution={handleFinishEvolution}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onViewUseCase={handleViewUseCase}
              onReviewReport={handleReviewReport}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
              preferredTab={dashboardPreferredTab}
              onPreferredTabApplied={() => setDashboardPreferredTab(null)}
              assignmentsRefreshToken={assignmentsRefreshToken}
            />
          );
        }
        return (
          <AddGeneralQuestion
            project={selectedProject}
            currentUser={currentUser}
            onBack={() => {
              try {
                const projectToUse = selectedProject;
                if (projectToUse) {
                  setCurrentView("general-questions");
                } else {
                  setCurrentView("dashboard");
                }
              } catch (error) {
                console.error('Error in add-general-question onBack:', error);
                setCurrentView("dashboard");
              }
            }}
            onComplete={() => {
              try {
                const projectToUse = selectedProject;
                if (projectToUse) {
                  setSelectedProject({ ...projectToUse, openTensionsTab: true } as any);
                  setCurrentView("project-detail");
                } else {
                  setCurrentView("dashboard");
                }
              } catch (error) {
                console.error('Error in add-general-question onComplete:', error);
                setCurrentView("dashboard");
              }
            }}
          />
        );
      case "evaluation":
        if (!selectedProject) {
          // If no project selected, return dashboard instead of null
          console.warn('⚠️ No project selected in evaluation view, showing dashboard');
          return currentUser?.role === "use-case-owner" ? (
            <UseCaseOwnerDashboard
              currentUser={currentUser}
              useCases={useCases}
              users={users}
              projects={projects}
              onCreateUseCase={handleCreateUseCase}
              onViewUseCase={handleViewUseCase}
              onDeleteUseCase={handleDeleteUseCase}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          ) : currentUser?.role === "admin" ? (
            <AdminDashboardEnhanced
              currentUser={currentUser}
              projects={projects}
              users={users}
              useCases={useCases}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          ) : (
            <UserDashboard
              currentUser={currentUser}
              projects={projects}
              users={users}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onFinishEvolution={handleFinishEvolution}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onViewUseCase={handleViewUseCase}
              onReviewReport={handleReviewReport}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
              preferredTab={dashboardPreferredTab}
              onPreferredTabApplied={() => setDashboardPreferredTab(null)}
              assignmentsRefreshToken={assignmentsRefreshToken}
            />
          );
        }
        return (
          <EvaluationForm
            project={selectedProject}
            currentUser={currentUser}
            onBack={() => {
              try {
                // Preserve selectedProject when going back
                const projectToUse = selectedProject;
                if (!projectToUse) {
                  console.warn('⚠️ selectedProject is null in onBack, going to dashboard');
                  setCurrentView("dashboard");
                  return;
                }
                // If user came from general questions, go back to general questions
                // Otherwise go back to project detail
                if (currentUser && currentUser.role !== 'use-case-owner' && currentUser.role !== 'admin') {
                  setCurrentView("general-questions");
                } else {
                  setCurrentView("project-detail");
                }
              } catch (error) {
                console.error('Error in evaluation onBack:', error);
                setCurrentView("dashboard");
              }
            }}
            onSubmit={() => {
              try {
                // Assessment finished: mark progress and return to project detail
                const projectToUse = selectedProject;
                if (projectToUse) {
                  setProjects(prev => prev.map(p => p.id === projectToUse.id ? { ...p, progress: 100 } : p));
                  setSelectedProject(prev => prev ? { ...prev, progress: 100 } : prev);
                  setCurrentView("project-detail");
                } else {
                  setCurrentView("dashboard");
                }
              } catch (error) {
                console.error('Error in evaluation onSubmit:', error);
                setCurrentView("dashboard");
              }
            }}
          />
        );
      case "shared-area":
        return (
          <SharedArea
            currentUser={currentUser}
            projects={projects}
            users={users}
            onBack={handleBackToDashboard}
          />
        );
      case "other-members":
        return (
          <OtherMembers
            currentUser={currentUser}
            users={users}
            projects={projects}
            onBack={handleBackToDashboard}
          />
        );
      case "usecase-detail":
        return selectedUseCase ? (
          <UseCaseDetail
            useCase={selectedUseCase}
            currentUser={currentUser}
            users={users}
            onBack={handleBackToDashboard}
          />
        ) : null;
      default:
        if (currentUser.role === "use-case-owner") {
          return (
            <UseCaseOwnerDashboard
              currentUser={currentUser}
              useCases={useCases}
              users={users}
              projects={projects}
              onCreateUseCase={handleCreateUseCase}
              onViewUseCase={handleViewUseCase}
              onDeleteUseCase={handleDeleteUseCase}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          );
        } else if (currentUser.role === "admin") {
          return (
            <AdminDashboardEnhanced
              currentUser={currentUser}
              projects={projects}
              users={users}
              useCases={useCases} // <-- This prop enables the Admin panel to see Use Cases
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          );
        } else {
          return (
            <UserDashboard
              currentUser={currentUser}
              projects={projects}
              users={users}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onFinishEvolution={handleFinishEvolution}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onViewUseCase={handleViewUseCase}
              onReviewReport={handleReviewReport}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
              preferredTab={dashboardPreferredTab}
              onPreferredTabApplied={() => setDashboardPreferredTab(null)}
              assignmentsRefreshToken={assignmentsRefreshToken}
            />
          );
        }
    }
  };

  const content = renderContent();

  // If content is null, show dashboard as fallback to prevent white screen
  if (content === null) {
    // If we're not on dashboard and content is null, show dashboard
    if (currentView !== "dashboard") {
      // Return dashboard content directly
      return (
        <div className="min-h-screen bg-gray-50">
          {currentUser?.role === "use-case-owner" ? (
            <UseCaseOwnerDashboard
              currentUser={currentUser}
              useCases={useCases}
              users={users}
              projects={projects}
              onCreateUseCase={handleCreateUseCase}
              onViewUseCase={handleViewUseCase}
              onDeleteUseCase={handleDeleteUseCase}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          ) : currentUser?.role === "admin" ? (
            <AdminDashboardEnhanced
              currentUser={currentUser}
              projects={projects}
              users={users}
              useCases={useCases}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          ) : (
            <UserDashboard
              currentUser={currentUser}
              projects={projects}
              users={users}
              onViewProject={handleViewProject}
              onStartEvaluation={handleStartEvaluation}
              onFinishEvolution={handleFinishEvolution}
              onDeleteProject={handleDeleteProject}
              onNavigate={setCurrentView}
              onViewUseCase={handleViewUseCase}
              onReviewReport={handleReviewReport}
              onLogout={handleLogout}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
              preferredTab={dashboardPreferredTab}
              onPreferredTabApplied={() => setDashboardPreferredTab(null)}
              assignmentsRefreshToken={assignmentsRefreshToken}
            />
          )}
        </div>
      );
    }
    // If already on dashboard but still null, show loading
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {content}
    </div>
  );
}

export default App;
