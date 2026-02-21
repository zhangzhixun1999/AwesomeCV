import { z } from 'zod';

// 认证验证 schema
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  full_name: z.string().min(2, '姓名至少需要 2 个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少需要 8 个字符'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// 简历验证 schema
export const personalInfoSchema = z.object({
  name: z.string().min(1, '请输入姓名'),
  title: z.string().min(1, '请输入职位标题'),
  email: z.string().email('请输入有效的邮箱地址'),
  phone: z.string().min(1, '请输入电话号码'),
  location: z.string().min(1, '请输入地址'),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
  company: z.string().min(1, '请输入公司名称'),
  position: z.string().min(1, '请输入职位'),
  startDate: z.string().min(1, '请选择开始日期'),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().min(1, '请输入工作描述'),
});

export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;

export const educationSchema = z.object({
  school: z.string().min(1, '请输入学校名称'),
  degree: z.string().min(1, '请输入学位'),
  major: z.string().min(1, '请输入专业'),
  startDate: z.string().min(1, '请选择开始日期'),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;
