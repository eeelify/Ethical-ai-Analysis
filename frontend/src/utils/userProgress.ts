import { api } from '../api';
import { Project, User } from '../types';

/**
 * Kullanıcıya özel ilerlemeyi hesaplar (Sadece yüzde döndürür - Geriye dönük uyumluluk için).
 */
export async function fetchUserProgress(project: Project, currentUser: User): Promise<number> {
  const { progress } = await fetchUserDetailedProgress(project, currentUser);
  return progress;
}

/**
 * Kullanıcıya özel detaylı ilerlemeyi hesaplar.
 * Yeni sistem: MongoDB responses collection'ından cevaplanan soruları sayar.
 * Hem general-v1 hem de role-specific questionnaire'ları (ethical-expert-v1, medical-expert-v1, etc.) kontrol eder.
 */
export async function fetchUserDetailedProgress(project: Project, currentUser: User): Promise<{ 
  progress: number, 
  answeredQuestionnaireKeys: string[],
  questionnaireStats: Record<string, { answered: number, total: number, isCompleted: boolean }>
}> {
  try {
    const projectId = project.id || (project as any)._id;
    const userId = currentUser.id || (currentUser as any)._id;

    if (!projectId || !userId) {
      console.warn('⚠️ fetchUserDetailedProgress: Missing projectId or userId', { projectId, userId });
      return { progress: 0, answeredQuestionnaireKeys: [], questionnaireStats: {} };
    }

    // API endpoint'ini kullan
    const response = await fetch(api(`/api/user-progress?projectId=${projectId}&userId=${userId}`));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch user detailed progress:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return { progress: 0, answeredQuestionnaireKeys: [], questionnaireStats: {} };
    }

    const data = await response.json();
    const progress = data.progress || 0;
    const answeredQuestionnaireKeys = data.answeredQuestionnaireKeys || [];
    const questionnaireStats = data.questionnaireStats || {};
    
    return { progress, answeredQuestionnaireKeys, questionnaireStats };
  } catch (err) {
    console.error('❌ User detailed progress calc error', err);
    return { progress: 0, answeredQuestionnaireKeys: [], questionnaireStats: {} };
  }
}
