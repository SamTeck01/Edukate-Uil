/**
 * Material Service — CRUD for materials, upload queue, duplicate check
 * Swap for real Supabase + Storage later.
 */
import { materials, recentMaterials, delay } from './mockData';

let _materials = [...materials];

export async function getMaterialsByCourse(courseId) {
  await delay(300);
  // In production: supabase.from('materials').select('*').eq('course_id', courseId).eq('status', 'approved')
  return _materials.filter(m => m.courseId === courseId && m.status === 'approved');
}

export async function getMaterialById(materialId) {
  await delay(200);
  return _materials.find(m => m.id === materialId) || null;
}

export async function getRecentMaterials(userId) {
  await delay(250);
  // In production: supabase.from('reading_history').select('material:materials(*)').eq('user_id', userId).order('last_read_at', { ascending: false }).limit(4)
  return recentMaterials;
}

export async function markAsCompleted(materialId, completed = true) {
  await delay(200);
  // In production: supabase.from('user_progress').upsert({ user_id, material_id, is_completed: completed })
  _materials = _materials.map(m =>
    m.id === materialId ? { ...m, isCompleted: completed } : m
  );
  return { success: true };
}

export async function updateReadProgress(materialId, lastReadPage) {
  await delay(150);
  // In production: supabase.from('user_progress').upsert({ user_id, material_id, last_read_page })
  _materials = _materials.map(m =>
    m.id === materialId ? { ...m, lastReadPage } : m
  );
  return { success: true };
}

export async function uploadMaterial(file, courseId, title) {
  await delay(1000);
  // In production:
  // 1. Generate file hash on client
  // 2. Check: supabase.from('materials').select('id').eq('file_hash', hash)
  // 3. If exists → reject
  // 4. If new → upload to storage, insert with status: 'pending'
  const fakeHash = Math.random().toString(36).substring(7);
  const existingHash = _materials.find(m => m.fileHash === fakeHash);

  if (existingHash) {
    return { material: null, error: 'This material already exists in the library.' };
  }

  const newMaterial = {
    id: `mat-${Date.now()}`,
    courseId,
    courseCode: '',
    title,
    type: 'pdf',
    pageCount: 0,
    fileUrl: '/sample.pdf',
    fileHash: fakeHash,
    uploadedBy: 'user-001',
    uploadedByName: 'Current User',
    status: 'pending',
    approvedBy: null,
    createdAt: new Date().toISOString(),
    isCompleted: false,
    lastReadPage: 0,
    readCount: 0,
  };

  _materials.push(newMaterial);
  return { material: newMaterial, error: null };
}

export async function getPendingMaterials() {
  await delay(300);
  // In production: supabase.from('materials').select('*').eq('status', 'pending')
  return _materials.filter(m => m.status === 'pending');
}

export async function approveMaterial(materialId, moderatorId) {
  await delay(400);
  // In production: supabase.from('materials').update({ status: 'approved', approved_by: moderatorId }).eq('id', materialId)
  _materials = _materials.map(m =>
    m.id === materialId ? { ...m, status: 'approved', approvedBy: moderatorId } : m
  );
  return { success: true };
}

export async function rejectMaterial(materialId) {
  await delay(400);
  _materials = _materials.map(m =>
    m.id === materialId ? { ...m, status: 'rejected' } : m
  );
  return { success: true };
}
