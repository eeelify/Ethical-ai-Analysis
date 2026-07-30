import React, { useState, useEffect, useRef } from 'react';
import { saveAdminDashboardTab, loadAdminDashboardTab } from '../utils/persistence';
import { Plus, Folder, MessageSquare, Users, LogOut, Search, BarChart3, UserPlus, X, Link as LinkIcon, CheckCircle2, Trash2, Bell, Clock, FileText, Download, Database } from 'lucide-react';
import { Project, User, UseCase } from '../types';
import { fetchUserProgress } from '../utils/userProgress';
import { ChatPanel } from './ChatPanel';
import { ProfileModal } from './ProfileModal';
import { ExpertQuestionManager } from './ExpertQuestionManager';
import { OntologyViewerTab } from './OntologyViewerTab';
import { api } from '../api';
import { UnifiedReportViewer } from './UnifiedReportViewer';
import { SharedArea } from './SharedArea';
import { OtherMembers } from './OtherMembers';

interface AdminDashboardEnhancedProps {
  currentUser: User;
  projects: Project[];
  users: User[];
  useCases?: UseCase[];
  onViewProject: (project: Project, chatUserId?: string) => void;
  onStartEvaluation: (project: Project) => void;
  onCreateProject: (project: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onUpdateUser?: (user: User) => void;
  onReviewAdminReports?: (project: Project) => void;
  onViewReport?: (reportId: string) => void;
}

const statusColors = {
  ongoing: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  proven: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  disproven: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
};

const stageLabels = {
  'set-up': 'Set-up',
  assess: 'Assess',
  resolve: 'Resolve'
};

const useCaseStatusColors: Record<string, { bg: string; text: string }> = {
  'assigned': { bg: 'bg-green-100', text: 'text-green-800' },
  'unassigned': { bg: 'bg-[#0f172a]', text: 'text-slate-400' },
  'in-review': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'completed': { bg: 'bg-emerald-100', text: 'text-emerald-800' }
};

const ProjectCard: React.FC<{
  project: Project;
  currentUser: User;
  onViewProject: (p: Project) => void;
  onStartEvaluation: (p: Project) => void;
  onDeleteProject: (id: string) => void;
  onReviewAdminReports?: (p: Project) => void;
}> = ({ project, currentUser, onViewProject, onStartEvaluation, onDeleteProject, onReviewAdminReports }) => {
  const [userProgress, setUserProgress] = useState<number>(project.progress ?? 0);

  useEffect(() => {
    let mounted = true;
    const fetchProgress = async () => {
      try {
        if (currentUser.role === 'admin') {
          // Admin: Fetch project details to get overall team average progress
          const res = await fetch(api(`/api/projects/${project.id}`));
          if (res.ok) {
            const data = await res.json();
            if (mounted) setUserProgress(data.progress || 0);
          }
        } else {
          // Others: Fetch individual user progress
          const val = await fetchUserProgress(project, currentUser);
          if (mounted) setUserProgress(val);
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
    // Periodically update progress (every 30 seconds)
    const interval = setInterval(fetchProgress, 30000); // Changed for performance
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [project.id, (project as any)._id, currentUser.id, (currentUser as any)._id]);

  const progressDisplay = Math.max(0, Math.min(100, userProgress));

  return (
    <div
      key={project.id}
      onClick={() => onViewProject(project)}
      className="bg-[#050b14] rounded-xl border border-white/10 p-6 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 h-10">{project.shortDescription}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const confirmed = window.confirm(`Delete project "${project.title}"?`);
            if (confirmed) {
              onDeleteProject(project.id);
            }
          }}
          className="ml-3 inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {(() => {
          // USE BACKEND derivedStatus AS SINGLE SOURCE OF TRUTH
          const derivedStatus = project.derivedStatus || 'setup';

          switch (derivedStatus.toLowerCase()) {
            case 'resolve':
              return (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  RESOLVE
                </span>
              );
            case 'assess':
              return (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  ASSESS
                </span>
              );
            default: // 'setup' or unknown
              return (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#0f172a] text-slate-400">
                  SETUP
                </span>
              );
          }
        })()}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-medium text-white">{progressDisplay}%</span>
        </div>
        <div className="w-full bg-[#0b1221]/10 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-1.5 rounded-full transition-all"
            style={{ width: `${progressDisplay}%`, minWidth: progressDisplay > 0 ? '8px' : '0' }}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
        <span>Updated: {new Date(project.createdAt).toLocaleDateString()}</span>
        {project.isNew && <span className="text-cyan-400 font-medium">New Project</span>}
      </div>
    </div>
  );
};

export function AdminDashboardEnhanced({
  currentUser,
  projects,
  users,
  useCases = [],
  onViewProject,
  onStartEvaluation,
  onCreateProject,
  onDeleteProject,
  onNavigate,
  onLogout,
  onUpdateUser,
  onReviewAdminReports,
  onViewReport
}: AdminDashboardEnhancedProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'use-case-assignments' | 'project-creation' | 'reports' | 'chats' | 'created-reports' | 'expert-questions' | 'ontology' | 'platform-info'>(() =>
    loadAdminDashboardTab('dashboard') as 'dashboard' | 'use-case-assignments' | 'project-creation' | 'reports' | 'chats' | 'created-reports' | 'expert-questions' | 'ontology' | 'platform-info'
  );

  // Persist tab changes
  useEffect(() => {
    saveAdminDashboardTab(activeTab);
  }, [activeTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignExpertsModal, setShowAssignExpertsModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadConversations, setUnreadConversations] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [allSystemNotifications, setAllSystemNotifications] = useState<any[]>([]);
  const [showNotificationHistory, setShowNotificationHistory] = useState(false);
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);
  const [messageUnreadConversations, setMessageUnreadConversations] = useState<any[]>([]);
  const [showMessageNotifications, setShowMessageNotifications] = useState(false);
  const messageNotificationRef = useRef<HTMLDivElement>(null);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const [chatOtherUser, setChatOtherUser] = useState<User | null>(null);
  const [chatProject, setChatProject] = useState<Project | null>(null);
  const [allConversations, setAllConversations] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  // Local use-cases state for lazy loading
  const [localUseCases, setLocalUseCases] = useState<any[]>(useCases || []);
  const [useCasesLoading, setUseCasesLoading] = useState(false);
  const useCasesFetchedRef = useRef(false);

  // Sync prop changes (e.g. after create/delete from parent)
  useEffect(() => {
    if (useCases && useCases.length > 0) {
      setLocalUseCases(useCases);
    }
  }, [useCases]);

  // Lazy-load use cases when assignments tab is opened
  useEffect(() => {
    if (activeTab !== 'use-case-assignments') return;
    // Refresh every time the tab is opened
    setUseCasesLoading(true);
    const userId = currentUser?.id || (currentUser as any)?._id;
    fetch(api(`/api/use-cases?adminId=${userId}`))
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => {
        const formatted = data.map((u: any) => ({ ...u, id: u._id }));
        setLocalUseCases(formatted);
        useCasesFetchedRef.current = true;
      })
      .catch(err => console.error('Failed to fetch use-cases:', err))
      .finally(() => setUseCasesLoading(false));
  }, [activeTab]);

  // Fetch all conversations (chats)
  const fetchConversations = async () => {
    try {
      const response = await fetch(api(`/api/messages/conversations?userId=${encodeURIComponent(currentUser.id)}`));
      if (response.ok) {
        const data = await response.json();
        setAllConversations(data || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Find or create a project for communication with a user (UseCaseOwner-Admin logic)
  const getCommunicationProject = async (otherUser: User): Promise<Project> => {
    // Try to find an existing project where both users are assigned
    let commProject = projects.find(p =>
      p.assignedUsers.includes(currentUser.id) &&
      p.assignedUsers.includes(otherUser.id)
    );

    // If not found, try to find a project with similar name
    if (!commProject) {
      const projectName = `Communication: ${currentUser.name} & ${otherUser.name}`;
      commProject = projects.find(p =>
        p.title === projectName ||
        p.title.includes('Communication') ||
        (p.assignedUsers.includes(currentUser.id) && p.assignedUsers.includes(otherUser.id))
      );
    }

    // If still not found, use first project as fallback
    if (!commProject && projects.length > 0) {
      commProject = projects[0];
    }

    // If still no project, create one via API
    if (!commProject) {
      try {
        const userId = currentUser?.id || (currentUser as any)?._id;
        const response = await fetch(api('/api/projects'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Communication: ${currentUser.name} & ${otherUser.name}`,
            shortDescription: `Direct communication between ${currentUser.name} and ${otherUser.name}`,
            fullDescription: 'This project is used for direct communication between team members.',
            stage: 'set-up',
            status: 'ongoing',
            targetDate: new Date().toISOString(),
            userId: userId, // Add userId so backend can set createdByAdmin
            assignedUsers: [currentUser.id, otherUser.id],
            progress: 0
          }),
        });
        if (response.ok) {
          const newProject = await response.json();
          commProject = { ...newProject, id: newProject._id || newProject.id };
          console.log('Created communication project:', commProject);
        } else {
          const error = await response.text();
          console.error('Failed to create project:', response.status, error);
        }
      } catch (error) {
        console.error('Error creating communication project:', error);
      }
    }

    // Final fallback - use existing project
    if (!commProject) {
      // Try to use any project where current user is assigned
      commProject = projects.find(p => p.assignedUsers.includes(currentUser.id));

      if (!commProject) {
        console.error('No project available for communication. Please create a project first.');
        alert('Cannot start conversation: No project available. Please create a project first.');
        throw new Error('No project available');
      }
    }

    console.log('Using project for communication:', commProject);
    return commProject;
  };

  const handleOpenChat = async (conversation: any) => {
    const otherUser = users.find(u => u.id === conversation.otherUserId);
    if (otherUser) {
      try {
        const project = await getCommunicationProject(otherUser);
        console.log('Opening chat with:', { otherUser, project });
        setChatOtherUser(otherUser);
        setChatProject(project);
        setChatPanelOpen(true);
      } catch (error) {
        console.error('Error opening chat:', error);
        alert('Cannot open chat: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const handleDeleteConversation = async (projectId: string, otherUserId: string) => {
    try {
      const response = await fetch(api('/api/messages/delete-conversation'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          userId: currentUser.id,
          otherUserId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Close chat panel if this conversation is open
        if (chatProject?.id === projectId && chatOtherUser?.id === otherUserId) {
          setChatPanelOpen(false);
          // Keep project/user so ChatPanel stays mounted
        }
        // Refresh conversations list
        fetchConversations();
      } else {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || 'Unknown error' };
        }
        alert('Failed to delete conversation: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Fetch unread count for ALERTS (Bell icon) - Should ONLY show system notifications
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(api(`/api/messages/unread-count?userId=${encodeURIComponent(currentUser.id)}`));
      if (response.ok) {
        const data = await response.json();
        const conversations = data.conversations || [];

        // Filter FOR notification-only messages (Bell Icon)
        const notificationConversations = conversations.filter((conv: any) => {
          const lastMsg = String(conv.lastMessage || '');
          const isNotification = conv.isNotification === true || lastMsg.startsWith('[NOTIFICATION]');
          return isNotification;
        });

        const actualUnreadCount = notificationConversations.reduce((sum: number, conv: any) => sum + (conv.count || conv.unreadCount || 0), 0);
        setUnreadCount(actualUnreadCount);
        setUnreadConversations(notificationConversations);
      } else {
        console.error('Admin failed to fetch unread count:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch all system notifications (for history view)
  const fetchAllNotifications = async () => {
    try {
      const response = await fetch(api(`/api/messages/history?userId=${encodeURIComponent(currentUser.id)}&limit=100`));
      if (response.ok) {
        const data = await response.json();
        setAllSystemNotifications(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching notification history:', error);
    }
  };

  // Fetch unread message count for message notifications (excludes notification messages)
  const fetchMessageUnreadCount = async () => {
    try {
      const response = await fetch(api(`/api/messages/unread-count?userId=${encodeURIComponent(currentUser.id)}`));
      if (response.ok) {
        const data = await response.json();
        const conversations = data.conversations || [];

        // Filter out notification-only messages - chat bubble should only show real user messages
        const realConversations = conversations.filter((conv: any) => {
          const lastMsg = String(conv.lastMessage || '');
          const isNotification = conv.isNotification === true || lastMsg.startsWith('[NOTIFICATION]');
          return !isNotification;
        });

        // Calculate actual unread count from real conversations only
        const actualUnreadCount = realConversations.reduce((sum: number, conv: any) => sum + (conv.count || conv.unreadCount || 0), 0);
        setMessageUnreadCount(actualUnreadCount);
        setMessageUnreadConversations(realConversations);
      } else {
        console.error('Admin failed to fetch message unread count:', response.status, response.statusText);
        setMessageUnreadCount(0);
        setMessageUnreadConversations([]);
      }
    } catch (error) {
      console.error('Error fetching message unread count:', error);
      setMessageUnreadCount(0);
      setMessageUnreadConversations([]);
    }
  };

  // Poll for unread messages every 30 seconds
  useEffect(() => {
    fetchUnreadCount(); // Bell
    fetchMessageUnreadCount(); // Messages
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchMessageUnreadCount();
    }, 30000); // 30 seconds

    // Listen for message sent events to refresh immediately
    const handleMessageSent = () => {
      setTimeout(() => {
        fetchUnreadCount();
        fetchMessageUnreadCount();
      }, 1000);
      if (activeTab === 'chats') {
        setTimeout(fetchConversations, 1000);
      }
    };
    window.addEventListener('message-sent', handleMessageSent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message-sent', handleMessageSent);
    };
  }, [currentUser.id, activeTab]);

  // Fetch conversations when chats tab is shown
  useEffect(() => {
    if (activeTab === 'chats') {
      fetchConversations();
      const interval = setInterval(fetchConversations, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab, currentUser.id]);


  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (messageNotificationRef.current && !messageNotificationRef.current.contains(event.target as Node)) {
        setShowMessageNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle notification click - open chat panel
  const handleNotificationClick = async (conversation: any) => {
    console.log('[DEBUG] Notification Clicked:', conversation);

    const project =
      projects.find(p => p.id === conversation.projectId) ||
      ({
        id: conversation.projectId,
        title: conversation.projectTitle || 'Project',
      } as any);

    const otherUser =
      users.find(u => u.id === conversation.fromUserId) ||
      ({
        id: conversation.fromUserId,
        name: conversation.fromUserName || 'User',
      } as any);

    console.log('[DEBUG] Resolved Chat Context:', {
      projectId: project?.id,
      projectTitle: project?.title,
      otherUserId: otherUser?.id,
      otherUserName: otherUser?.name
    });

    if (project && otherUser) {
      // Mark messages as read
      try {
        await fetch(api('/api/messages/mark-read'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: conversation.projectId,
            userId: currentUser.id,
            otherUserId: conversation.fromUserId,
          }),
        });
        fetchUnreadCount();
        fetchMessageUnreadCount();
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }

      // Open chat panel (also for notification-only messages)
      setChatProject(project);
      setChatOtherUser(otherUser);
      setChatPanelOpen(true);
      setShowNotifications(false);
      setShowMessageNotifications(false);
    }
  };
  const [selectedProjectForAssignment, setSelectedProjectForAssignment] = useState<Project | null>(null);

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="flex h-screen bg-[#0a1122] overflow-hidden text-slate-300">
      {/* Sidebar */}
      <div className="w-64 bg-[#050b14] border-r border-white/10 flex flex-col flex-shrink-0">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

        <div className="p-6 border-b border-white/10">
          <div className="text-xl font-bold text-white mb-1">Ethical AI Analysis</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider">Admin Portal</div>
        </div>

        <button
          onClick={() => setShowProfile(true)}
          className="w-full px-6 py-6 border-b border-white/10 hover:bg-[#0b1221]/5 transition-colors text-left"
        >
          <div className="flex items-center">
            {(currentUser as any).profileImage ? (
              <img
                src={(currentUser as any).profileImage}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-medium mr-3">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="text-sm overflow-hidden">
              <div className="text-white font-medium truncate">{currentUser.name}</div>
              <div className="text-slate-500 text-xs">Administrator</div>
            </div>
          </div>
        </button>

        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <Folder className="h-5 w-5 mr-3 text-blue-600" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('use-case-assignments')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'use-case-assignments' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <UserPlus className="h-5 w-5 mr-3 text-orange-600" />
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('project-creation')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'project-creation' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <Plus className="h-5 w-5 mr-3 text-green-600" />
            Create Project
          </button>
          <button
            onClick={() => setActiveTab('created-reports')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'created-reports' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <FileText className="h-5 w-5 mr-3 text-purple-600" />
            Created Reports
          </button>
          <button
            onClick={() => setActiveTab('expert-questions')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'expert-questions' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <FileText className="h-5 w-5 mr-3 text-pink-600" />
            Expert Questions
          </button>
          <button
            onClick={() => setActiveTab('other-members')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'other-members' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <Users className="h-5 w-5 mr-3 text-teal-600" />
            Members
          </button>
          <button
            onClick={() => setActiveTab('shared-area')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'shared-area' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <MessageSquare className="h-5 w-5 mr-3 text-indigo-600" />
            Shared Area
          </button>
          <button
            onClick={() => setActiveTab('ontology')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'ontology' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <Database className="h-5 w-5 mr-3 text-pink-600" />
            Ontology
          </button>
          <button
            onClick={() => setActiveTab('platform-info')}
            className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-colors ${activeTab === 'platform-info' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400 hover:bg-[#0b1221]/5 hover:text-white'
              }`}
          >
            <BarChart3 className="h-5 w-5 mr-3 text-amber-500" />
            Platform Info
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 flex items-center gap-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
          >
            <LogOut className="h-4 w-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0 flex flex-col bg-[#0a1122]">
        {/* Top Bar with Notifications */}
        <div className="bg-[#050b14] border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-white">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'use-case-assignments' && 'Use Case Assignments'}
              {activeTab === 'project-creation' && 'Create Project'}
              {activeTab === 'created-reports' && 'Created Reports'}
              {activeTab === 'expert-questions' && 'Expert Questions'}
              {activeTab === 'other-members' && 'Members'}
              {activeTab === 'shared-area' && 'Shared Area'}
              {activeTab === 'chats' && 'Chats'}
              {activeTab === 'ontology' && 'Ontology'}
              {activeTab === 'platform-info' && 'Platform Info'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* Message Notifications Button */}
            <div className="relative" ref={messageNotificationRef}>
              <button
                onClick={() => setShowMessageNotifications(!showMessageNotifications)}
                className="relative p-2 text-slate-400 hover:text-white"
              >
                <MessageSquare className="h-5 w-5" />
                {messageUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {messageUnreadCount > 9 ? '9+' : messageUnreadCount}
                  </span>
                )}
              </button>

              {showMessageNotifications && (
                <div
                  className="absolute top-full mt-2 bg-[#050b14] rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.1)] border border-white/10 z-[9999] overflow-hidden flex flex-col"
                  style={{
                    right: '0',
                    width: 'min(320px, calc(100vw - 2rem))',
                    maxHeight: 'min(500px, calc(100vh - 100px))',
                    maxWidth: 'calc(100vw - 1rem)'
                  }}
                >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                    <h3 className="font-semibold text-white">Messages</h3>
                    <button
                      onClick={() => setShowMessageNotifications(false)}
                      className="p-1 hover:bg-[#0f172a] rounded-full"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    {messageUnreadConversations.length === 0 ? (
                      <div className="p-6 text-center text-slate-400">
                        <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm">No unread messages</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {messageUnreadConversations.map((conv, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleNotificationClick(conv)}
                            className="w-full p-4 text-left hover:bg-[#050b14] transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                                    {conv.fromUserName?.charAt(0) || 'U'}
                                  </div>
                                  <div className="font-medium text-white text-sm truncate">
                                    {conv.fromUserName}
                                  </div>
                                </div>
                                <div className="text-xs text-slate-400 line-clamp-2">
                                  {conv.lastMessage}
                                </div>
                              </div>
                              {conv.count > 1 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                  {conv.count}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Button */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-white"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute top-full mt-2 bg-[#050b14] rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.1)] border border-white/10 z-[9999] overflow-hidden flex flex-col"
                  style={{
                    right: '0',
                    width: 'min(360px, calc(100vw - 2rem))',
                    maxHeight: 'min(500px, calc(100vh - 100px))',
                    maxWidth: 'calc(100vw - 1rem)'
                  }}
                >
                  <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 hover:bg-[#0f172a] rounded-full"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                  {/* Tab Toggle */}
                  <div className="flex border-b border-white/10 flex-shrink-0">
                    <button
                      onClick={() => setShowNotificationHistory(false)}
                      className={`flex-1 py-2 text-sm font-medium ${!showNotificationHistory ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-300'}`}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      onClick={() => {
                        setShowNotificationHistory(true);
                        fetchAllNotifications();
                      }}
                      className={`flex-1 py-2 text-sm font-medium ${showNotificationHistory ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-300'}`}
                    >
                      History
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    {!showNotificationHistory ? (
                      /* Unread View */
                      unreadConversations.length === 0 ? (
                        <div className="p-6 text-center text-slate-400">
                          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm">No unread notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {unreadConversations.map((conv, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleNotificationClick(conv)}
                              className="w-full p-4 text-left hover:bg-[#050b14] transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                                      {conv.fromUserName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="font-medium text-white text-sm truncate">
                                      {conv.fromUserName}
                                    </div>
                                  </div>
                                  <div className="text-xs text-slate-400 line-clamp-2">
                                    {String(conv.lastMessage || '').startsWith('[NOTIFICATION]')
                                      ? String(conv.lastMessage).replace(/^\[NOTIFICATION\]\s*/, '')
                                      : conv.lastMessage}
                                  </div>
                                </div>
                                {conv.count > 1 && (
                                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                    {conv.count}
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )
                    ) : (
                      /* History View */
                      allSystemNotifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400">
                          <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm">No notification history</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {allSystemNotifications.map((notif, idx) => (
                            <div
                              key={notif._id || idx}
                              className={`p-4 hover:bg-[#0a1122] transition-colors ${notif.isRead ? 'bg-[#050b14]' : 'bg-cyan-500/10'}`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <div className={`w-8 h-8 rounded-full ${notif.isRead ? 'bg-gray-400' : 'bg-blue-600'} text-white flex items-center justify-center text-xs font-medium`}>
                                      {notif.actorId?.name?.charAt(0) || 'S'}
                                    </div>
                                    <div className="font-medium text-white text-sm truncate">
                                      {notif.actorId?.name || 'System'}
                                    </div>
                                    {!notif.isRead && (
                                      <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">New</span>
                                    )}
                                  </div>
                                  <div className="text-sm font-medium text-gray-200 mb-0.5">{notif.title}</div>
                                  <div className="text-xs text-slate-400 line-clamp-2">{notif.message}</div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {notif.projectId?.title && <span className="mr-2">📁 {notif.projectId.title}</span>}
                                    {notif.createdAt && formatTime(notif.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chats Tab - Always mounted for stable height */}
        <div className={`flex-1 min-h-0 flex flex-col ${activeTab === 'chats' ? '' : 'hidden'}`}>
          <div className="flex-1 min-h-0 flex">
            {/* Conversations List */}
            <div className={`${chatPanelOpen ? 'w-1/3' : 'w-full'} border-r border-white/10 bg-[#050b14] flex flex-col min-h-0`}>
              <div className="p-6 flex-1 overflow-y-auto min-h-0">
                {allConversations.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg text-white mb-2">No conversations yet</h3>
                    <p className="text-slate-400">
                      Start a conversation with a team member to see it here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allConversations.map((conv) => {
                      const otherUser = users.find(u => u.id === conv.otherUserId);
                      const project = projects.find(p => p.id === conv.projectId);
                      if (!otherUser || !project) return null;

                      const hasUnread = (conv.count || conv.unreadCount || 0) > 0;
                      const isSelected = chatOtherUser?.id === otherUser.id && chatProject?.id === project.id;

                      return (
                        <div
                          key={`${conv.projectId}-${conv.otherUserId}`}
                          className={`bg-[#050b14] rounded-lg border p-4 cursor-pointer hover:shadow-md transition-all relative group ${hasUnread ? 'border-blue-500 border-l-4' : 'border-white/10'
                            } ${isSelected ? 'bg-blue-900/20 border-blue-500' : ''}`}
                        >
                          <div onClick={() => handleOpenChat(conv)}>
                            <div className="flex items-start space-x-4">
                              <div className="relative flex-shrink-0">
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium"
                                  style={{ backgroundColor: '#1F2937' }}
                                >
                                  {otherUser.name.charAt(0).toUpperCase()}
                                </div>
                                {hasUnread && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {(conv.count || conv.unreadCount || 0) > 9 ? '9+' : (conv.count || conv.unreadCount || 0)}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center space-x-2">
                                    <h3 className={`text-base font-medium ${hasUnread ? 'text-white' : 'text-gray-300'}`}>
                                      {otherUser.name}
                                    </h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-slate-400">
                                      {otherUser.role}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-xs text-slate-400">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTime(conv.lastMessageTime)}
                                  </div>
                                </div>
                                <p className={`text-sm ${hasUnread ? 'text-white font-medium' : 'text-slate-400'} line-clamp-2`}>
                                  {conv.lastMessage}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete conversation with ${otherUser.name}?`)) {
                                handleDeleteConversation(conv.projectId, conv.otherUserId);
                              }
                            }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:bg-red-900/20 rounded transition-opacity"
                            title="Delete conversation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Panel - Always mounted when project/user exist, shown when chatPanelOpen */}
            {chatProject && chatOtherUser ? (
              <div className={`flex-1 min-h-0 flex flex-col bg-[#0a1122] ${chatPanelOpen ? '' : 'hidden'}`}>
                <ChatPanel
                  project={chatProject}
                  currentUser={currentUser}
                  otherUser={chatOtherUser}
                  inline={true}
                  onClose={() => {
                    setChatPanelOpen(false);
                    // Keep project/user so ChatPanel stays mounted
                  }}
                  onMessageSent={() => {
                    window.dispatchEvent(new Event('message-sent'));
                    fetchUnreadCount();
                    fetchConversations();
                  }}
                  onDeleteConversation={() => {
                    setChatPanelOpen(false);
                    // Keep project/user so ChatPanel stays mounted
                    fetchUnreadCount();
                    fetchConversations();
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* Other Tabs */}
        <div className={`flex-1 w-full max-w-full min-w-0 min-h-0 ${activeTab === 'chats' ? 'hidden' : ''} ${['ontology', 'shared-area', 'other-members'].includes(activeTab) ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          {activeTab === 'expert-questions' && (
            <div className="flex-1 min-h-0 flex flex-col">
              <ExpertQuestionManager />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardTab
              projects={filteredProjects}
              users={users}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onViewProject={onViewProject}
              onCreateNew={() => setActiveTab('project-creation')}
              onDeleteProject={onDeleteProject}
              onReviewAdminReports={onReviewAdminReports}
            />
          )}

          {activeTab === 'use-case-assignments' && (
            <UseCaseAssignmentsTab
              useCases={localUseCases}
              projects={projects}
              loading={useCasesLoading}
              users={users}
              onAssignExperts={(project: Project) => {
                setSelectedProjectForAssignment(project);
                setShowAssignExpertsModal(true);
              }}
              onDeleteUseCase={async (useCaseId: string) => {
                try {
                  const response = await fetch(api(`/api/use-cases/${useCaseId}`), {
                    method: 'DELETE',
                  });
                  if (response.ok) {
                    // Reload use cases after deletion
                    const adminId = currentUser?.id || (currentUser as any)?._id;
                    const useCasesRes = await fetch(api(`/api/use-cases?adminId=${adminId}`));
                    if (useCasesRes.ok) {
                      const useCasesData = await useCasesRes.json();
                      const formattedUseCases = useCasesData.map((uc: any) => ({ ...uc, id: uc._id }));
                      window.dispatchEvent(new CustomEvent('use-cases-updated', { detail: formattedUseCases }));
                    }
                    alert('Use case deleted successfully!');
                  } else {
                    const errorData = await response.json().catch(() => ({}));
                    alert(`Delete error: ${errorData.error || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('Delete error:', error);
                  alert('An error occurred while deleting the use case.');
                }
              }}
            />
          )}

          {activeTab === 'project-creation' && (
            <ProjectCreationTab
              users={users}
              useCases={useCases}
              onCreateProject={onCreateProject}
              onClose={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'created-reports' && (
            <CreatedReportsTab
              projects={projects}
              currentUser={currentUser}
              onViewProject={onViewProject}
            />
          )}

          {activeTab === 'ontology' && (
            <OntologyViewerTab />
          )}

          {activeTab === 'platform-info' && (
            <AdminPlatformInfoTab />
          )}

          {activeTab === 'other-members' && (
            <div className="flex-1 min-h-0 flex flex-col p-6">
              <OtherMembers
                currentUser={currentUser}
                users={users}
                projects={projects}
                onBack={() => setActiveTab('dashboard')}
              />
            </div>
          )}

          {activeTab === 'shared-area' && (
            <div className="flex-1 min-h-0 flex flex-col p-6">
              <SharedArea
                currentUser={currentUser}
                projects={projects}
                users={users}
                onBack={() => setActiveTab('dashboard')}
              />
            </div>
          )}
        </div>
      </div>

      {/* Assign Experts Modal */}
      {
        showAssignExpertsModal && selectedProjectForAssignment && (
          <AssignExpertsModal
            project={selectedProjectForAssignment}
            useCase={useCases.find(uc => uc.id === (selectedProjectForAssignment.useCase as unknown as string)) as UseCase || { title: selectedProjectForAssignment.title } as UseCase}
            users={users}
            onClose={() => {
              setShowAssignExpertsModal(false);
              setSelectedProjectForAssignment(null);
            }}
            onAssign={async (expertIds, notes) => {
              try {
                const response = await fetch(api(`/api/projects/${selectedProjectForAssignment.id}/assign`), {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    assignedExperts: expertIds,
                    adminNotes: notes
                  })
                });

                if (response.ok) {
                  // Reload projects to reflect updated assignments and progress
                  try {
                    const userId = currentUser?.id || (currentUser as any)?._id;
                    const projectsRes = await fetch(api(`/api/projects${userId ? `?userId=${userId}` : ''}`));
                    if (projectsRes.ok) {
                      const data = await projectsRes.json();
                      const formattedProjects = data.map((p: any) => {
                        const normalizedAssignedUsers = (p.assignedUsers || []).map((user: any) => {
                          if (typeof user === 'string') return user;
                          if (user && user._id) return user._id.toString();
                          return user;
                        });
                        return { ...p, id: p._id, assignedUsers: normalizedAssignedUsers };
                      });
                      window.dispatchEvent(new CustomEvent('projects-updated', { detail: formattedProjects }));
                    }
                  } catch (reloadError) {
                    console.error("Error reloading projects:", reloadError);
                  }

                  alert("Experts assigned to the project successfully!");
                  setShowAssignExpertsModal(false);
                  setSelectedProjectForAssignment(null);
                } else {
                  const errorData = await response.json().catch(() => ({}));
                  alert(`Failed to assign experts: ${errorData.error || 'Unknown error'}`);
                }
              } catch (error) {
                console.error("Assignment error:", error);
                alert("Failed to assign experts.");
              }
            }}
          />
        )
      }

      {/* CHAT PANEL - Always mounted when project/user exist, shown when chatPanelOpen and not in chats tab */}
      {
        chatProject && chatOtherUser ? (
          <div className={chatPanelOpen && activeTab !== 'chats' ? 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4' : 'hidden'}>
            <div className="w-full max-w-4xl h-full max-h-[90vh] bg-[#050b14] border border-white/10 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.1)] overflow-hidden flex flex-col">
              <ChatPanel
                project={chatProject}
                currentUser={currentUser}
                otherUser={chatOtherUser}
                inline={true}
                defaultFullscreen={false}
                onClose={() => {
                  setChatPanelOpen(false);
                  // Keep project/user so ChatPanel stays mounted
                }}
                onMessageSent={() => {
                  window.dispatchEvent(new Event('message-sent'));
                  fetchUnreadCount();
                }}
              />
            </div>
          </div>
        ) : null
      }

      {/* PROFILE MODAL */}
      {
        showProfile && (
          <ProfileModal
            user={currentUser}
            onClose={() => setShowProfile(false)}
            onUpdate={(updatedUser) => {
              if (onUpdateUser) {
                onUpdateUser(updatedUser);
              }
              setShowProfile(false);
            }}
            onLogout={onLogout}
          />
        )
      }
    </div >
  );
}

// --- SUB COMPONENTS ---

// Project Progress Component - Shows project progress for Admin
// NOTE: Uses the `project.progress` field provided by the backend as calculation source.
// Thus, progress in Admin Dashboard stays consistent with Project Detail and other admin screens.

function isProgressContributorForAdminDashboard(role?: string) {
  const r = String(role || '').toLowerCase();
  if (!r) return false;
  if (r === 'admin') return false;
  if (r === 'use-case-owner') return false;
  if (r === 'usecaseowner') return false;
  if (r.includes('use-case-owner')) return false;
  return true;
}
function ProjectProgressCard({ project, users, onViewProject, onDeleteProject, onReviewAdminReports }: { project: Project; users: User[]; onViewProject: (p: Project) => void; onDeleteProject: (id: string) => void; onReviewAdminReports?: (p: Project) => void; }) {
  const [averageProgress, setAverageProgress] = useState<number>(project.progress ?? 0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const calculateAverageProgress = async () => {
      if (!project.assignedUsers || project.assignedUsers.length === 0) {
        if (mounted) {
          setAverageProgress(0);
          setLoading(false);
        }
        return;
      }

      try {
        const assignedUserIds = project.assignedUsers;

        // Include only contributing expert roles (excluding admin / use-case-owner)
        const contributorIds = assignedUserIds.filter((userId: string) => {
          const user = users.find(u => (u.id || (u as any)._id) === userId);
          if (!user) return false;
          return isProgressContributorForAdminDashboard(user.role);
        });

        if (contributorIds.length === 0) {
          if (mounted) {
            setAverageProgress(0);
            setLoading(false);
          }
          return;
        }

        const progressPromises = contributorIds.map(async (userId: string) => {
          const user = users.find(u => (u.id || (u as any)._id) === userId);
          if (!user) return 0;

          try {
            const progress = await fetchUserProgress(project, user);
            return typeof progress === 'number' ? progress : 0;
          } catch (error) {
            console.error(`Error fetching progress for user ${userId}:`, error);
            return 0;
          }
        });

        const progresses = await Promise.all(progressPromises);
        const sum = progresses.reduce((acc, p) => acc + (typeof p === 'number' ? p : 0), 0);
        const avg = sum / contributorIds.length;

        if (mounted) {
          setAverageProgress(Math.max(0, Math.min(100, Math.round(avg))));
          setLoading(false);
        }
      } catch (error) {
        console.error('Error calculating average progress:', error);
        if (mounted) {
          setAverageProgress(0);
          setLoading(false);
        }
      }
    };

    calculateAverageProgress();

    // Periodically update progress (every 5 seconds)
    const interval = setInterval(calculateAverageProgress, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [project.id, (project as any)._id, project.assignedUsers, users]);

  const progressDisplay = Math.max(0, Math.min(100, averageProgress));

  return (
    <div
      key={project.id}
      onClick={() => onViewProject(project)}
      className="bg-[#050b14]/50 rounded-xl border border-white/10 p-6 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:border-cyan-500/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-500 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 h-10">{project.shortDescription}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            const confirmed = window.confirm(`Delete project "${project.title}"?`);
            if (confirmed) {
              onDeleteProject(project.id);
            }
          }}
          className="ml-3 inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/20 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        {/* Only show generic status if it's NOT 'ongoing' OR if derivedStatus is 'setup' */}
        {((project.status || '').toLowerCase() !== 'ongoing' || (!project.derivedStatus || project.derivedStatus === 'setup')) && (
          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[project.status]?.bg || 'bg-gray-800'} ${statusColors[project.status]?.text || 'text-gray-300'}`}>
            {(project.status || 'Unknown').toUpperCase()}
          </span>
        )}
        {(() => {
          const derivedStatus = project.derivedStatus || 'setup';
          if (derivedStatus === 'resolve') {
            return (
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-900/30 text-green-400 border border-green-800">
                RESOLVE
              </span>
            );
          } else if (derivedStatus === 'assess') {
            return (
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-900/30 text-yellow-400 border border-yellow-800">
                ASSESS
              </span>
            );
          } else {
            return (
              <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-800 text-slate-400 rounded-full border border-white/10">
                SETUP
              </span>
            );
          }
        })()}

        {project.derivedStatus?.toLowerCase() === 'resolve' && onReviewAdminReports && (
          <button
            onClick={(e) => { e.stopPropagation(); onReviewAdminReports(project); }}
            className="ml-auto inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Review Reports
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-medium text-gray-300">
            {loading ? '...' : `${progressDisplay}%`}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all"
            style={{ width: `${progressDisplay}%`, minWidth: progressDisplay > 0 ? '8px' : '0' }}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
        <span>Updated: {new Date(project.createdAt).toLocaleDateString()}</span>
        {project.isNew && <span className="text-blue-400 font-medium">New Project</span>}
      </div>
    </div >
  );
}

function DashboardTab({ projects, users, searchQuery, setSearchQuery, onViewProject, onCreateNew, onDeleteProject, onReviewAdminReports }: any) {
  return (
    <>
      <div className="bg-[#050b14] border-b border-white/10 px-8 py-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Overview</h1>
            <p className="text-slate-400">Monitor all evaluation projects and risk assessments</p>
          </div>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 flex items-center shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            +Project
          </button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 bg-[#0a1122] border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: Project) => (
            <ProjectProgressCard
              key={project.id}
              project={project}
              users={users}
              onViewProject={onViewProject}
              onDeleteProject={onDeleteProject}
              onReviewAdminReports={onReviewAdminReports}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function UseCaseAssignmentsTab({ useCases, projects, users, onAssignExperts, onDeleteUseCase, loading }: any) {
  const handleDelete = async (project: Project) => {
    const confirmed = window.confirm(`Are you sure you want to delete the project "${project.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    if (onDeleteUseCase) {
      onDeleteUseCase(project.id); // Triggers parent's generic delete, likely needs fixing if it specifically deleted UseCase previously
    }
  };

  // Safe failover checking valid projects
  const filteredProjects = projects || [];

  return (
    <>
      <div className="bg-[#050b14] border-b border-white/10 px-8 py-6">
        <h1 className="text-2xl font-bold text-white mb-1">Use Case Assignments</h1>
        <p className="text-slate-400">Manage expert assignments for specific use cases</p>
      </div>

      <div className="px-8 py-6">
        <div className="bg-[#050b14]/50 rounded-lg border border-white/10 overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <table className="w-full">
            <thead className="bg-[#0a1122] border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Use Case</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Experts</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                // Loading skeleton
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-900 rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-800 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-800 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-800 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No projects found for assignment. Please create a project first.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project: Project) => {
                  const useCaseIdStr = project.useCase as unknown as string;
                  const linkedUseCase = useCases.find((uc: UseCase) => uc.id === useCaseIdStr);
                  // Identify owner
                  let ownerIdStr = linkedUseCase?.ownerId;
                  const owner = users.find((u: User) => u.id === ownerIdStr);

                  // In the new system, assigned users to the project excludes the owner usually, or we filter them out for display
                  const expertUserIdsInProject = Array.isArray(project.assignedUsers) ? project.assignedUsers : [];
                  const assignedExperts = users.filter((u: User) =>
                    expertUserIdsInProject.includes(u.id) && u.id !== ownerIdStr
                  );

                  return (
                    <tr key={project.id} className="hover:bg-[#0a1122]">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{project.title}</div>
                        <div className="text-xs text-slate-400">{linkedUseCase?.title || 'No linked Use Case'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{owner?.name || 'Admin'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${project.status === 'ongoing' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-slate-200'}`}>
                          {project.status ? project.status.toUpperCase() : 'ONGOING'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {assignedExperts.length === 0 ? (
                            <span className="text-xs text-slate-500 italic">None</span>
                          ) : (
                            assignedExperts.map((expert: User) => (
                              <div
                                key={expert.id}
                                className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-[#050b14] flex items-center justify-center text-cyan-400 text-xs font-medium"
                                title={`${expert.name} (${expert.role})`}
                              >
                                {expert.name.charAt(0)}
                              </div>
                            ))
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onAssignExperts(project)}
                            className="px-3 py-1.5 text-xs font-medium bg-[#0b1221]/5 border border-white/10 text-slate-300 rounded-lg hover:bg-[#0b1221]/10 hover:text-white transition-colors"
                          >
                            Manage Team
                          </button>
                          <button
                            onClick={() => handleDelete(project)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ProjectCreationTab({ users, useCases = [], onCreateProject, onClose }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedUseCaseId, setSelectedUseCaseId] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);
  const [autoUseCaseOwnerId, setAutoUseCaseOwnerId] = useState<string>('');

  // ⚠️ NEW STATES: Added for 7 Core Questions
  const [requester, setRequester] = useState('');
  const [inspectionReason, setInspectionReason] = useState('');
  const [relevantFor, setRelevantFor] = useState('');
  const [isMandatory, setIsMandatory] = useState('');
  const [conditionsToAnalyze, setConditionsToAnalyze] = useState('');
  const [resultsUsage, setResultsUsage] = useState('');
  const [resultsSharing, setResultsSharing] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const effectiveTeam = Array.from(new Set([
      ...selectedTeam,
      ...(autoUseCaseOwnerId ? [autoUseCaseOwnerId] : [])
    ]));

    if (effectiveTeam.length === 0) {
      alert("Please assign at least one team member (Expert or Owner) to create a project.");
      return;
    }

    // ⚠️ UPDATED onCreateProject call: inspectionContext added
    onCreateProject({
      title,
      shortDescription: description.substring(0, 100),
      fullDescription: description,
      targetDate,
      assignedUsers: effectiveTeam,
      useCase: selectedUseCaseId || undefined,
      inspectionContext: {
        requester,
        inspectionReason,
        relevantFor,
        isMandatory,
        conditionsToAnalyze,
        resultsUsage,
        resultsSharing
      }
    });

    // Clear fields
    setTitle('');
    setDescription('');
    setTags('');
    setTargetDate('');
    setSelectedUseCaseId('');
    setSelectedTeam([]);
    setAutoUseCaseOwnerId('');
    setRequester('');
    setInspectionReason('');
    setRelevantFor('');
    setIsMandatory('');
    setConditionsToAnalyze('');
    setResultsUsage('');
    setResultsSharing('');
  };

  const toggleUser = (userId: string) => {
    if (selectedTeam.includes(userId)) {
      setSelectedTeam(selectedTeam.filter(id => id !== userId));
    } else {
      setSelectedTeam([...selectedTeam, userId]);
    }
  };

  // Hide use-case-owner in Admin Create Project screen.
  // If UseCase is selected, owner is automatically assigned (autoUseCaseOwnerId).
  const experts = users.filter((u: User) => u.role !== 'admin' && u.role !== 'use-case-owner');

  return (
    <>
      <div className="bg-[#050b14] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Create New Project</h1>
          <p className="text-slate-400">Initialize a new evaluation project linked to a Use Case</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-slate-500 hover:text-slate-300 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* 1. Project Info Section */}
            <div className="bg-[#050b14]/50 p-6 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] space-y-6">

              <div className="bg-[#050b14]/50 border-white/10 text-cyan-400">
                <label className="block text-sm font-medium mb-2 text-cyan-400 flex items-center">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Link to a Use Case (Optional)
                </label>
                <select
                  value={selectedUseCaseId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedUseCaseId(id);
                    if (id) {
                      const uc = useCases.find((u: UseCase) => u.id === id);
                      if (uc) {
                        setTitle(uc.title);
                        setDescription(uc.description);
                        // Automatically assign use case owner (without showing in list)
                        setAutoUseCaseOwnerId((uc as any).ownerId || '');
                      }
                    } else {
                      setAutoUseCaseOwnerId('');
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-[#0a1122] text-white placeholder-gray-500"
                >
                  <option value="">Select a submitted Use Case...</option>
                  {useCases.map((uc: UseCase) => (
                    <option key={uc.id} value={uc.id}>
                      {uc.title} (Owner: {users.find((u: User) => u.id === uc.ownerId)?.name || 'Unknown'})
                    </option>
                  ))}
                </select>
                {autoUseCaseOwnerId && (
                  <div className="mt-2 text-xs text-cyan-400">
                    Use Case owner will be assigned automatically:{" "}
                    <span className="font-medium">
                      {users.find((u: User) => u.id === autoUseCaseOwnerId)?.name || 'Unknown'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Project Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Cardiac AI Diagnosis System"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Describe the AI system and evaluation goals..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Target Date *</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">Category Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="medical, finance..."
                  />
                </div>
              </div>

            </div>

            {/* 2. Project Context and Scope Questions (7 Soru) */}
            <div className="bg-[#050b14]/50 p-6 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3 mb-4">Project Context and Scope</h2>

              {/* Soru 1: Who requested the inspection? */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">1. Who requested the inspection?</label>
                <input
                  type="text"
                  value={requester}
                  onChange={(e) => setRequester(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Legal Department, Product Owner, Regulatory Body"
                />
              </div>

              {/* Soru 2: Why carry out an inspection? */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">2. Why carry out an inspection?</label>
                <input
                  type="text"
                  value={inspectionReason}
                  onChange={(e) => setInspectionReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Compliance check, Risk mitigation, Public trust building"
                />
              </div>

              {/* Soru 3: For whom is the inspection relevant? */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">3. For whom is the inspection relevant?</label>
                <input
                  type="text"
                  value={relevantFor}
                  onChange={(e) => setRelevantFor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Internal auditors, Customers, Regulators"
                />
              </div>

              {/* Soru 4: Is it recommended or required (mandatory inspection)? */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">4. Is it recommended or required (mandatory inspection)?</label>
                <select
                  value={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select one...</option>
                  <option value="recommended">Recommended</option>
                  <option value="mandatory">Required (Mandatory)</option>
                </select>
              </div>

              {/* Soru 5: What are the sufficient vs. necessary conditions that need to be analyzed? */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">5. What are the sufficient vs. necessary conditions that need to be analyzed?</label>
                <textarea
                  value={conditionsToAnalyze}
                  onChange={(e) => setConditionsToAnalyze(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Minimum legal requirements (necessary), Best practice standards (sufficient)"
                />
              </div>

              {/* Soru 6: How are the inspection results to be used? */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">6. How are the inspection results to be used? (e.g. verification, certification, sanctions)</label>
                <input
                  type="text"
                  value={resultsUsage}
                  onChange={(e) => setResultsUsage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Internal risk report, External certification for compliance"
                />
              </div>

              {/* Soru 7: Will the results be shared (public) or kept private? */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-300">7. Will the results be shared (public) or kept private? (If private, why?)</label>
                <textarea
                  value={resultsSharing}
                  onChange={(e) => setResultsSharing(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#0a1122] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="e.g., Public (for transparency), Private (due to sensitive trade secrets)"
                />
              </div>
            </div>
            {/* End of Project Context Section */}


            {/* 3. Assignment Section (Team Assignment) - Updated View */}
            <div className="bg-[#050b14]/50 p-6 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-300">
                  Assign Evaluation Team (Experts & Owners) *
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-white/10 rounded-lg p-3 bg-[#0a1122]">

                  {experts.length === 0 ? (
                    <div className="text-sm text-slate-500 text-center py-4">No users available for assignment.</div>
                  ) : (
                    experts.map((user: User) => (
                      <label
                        key={user.id}
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${selectedTeam.includes(user.id) ? 'bg-cyan-500/10 border border-blue-500/30' : 'hover:bg-[#0b1221]/5'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedTeam.includes(user.id)}
                          onChange={() => toggleUser(user.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3"
                        />
                        <div className="flex items-center flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#1a2333] flex items-center justify-center text-sm text-slate-400 mr-3 font-medium border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm text-white font-medium">{user.name}</span>
                          <span className={`text-xs ml-auto px-2 py-0.5 rounded-full capitalize ${user.role !== 'use-case-owner' && user.role !== 'admin' ? 'bg-green-900/30 text-green-400' : 'bg-orange-900/30 text-orange-400'
                            }`}>
                            {user.role.replace('-', ' ')}
                          </span>
                        </div>
                        {selectedTeam.includes(user.id) && <CheckCircle2 className="w-4 h-4 text-blue-600 ml-3" />}
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* End of Assignment Section */}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function CreatedReportsTab({ projects, currentUser, onViewProject }: any) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [filterProjectId, setFilterProjectId] = useState<string>('');

  // Fetch all reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const userId = currentUser.id || (currentUser as any)._id;
      if (!userId) {
        console.error('❌ No userId available for CreatedReportsTab');
        setLoading(false);
        return;
      }
      const url = filterProjectId
        ? api(`/api/reports?userId=${userId}&projectId=${filterProjectId}`)
        : api(`/api/reports?userId=${userId}`);
      console.log('📥 [CreatedReportsTab] Fetching reports from:', url);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [CreatedReportsTab] Reports fetched:', data.length);
        setReports(data);
      } else {
        const errorText = await response.text();
        console.error('❌ [CreatedReportsTab] Failed to fetch reports:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ [CreatedReportsTab] Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // View report
  const handleViewReport = async (reportId: string) => {
    if (onViewReport) {
      onViewReport(reportId);
      return;
    }
    
    // Fallback: show inline modal if onViewReport not provided
    try {
      const userId = currentUser.id || (currentUser as any)._id;
      const response = await fetch(api(`/api/reports/${reportId}?userId=${userId}`));
      if (response.ok) {
        const data = await response.json();
        setSelectedReport(data);
      } else {
        alert('Report could not be loaded');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Report could not be loaded');
    }
  };

  // Download report as PDF
  const handleDownloadPDF = async (reportId: string, reportTitle: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent card click event
    }

    const button = e?.currentTarget as HTMLButtonElement;
    const originalText = button?.textContent;
    if (button) {
      button.disabled = true;
      button.textContent = 'Downloading...';
    }

    try {
      const userId = currentUser?.id || (currentUser as any)?._id;
      // Use /download-pdf endpoint which always uses latest data
      const response = await fetch(api(`/api/reports/${reportId}/download-pdf?userId=${userId}`));
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const fileName = `${reportTitle.replace(/[^a-z0-9]/gi, '_')}_${reportId}.pdf`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        const error = await response.json();
        alert('PDF download failed: ' + (error.error || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      alert('PDF download failed: ' + (error.message || 'Unknown error'));
    } finally {
      if (button) {
        button.disabled = false;
        if (originalText) {
          button.textContent = originalText;
        }
      }
    }
  };



  // Delete report
  const handleDeleteReport = async (reportId: string, reportTitle: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Prevent card click event
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete the report "${reportTitle}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      const userId = currentUser.id || (currentUser as any)._id;
      const response = await fetch(api(`/api/reports/${reportId}?userId=${userId}`), {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('✅ Report deleted successfully');
        fetchReports(); // Refresh reports list
        if (selectedReport && (selectedReport._id === reportId || selectedReport.id === reportId)) {
          setSelectedReport(null); // Close modal if deleted report is being viewed
        }
      } else {
        const error = await response.json();
        alert('❌ Error: ' + (error.error || 'Failed to delete report'));
      }
    } catch (error: any) {
      console.error('Error deleting report:', error);
      alert('❌ Error: ' + (error.message || 'Failed to delete report'));
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterProjectId]);

  return (
    <>
      <div className="bg-[#050b14] border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Created Reports</h1>
            <p className="text-slate-400">View created reports</p>
          </div>
          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            className="px-4 py-2 bg-[#0a1122] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Projects</option>
            {projects.map((p: any) => (
              <option key={p.id || p._id} value={p.id || p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Reports List */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Created Reports</h2>
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/30 rounded-lg">
              <p className="text-slate-400 mb-2">No reports created yet</p>
              <p className="text-sm text-slate-500">You can create reports from the project detail page</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report: any) => {
                const reportId = report._id || report.id;
                const projectTitle = report.projectId?.title || 'Unknown Project';
                const generatedBy = report.generatedBy?.name || 'System';
                const generatedAt = new Date(report.generatedAt || report.createdAt).toLocaleString('en-US');

                return (
                  <div
                    key={reportId}
                    className="bg-[#050b14]/50 border border-white/10 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:border-cyan-500/30 transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          if (onViewProject && report.projectId) {
                            const rawId = report.projectId?._id || report.projectId?.id || report.projectId;
                            const projectId = rawId?.toString();
                            const fullProject = projects.find((p: any) => p.id?.toString() === projectId || p._id?.toString() === projectId);
                            if (fullProject) {
                              onViewProject({ ...fullProject, openReportsTab: true } as any);
                            } else {
                              handleViewReport(reportId);
                            }
                          } else {
                            handleViewReport(reportId);
                          }
                        }}
                      >
                        <h3 className="font-medium text-white mb-1">{report.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{projectTitle}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Created by: {generatedBy}</span>
                          <span>•</span>
                          <span>{generatedAt}</span>
                          {report.metadata && (
                            <>
                              <span>•</span>
                              <span>{report.metadata.totalScores || 0} scores</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const rawId = report.projectId?._id || report.projectId?.id || report.projectId;
                          const projectId = rawId?.toString();
                          const fullProject = projects.find((p: any) => p.id?.toString() === projectId || p._id?.toString() === projectId);
                          return (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onViewProject && fullProject) {
                                    onViewProject({ ...fullProject, openReportsTab: true } as any);
                                  }
                                }}
                                className="px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-900/20 rounded-lg transition-colors flex items-center gap-2"
                                title="View Unified Reports"
                              >
                                <Database className="h-4 w-4" />
                                Unified View
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onViewProject && fullProject) {
                                    // Switch to admin-report-review
                                    onViewProject({ ...fullProject, openAdminReview: true } as any);
                                  }
                                }}
                                className="px-3 py-1.5 text-sm text-amber-500 hover:bg-amber-900/20 rounded-lg transition-colors flex items-center gap-2 font-medium"
                                title="Review and Publish Reports"
                              >
                                <Database className="h-4 w-4" />
                                Review & Publish
                              </button>
                            </>
                          );
                        })()}
                        <button
                          onClick={(e) => handleDownloadPDF(reportId, report.title, e)}
                          className="px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
                          title="Download Expert PDF"
                        >
                          <Download className="h-4 w-4" />
                          Expert PDF
                        </button>

                        <button
                          onClick={(e) => handleDeleteReport(reportId, report.title, e)}
                          className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                        {report.status === 'final' || report.status === 'archived' ? (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${report.status === 'final' ? 'bg-green-900/30 text-green-400' :
                            'bg-gray-800 text-gray-300'
                            }`}>
                            {report.status === 'final' ? 'Final' : 'Archived'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#050b14] border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
                <p className="text-sm text-slate-400 mt-1">
                  {selectedReport.projectId?.title} • {new Date(selectedReport.generatedAt || selectedReport.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none prose-invert whitespace-pre-wrap text-slate-300">
                {(() => {
                  const sections = (selectedReport as any).sections;
                  if (Array.isArray(sections) && sections.length > 0) {
                    const s = sections[0];
                    const expert = String(s?.expertEdit || "").trim();
                    return expert.length > 0 ? expert : (s?.aiDraft || "");
                  }
                  return (selectedReport as any).content;
                })()}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    if (selectedReport) {
                      const reportId = selectedReport._id || selectedReport.id;
                      handleDownloadPDF(reportId, selectedReport.title, e);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>

                <button
                  onClick={() => {
                    if (selectedReport) {
                      const reportId = selectedReport._id || selectedReport.id;
                      handleDeleteReport(reportId, selectedReport.title);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Report
                </button>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-gray-800 text-slate-300 rounded-lg hover:bg-gray-700"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReportsTab({ projects, currentUser, users }: any) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState<string | null>(null);

  const [showGeneratingMessage, setShowGeneratingMessage] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [filterProjectId, setFilterProjectId] = useState<string>('');
  const [projectProgresses, setProjectProgresses] = useState<Record<string, number>>({});
  const [selectedProjectForReports, setSelectedProjectForReports] = useState<string | null>(null);

  // Fetch all reports
  const fetchReports = async () => {
    try {
      setLoading(true);
      const userId = currentUser.id || (currentUser as any)._id;
      if (!userId) {
        console.error('❌ No userId available for ReportsTab');
        setLoading(false);
        return;
      }
      const url = filterProjectId
        ? api(`/api/reports?userId=${userId}&projectId=${filterProjectId}`)
        : api(`/api/reports?userId=${userId}`);
      console.log('📥 [ReportsTab] Fetching reports from:', url);
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ [ReportsTab] Reports fetched:', data.length);
        setReports(data);
      } else {
        const errorText = await response.text();
        console.error('❌ [ReportsTab] Failed to fetch reports:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ [ReportsTab] Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate Expert report for a project
  const handleGenerateReport = async (projectId: string) => {
    try {
      setGenerating(projectId);
      setShowGeneratingMessage(true);
      const userId = currentUser?.id || currentUser?._id;
      const response = await fetch(api('/api/reports/generate-atomic'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ projectId, questionnaireKey: null })
      });

      if (response.ok) {
        setShowGeneratingMessage(false);
        alert('✅ Expert Report generated successfully!');
        fetchReports();
      } else {
        const error = await response.json().catch(() => ({}));
        setShowGeneratingMessage(false);
        alert('❌ Error: ' + (error.error || 'Failed to generate expert report'));
      }
    } catch (error: any) {
      console.error('Error generating expert report:', error);
      setShowGeneratingMessage(false);
      alert('❌ Error: ' + (error.message || 'Failed to generate report'));
    } finally {
      setGenerating(null);
    }
  };





  // Fetch progress for all projects (admin view) - same team-average logic as Project Detail
  useEffect(() => {
    const fetchAllProgresses = async () => {
      if (!projects || projects.length === 0 || !users || users.length === 0) {
        setProjectProgresses({});
        return;
      }

      const progresses: Record<string, number> = {};

      await Promise.all(
        projects.map(async (project: any) => {
          const projectId = project.id || (project as any)._id;

          if (!project.assignedUsers || project.assignedUsers.length === 0) {
            progresses[projectId] = 0;
            return;
          }

          try {
            const assignedUserIds = project.assignedUsers;

            const contributorIds = assignedUserIds.filter((userId: string) => {
              const user = users.find((u: any) => (u.id || (u as any)._id) === userId);
              if (!user) return false;
              return isProgressContributorForAdminDashboard(user.role);
            });

            if (contributorIds.length === 0) {
              progresses[projectId] = 0;
              return;
            }

            const progressPromises = contributorIds.map(async (userId: string) => {
              const user = users.find((u: any) => (u.id || (u as any)._id) === userId);
              if (!user) return 0;

              try {
                const { fetchUserProgress } = await import('../utils/userProgress');
                const progress = await fetchUserProgress(project, user);
                return typeof progress === 'number' ? progress : 0;
              } catch (error) {
                console.error(`Error fetching progress for user ${userId}:`, error);
                return 0;
              }
            });

            const progressesList = await Promise.all(progressPromises);
            const sum = progressesList.reduce((acc, p) => acc + (typeof p === 'number' ? p : 0), 0);
            const avg = sum / contributorIds.length;

            progresses[projectId] = Math.max(0, Math.min(100, Math.round(avg)));
          } catch (error) {
            console.error(`Error calculating progress for project ${projectId}:`, error);
            progresses[projectId] = 0;
          }
        })
      );

      setProjectProgresses(progresses);
    };

    if (projects.length > 0 && users && users.length > 0) {
      fetchAllProgresses();
      const interval = setInterval(fetchAllProgresses, 30000); // Changed for performance
      return () => clearInterval(interval);
    } else {
      setProjectProgresses({});
    }
  }, [projects, users]);

  useEffect(() => {
    fetchReports();
  }, [filterProjectId]);

  return (
    <>
      {/* Generating Message Overlay */}
      {showGeneratingMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#050b14] border border-white/10 rounded-lg p-6 max-w-md mx-4 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <h3 className="text-lg font-semibold text-white">Generating Report</h3>
                <p className="text-sm text-slate-400 mt-1">Your report is being generated. Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#050b14] border-b border-white/10 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">AI Generated Reports</h1>
            <p className="text-slate-400">AI-generated analysis reports</p>
          </div>
          <select
            value={filterProjectId}
            onChange={(e) => setFilterProjectId(e.target.value)}
            className="px-4 py-2 bg-[#0a1122] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Projects</option>
            {projects.map((p: any) => (
              <option key={p.id || p._id} value={p.id || p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Projects List - Generate Reports */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Generate Reports for Projects</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => {
              const projectId = project.id || project._id;
              const isGenerating = generating === projectId;
              const projectReports = reports.filter((r: any) =>
                (r.projectId?._id || r.projectId) === projectId
              );
              const projectProgress = projectProgresses[projectId] ?? project.progress ?? 0;
              const isComplete = projectProgress >= 100;
              const canGenerate = isComplete && !isGenerating;

              return (
                <div
                  key={projectId}
                  className={`bg-[#050b14]/50 border rounded-lg p-4 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] transition-shadow ${
                    selectedProjectForReports === projectId
                      ? 'border-blue-500/60 ring-1 ring-blue-500/30'
                      : 'border-white/10 hover:border-cyan-500/30'
                  }`}
                >
                  <h3 className="font-medium text-white mb-2 truncate">{project.title}</h3>
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {project.shortDescription || project.fullDescription || 'No description'}
                  </p>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="font-medium text-gray-300">{projectProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-gray-600'}`}
                        style={{ width: `${Math.min(100, projectProgress)}%`, minWidth: projectProgress > 0 ? '8px' : '0' }}
                      />
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mb-3">{projectReports.length} report(s)</div>

                  {/* Buttons row */}
                  <div className="flex flex-col gap-2">
                    {/* Generate buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateReport(projectId)}
                        disabled={!canGenerate || generating === projectId}
                        className={`flex-1 px-2 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                          !canGenerate || generating === projectId
                            ? 'bg-gray-800 text-slate-500 cursor-not-allowed'
                            : 'bg-green-700 text-white hover:bg-green-600'
                        }`}
                        title={!isComplete ? 'Complete the project first' : 'Generate Expert Evaluation Report'}
                      >
                        <FileText className="w-3 h-3" />
                        {generating === projectId ? 'Generating...' : 'Expert Report'}
                      </button>


                    </div>

                    {/* Show Reports button */}
                    <button
                      onClick={() => setSelectedProjectForReports(selectedProjectForReports === projectId ? null : projectId)}
                      className="w-full px-2 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1 bg-blue-700/50 text-blue-300 hover:bg-blue-700 border border-blue-600/30"
                    >
                      <BarChart3 className="w-3 h-3" />
                      {selectedProjectForReports === projectId ? 'Hide Report' : 'Show Report'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unified Reports Panel - shown when a project is selected */}
        {selectedProjectForReports && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Reports — {projects.find((p: any) => (p.id || p._id) === selectedProjectForReports)?.title}
              </h2>
              <button
                onClick={() => setSelectedProjectForReports(null)}
                className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Close
              </button>
            </div>
            <UnifiedReportViewer
              projectId={selectedProjectForReports}
              userId={currentUser.id || (currentUser as any)._id}
              onViewExpertReport={(reportId) => {
                // Fetch the full report and open the modal
                handleViewReport(reportId);
              }}
              currentUserRole={currentUser.role}
              onReviewReports={() => {
                const project = projects.find((p: any) => p.id === selectedProjectForReports || p._id === selectedProjectForReports);
                if (project && onViewProject) {
                  onViewProject({ ...project, openAdminReview: true } as any);
                }
              }}
            />
          </div>
        )}

        {/* Reports List */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Created Reports</h2>
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/30 rounded-lg">
              <p className="text-slate-400 mb-2">No reports created yet</p>
              <p className="text-sm text-slate-500">You can create reports for the projects above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report: any) => {
                const reportId = report._id || report.id;
                const projectTitle = report.projectId?.title || 'Unknown Project';
                const generatedBy = report.generatedBy?.name || 'System';
                const generatedAt = new Date(report.generatedAt || report.createdAt).toLocaleString('en-US');

                return (
                  <div
                    key={reportId}
                    className="bg-[#050b14]/50 border border-white/10 rounded-lg p-4 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:border-cyan-500/30 transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          const projectId = report.projectId?._id || report.projectId?.id || report.projectId;
                          if (projectId) {
                            setSelectedProjectForReports(projectId);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          } else {
                            handleViewReport(reportId);
                          }
                        }}
                      >
                        <h3 className="font-medium text-white mb-1">{report.title}</h3>
                        <p className="text-sm text-slate-400 mb-2">{projectTitle}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>Created by: {generatedBy}</span>
                          <span>•</span>
                          <span>{generatedAt}</span>
                          {report.metadata && (
                            <>
                              <span>•</span>
                              <span>{report.metadata.totalScores || 0} scores</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleDownloadPDF(reportId, report.title, e)}
                          className="px-3 py-1.5 text-sm text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                          PDF
                        </button>

                        <button
                          onClick={(e) => handleDeleteReport(reportId, report.title, e)}
                          className="px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                        {report.status === 'final' || report.status === 'archived' ? (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${report.status === 'final' ? 'bg-green-900/30 text-green-400' :
                            'bg-gray-800 text-gray-300'
                            }`}>
                            {report.status === 'final' ? 'Final' : 'Archived'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Report View Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#050b14] border border-white/10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
                <p className="text-sm text-slate-400 mt-1">
                  {selectedReport.projectId?.title} • {new Date(selectedReport.generatedAt || selectedReport.createdAt).toLocaleString('tr-TR')}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none prose-invert whitespace-pre-wrap text-slate-300">
                {(() => {
                  const sections = (selectedReport as any).sections;
                  if (Array.isArray(sections) && sections.length > 0) {
                    const s = sections[0];
                    const expert = String(s?.expertEdit || "").trim();
                    return expert.length > 0 ? expert : (s?.aiDraft || "");
                  }
                  return (selectedReport as any).content;
                })()}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    if (selectedReport) {
                      const reportId = selectedReport._id || selectedReport.id;
                      handleDownloadPDF(reportId, selectedReport.title, e);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>

                <button
                  onClick={() => {
                    if (selectedReport) {
                      const reportId = selectedReport._id || selectedReport.id;
                      handleDeleteReport(reportId, selectedReport.title);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Report
                </button>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-gray-800 text-slate-300 rounded-lg hover:bg-gray-700"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Assign Experts Modal
interface AssignExpertsModalProps {
  project?: Project;
  useCase: UseCase;
  users: User[];
  onClose: () => void;
  onAssign: (expertIds: string[], notes: string) => void;
}

function AssignExpertsModal({ project, useCase, users, onClose, onAssign }: AssignExpertsModalProps) {
  // Use project.assignedUsers as source of truth for selected experts if available
  const initialExperts = project?.assignedUsers || useCase.assignedExperts || [];
  const [selectedExperts, setSelectedExperts] = useState<string[]>(initialExperts);
  const [adminNotes, setAdminNotes] = useState(project?.adminNotes || useCase.adminNotes || '');

  const experts = users.filter(u => u.role !== 'admin' && u.role !== 'use-case-owner');

  const toggleExpert = (expertId: string) => {
    if (selectedExperts.includes(expertId)) {
      setSelectedExperts(selectedExperts.filter(id => id !== expertId));
    } else {
      setSelectedExperts([...selectedExperts, expertId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(selectedExperts, adminNotes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#050b14] rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.1)] border border-white/10 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0a1122] flex-shrink-0">
          <h2 className="text-lg font-bold text-white">Assign Evaluation Team</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Use Case</div>
            <div className="text-base font-medium text-white">{useCase.title}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-slate-300">Select Experts</label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-white/10 rounded-lg p-2 bg-[#0a1122]">
              {experts.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-2">No experts available to assign.</div>
              ) : (
                experts.map(expert => (
                  <label
                    key={expert.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedExperts.includes(expert.id)
                      ? 'bg-cyan-500/10 border border-blue-500/30'
                      : 'hover:bg-[#050b14] border border-transparent'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedExperts.includes(expert.id)}
                      onChange={() => toggleExpert(expert.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mr-3 border-white/20"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{expert.name}</div>
                      <div className="text-xs text-slate-400 capitalize">{expert.role.replace('-', ' ')}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Instructions / Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Specific instructions for the evaluation team..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-gray-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════
   ADMIN-ONLY: Platform Info Tab
   Technical architecture & scoring details removed from
   the public homepage — visible only to admin users.
═══════════════════════════════════════════════════════ */
function AdminPlatformInfoTab() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#050b14] p-6 md:p-10 space-y-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <BarChart3 className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest">Admin Only</p>
          <h2 className="text-2xl font-bold text-white">Platform Technical Info</h2>
        </div>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
        This section is visible to administrators only. It contains detailed information about the platform's system architecture and risk scoring methodology.
      </p>

      {/* ── Section 1: System Architecture ── */}
      <section className="rounded-3xl border border-white/10 bg-[#070e1a] overflow-hidden p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <span className="text-indigo-400 text-lg">🏗️</span>
          </div>
          <div>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest">System Architecture</p>
            <h3 className="text-xl font-bold text-white">How the System Components Communicate</h3>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {[
            { color: 'bg-sky-400', label: 'Frontend' },
            { color: 'bg-indigo-400', label: 'Backend API' },
            { color: 'bg-violet-400', label: 'AI / Ontology Engine' },
            { color: 'bg-emerald-400', label: 'Data Layer' },
            { color: 'bg-amber-400', label: 'Output' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
              <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>

        {/* ─── Flow Diagram ─── */}
        <div className="relative">
          {/* Subtle bg grid */}
          <div className="absolute inset-0 opacity-[0.025] rounded-2xl"
            style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 py-4">

            {/* ROW 1: Expert User */}
            <div className="flex justify-center mb-4">
              <ArchDiagramNode color="sky" icon="👤" title="Expert User" sub="Multi-role team" />
            </div>
            <ArchDiagramArrow label="HTTPS / REST" />

            {/* ROW 2: React Frontend */}
            <div className="flex justify-center mb-4">
              <ArchDiagramNode color="sky" icon="⚛️" title="React + Vite" sub="Frontend Application" badge="TypeScript" />
            </div>
            <ArchDiagramArrow label="REST API calls" />

            {/* ROW 3: Node.js hub with branches */}
            <div className="flex items-start justify-center gap-6 mb-4 flex-wrap md:flex-nowrap">
              {/* Left branch: MongoDB */}
              <div className="flex flex-col items-center w-40">
                <div className="h-16 w-[2px] bg-gradient-to-b from-indigo-500/50 to-emerald-500/50" />
                <ArchDiagramNode color="emerald" icon="🍃" title="MongoDB Atlas" sub="Users · Projects · Responses" badge="NoSQL" small />
              </div>
              {/* Center: Node.js */}
              <div className="flex flex-col items-center">
                <ArchDiagramNode color="indigo" icon="🟢" title="Node.js + Express" sub="REST Backend API" badge="Core Hub" large />
              </div>
              {/* Right branch: Resend */}
              <div className="flex flex-col items-center w-40">
                <div className="h-16 w-[2px] bg-gradient-to-b from-indigo-500/50 to-amber-500/50" />
                <ArchDiagramNode color="amber" icon="📧" title="Resend API" sub="Email verification & welcome" badge="External" small />
              </div>
            </div>

            <ArchDiagramArrow label="HTTP → FastAPI Ontology Service" color="violet" />

            {/* ROW 4: FastAPI hub with branches */}
            <div className="flex items-start justify-center gap-6 mb-4 flex-wrap md:flex-nowrap">
              {/* Left: OWL Reasoner */}
              <div className="flex flex-col items-center w-44">
                <div className="h-16 w-[2px] bg-gradient-to-b from-violet-500/50 to-violet-400/50" />
                <ArchDiagramNode color="violet" icon="🧠" title="OWL/SWRL Reasoner" sub="Formal logic inference" badge="Hermit / Pellet" small />
              </div>
              {/* Center: FastAPI */}
              <div className="flex flex-col items-center">
                <ArchDiagramNode color="violet" icon="⚡" title="FastAPI + Python" sub="Ontology Reasoning Engine" badge="AI Core" large />
              </div>
              {/* Right: Neo4j */}
              <div className="flex flex-col items-center w-44">
                <div className="h-16 w-[2px] bg-gradient-to-b from-violet-500/50 to-emerald-500/50" />
                <ArchDiagramNode color="emerald" icon="🕸️" title="Neo4j Graph DB" sub="Knowledge Graph · Cypher queries" badge="GraphDB" small />
              </div>
            </div>

            <ArchDiagramArrow label="Ontology conclusions → GraphRAG context" color="amber" />

            {/* ROW 5: Gemini LLM */}
            <div className="flex justify-center mb-4">
              <ArchDiagramNode color="amber" icon="✨" title="Google Gemini LLM" sub="GraphRAG narrative generation only" badge="Presentation Layer" />
            </div>

            <ArchDiagramArrow label="Structured report data" color="rose" />

            {/* ROW 6: PDF Report */}
            <div className="flex justify-center">
              <ArchDiagramNode color="rose" icon="📄" title="PDF / DOCX Report" sub="Regulatory-ready export" badge="EU AI Act Compliant" />
            </div>
          </div>
        </div>

        {/* Data flow key */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          {([
            { from: 'Expert Input', to: 'Node.js', via: 'React forms & questionnaires', color: 'border-sky-500/20 bg-sky-500/5', accent: 'text-sky-400' },
            { from: 'Node.js', to: 'FastAPI', via: 'Structured JSON answers via REST', color: 'border-violet-500/20 bg-violet-500/5', accent: 'text-violet-400' },
            { from: 'Ontology Engine', to: 'Gemini', via: 'Only logical facts — no hallucination', color: 'border-amber-500/20 bg-amber-500/5', accent: 'text-amber-400' },
          ] as const).map((row, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${row.color}`}>
              <div className={`text-xs font-bold mb-2 ${row.accent}`}>{row.from} → {row.to}</div>
              <p className="text-slate-400 text-xs leading-relaxed">{row.via}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: Risk Score Calculator ── */}
      <section className="rounded-3xl border border-white/10 bg-[#070e1a] overflow-hidden p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
            <span className="text-rose-400 text-lg">📐</span>
          </div>
          <div>
            <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest">Scoring Methodology</p>
            <h3 className="text-xl font-bold text-white">How the Risk Score is Calculated</h3>
          </div>
        </div>

        {/* Core formula */}
        <div className="rounded-2xl border border-white/10 bg-[#040910] p-8 text-center mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-5">Per-question Ethical Risk Contribution</p>
          <div className="font-mono text-2xl md:text-3xl font-bold flex flex-wrap items-center justify-center gap-3">
            <span className="text-amber-400">Risk</span>
            <span className="text-slate-600">=</span>
            <span className="text-indigo-400">Importance</span>
            <span className="text-slate-600">×</span>
            <span className="text-rose-400">(1 − Answer Score)</span>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-6 text-xs text-slate-500">
            <span><span className="text-indigo-400 font-semibold">Importance</span> — expert priority weight, 1 (low) to 4 (critical)</span>
            <span><span className="text-rose-400 font-semibold">Answer Score</span> — compliance level, 0.0 (none) to 1.0 (full)</span>
          </div>
        </div>

        {/* 3-step aggregation */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {([
            { step: '1', color: 'border-indigo-500/20 bg-indigo-500/5', accent: 'text-indigo-400', title: 'Per Question', formula: 'Risk = Importance × (1 − Score)', note: 'Computed for every answered question' },
            { step: '2', color: 'border-violet-500/20 bg-violet-500/5', accent: 'text-violet-400', title: 'Per Principle', formula: 'Principle Risk = Σ Question Risks', note: 'Summed across each of the 7 HLEG principles' },
            { step: '3', color: 'border-cyan-500/20 bg-cyan-500/5', accent: 'text-cyan-400', title: 'Overall', formula: 'Overall Risk = Σ Principle Risks', note: 'Final project score — no normalisation' },
          ] as const).map((s) => (
            <div key={s.step} className={`rounded-2xl border p-5 ${s.color}`}>
              <div className={`text-xs font-bold uppercase tracking-widest mb-3 ${s.accent}`}>Step {s.step} · {s.title}</div>
              <div className={`font-mono text-sm font-semibold mb-2 ${s.accent}`}>{s.formula}</div>
              <p className="text-slate-500 text-xs">{s.note}</p>
            </div>
          ))}
        </div>

        {/* Worked example */}
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-6">
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-4">📐 Worked Example</p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="font-mono text-xs space-y-2 text-slate-400">
              <div className="flex justify-between"><span>Question</span><span className="text-slate-300">Biometric data without consent?</span></div>
              <div className="flex justify-between"><span>Answer Score</span><span className="text-rose-400">0.0 — non-compliant</span></div>
              <div className="flex justify-between"><span>Importance</span><span className="text-indigo-400">4 — critical</span></div>
              <div className="h-px bg-[#0b1221]/5" />
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white">Risk Contribution</span>
                <span className="text-rose-400">4 × (1 − 0.0) = 4.0</span>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-slate-400 text-sm leading-relaxed">
                This single answer contributes <strong className="text-rose-300">4.0 risk units</strong> — the maximum possible — directly to the <em className="text-rose-200">Privacy & Data Governance</em> principle and surfaces as the top driver in the final report.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Helper components for the Architecture Diagram
function ArchDiagramNode({ color, icon, title, sub, badge, small, large }: { color: string, icon: string, title: string, sub: string, badge?: string, small?: boolean, large?: boolean }) {
  const colorMap: Record<string, string> = {
    sky: 'border-sky-500/30 bg-sky-500/10 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]',
    indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]',
    violet: 'border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    rose: 'border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center rounded-2xl border backdrop-blur-sm transition-transform hover:scale-105 duration-300 ${colorMap[color]} ${small ? 'px-3 pb-3 pt-5 w-32' : large ? 'px-5 pb-5 pt-7 w-56' : 'px-4 pb-4 pt-6 w-48'} ${badge ? 'mt-3' : ''}`}>
      <div className={`flex items-center justify-center ${small ? 'text-2xl mb-1' : 'text-3xl mb-2'}`}>
        {icon}
      </div>
      {badge && (
        <div className={`absolute -top-2.5 bg-[#050b14] px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest z-10 ${colorMap[color]}`}>
          {badge}
        </div>
      )}
      <div className={`font-bold text-center text-white ${small ? 'text-xs' : 'text-sm'} leading-tight`}>{title}</div>
      <div className={`text-center opacity-80 mt-1 leading-tight ${small ? 'text-[10px]' : 'text-xs'}`}>{sub}</div>
    </div>
  );
}

function ArchDiagramArrow({ label, color = 'slate' }: { label: string, color?: string }) {
  const colorMap: Record<string, string> = {
    slate: 'bg-gradient-to-b from-slate-500/50 to-slate-400/50',
    violet: 'bg-gradient-to-b from-indigo-500/50 to-violet-500/50',
    amber: 'bg-gradient-to-b from-violet-500/50 to-amber-500/50',
    rose: 'bg-gradient-to-b from-amber-500/50 to-rose-500/50',
  };

  return (
    <div className="flex flex-col items-center justify-center h-24 relative mb-2">
      <div className={`w-[2px] h-full ${colorMap[color]} relative`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0b1221] animate-ping" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#0b1221]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/80" />
      </div>
      <div className="absolute bg-[#070e1a] px-3 py-1 rounded-full border border-white/5 text-[10px] text-slate-400 font-medium whitespace-nowrap shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-md z-10">
        {label}
      </div>
    </div>
  );
}
