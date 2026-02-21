// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

// 用户类型
export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

// 认证类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// 简历类型
export interface Resume {
  id: number;
  user_id: number;
  title: string;
  template_id: string;
  content: ResumeContent;
  created_at: string;
  updated_at: string;
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  projects: Project[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: string;
  endDate?: string;
}

// 模板类型
export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  features: string[];
  defaultContent: ResumeContent;
}

// 路由类型
export type RoutePath = '/' | '/login' | '/register' | '/dashboard' | '/templates' | '/editor/:id';
