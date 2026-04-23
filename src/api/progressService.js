/**
 * Progress Service — study stats, streaks, reading notebooks
 * Swap for real Supabase queries later.
 */
import { currentUser, readingNotebooks, delay } from './mockData';

let _notebooks = [...readingNotebooks];

export async function getStudyStats(userId) {
  await delay(200);
  // In production: aggregate from user_progress + reading_history tables
  return {
    streak: currentUser.studyStreak,
    totalRead: currentUser.totalMaterialsRead,
    totalAvailable: currentUser.totalMaterials,
    completionPercentage: Math.round(
      (currentUser.totalMaterialsRead / currentUser.totalMaterials) * 100
    ),
  };
}

export async function updateStreak(userId) {
  await delay(150);
  // In production: check last activity timestamp, increment if consecutive day
  currentUser.studyStreak += 1;
  return { streak: currentUser.studyStreak };
}

export async function getReadingNotebooks(userId) {
  await delay(300);
  // In production: supabase.from('reading_notebooks').select('*').eq('user_id', userId)
  return _notebooks.filter(n => n.userId === userId);
}

export async function createReadingNotebook(name, icon = '📚', color = '#0D9488') {
  await delay(400);
  const newNotebook = {
    id: `nb-${Date.now()}`,
    name,
    userId: currentUser.id,
    materialIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    color,
    icon,
  };
  _notebooks.push(newNotebook);
  return newNotebook;
}

export async function addToNotebook(notebookId, materialId) {
  await delay(200);
  _notebooks = _notebooks.map(n => {
    if (n.id === notebookId && !n.materialIds.includes(materialId)) {
      return {
        ...n,
        materialIds: [...n.materialIds, materialId],
        updatedAt: new Date().toISOString(),
      };
    }
    return n;
  });
  return { success: true };
}

export async function removeFromNotebook(notebookId, materialId) {
  await delay(200);
  _notebooks = _notebooks.map(n => {
    if (n.id === notebookId) {
      return {
        ...n,
        materialIds: n.materialIds.filter(id => id !== materialId),
        updatedAt: new Date().toISOString(),
      };
    }
    return n;
  });
  return { success: true };
}

export async function deleteNotebook(notebookId) {
  await delay(300);
  _notebooks = _notebooks.filter(n => n.id !== notebookId);
  return { success: true };
}
