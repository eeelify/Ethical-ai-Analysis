// src/data/questions/index.ts

import { Question } from '../../types';

// Import question sets from other files
import { technicalQuestions } from './technical';
import { medicalQuestions } from './medical';
import { legalQuestions } from './legal';
import { ownerQuestions } from './owner';  
import { ethicalQuestions } from './ethical';

// Map which role sees which question list
const questionsMap: Record<string, Question[]> = {
  'ethical-expert': ethicalQuestions,
  'technical-expert': technicalQuestions,
  'medical-expert': medicalQuestions,
  'legal-expert': legalQuestions,
  'use-case-owner': ownerQuestions,
  'education-expert': [], // Empty array if file does not exist
  'admin': [ // Admin sees all questions
    ...ethicalQuestions, 
    ...technicalQuestions, 
    ...medicalQuestions, 
    ...legalQuestions,
    ...ownerQuestions
  ]
};

// THIS is the function called from React:
export const getQuestionsByRole = (role: string): Question[] => {
  return questionsMap[role] || [];
};