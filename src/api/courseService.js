import { apiClient } from './apiClient';

let _departmentsCache = null;

export async function getDepartments() {
  if (_departmentsCache) return _departmentsCache;
  try {
    const data = await apiClient('/courses/departments');
    _departmentsCache = data;
    return data;
  } catch (error) {
    console.error('Failed to fetch departments:', error);
    return [];
  }
}

export async function getCourses(departmentId, level) {
  try {
    let url = '/courses';
    if (departmentId) {
      url += `?department_id=${encodeURIComponent(departmentId)}`;
    }
    const data = await apiClient(url);
    // Filter by level on client since our simple backend endpoint doesn't filter by level yet
    return level ? data.filter(c => c.level === parseInt(level)) : data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return [];
  }
}

export async function getAllCourses(departmentId) {
  return getCourses(departmentId, null);
}

export async function getCourseById(courseId) {
  try {
    // Ideally backend would have /api/courses/:id
    // But since we only have list, we fetch all and find
    const courses = await getCourses();
    return courses.find(c => c.id === courseId) || null;
  } catch (error) {
    console.error('Failed to fetch course by id:', error);
    return null;
  }
}

export async function searchCourses(query, departmentId) {
  const courses = await getCourses(departmentId, null);
  const q = query.toLowerCase();
  return courses.filter(c =>
    c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
  );
}
