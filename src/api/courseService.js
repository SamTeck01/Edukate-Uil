/**
 * Course Service — fetch courses by department/level
 * Swap for real Supabase queries later.
 */
import { courses, delay } from './mockData';

export async function getCourses(departmentId, level) {
  await delay(300);
  // In production: supabase.from('courses').select('*').eq('department_id', departmentId).eq('level', level)
  return courses.filter(c => c.departmentId === departmentId && c.level === level);
}

export async function getAllCourses(departmentId) {
  await delay(300);
  return courses.filter(c => c.departmentId === departmentId);
}

export async function getCourseById(courseId) {
  await delay(200);
  // In production: supabase.from('courses').select('*').eq('id', courseId).single()
  return courses.find(c => c.id === courseId) || null;
}

export async function searchCourses(query, departmentId) {
  await delay(250);
  const q = query.toLowerCase();
  return courses.filter(c =>
    c.departmentId === departmentId &&
    (c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
  );
}
