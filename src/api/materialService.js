import { apiClient } from './apiClient';

export async function getMaterialsByCourse(courseId) {
  try {
    const data = await apiClient(`/materials?course_id=${courseId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    return [];
  }
}

export async function getMaterialById(materialId) {
  try {
    const data = await apiClient(`/materials/${materialId}`);
    return data;
  } catch (error) {
    console.error('Failed to fetch material details:', error);
    return null;
  }
}

export async function getRecentMaterials() {
  try {
    const data = await apiClient('/materials/recent');
    return data;
  } catch (error) {
    console.error('Failed to fetch recent materials:', error);
    return [];
  }
}

export async function updateReadProgress(materialId, lastReadPage, isCompleted = false) {
  try {
    return await apiClient(`/materials/${materialId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ lastReadPage, isCompleted })
    });
  } catch (err) {
    console.error('Failed to update progress:', err);
  }
}

export async function uploadMaterial(courseId, title, file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('course_id', courseId);
    formData.append('title', title);

    const data = await apiClient('/materials/upload', {
      method: 'POST',
      body: formData,
    });

    return { material: data, error: null };
  } catch (error) {
    return { material: null, error: error.message };
  }
}

export function getDownloadUrl(materialId) {
  // Return the direct URL to the download endpoint
  const baseUrl = import.meta.env.VITE_API_URL;
  return `${baseUrl}/materials/${materialId}/download`;
}

// Kept for UI compatibility, will be replaced by actual logic later
export async function markAsCompleted(materialId, completed = true) {
  return updateReadProgress(materialId, 0, completed);
}

export async function getPendingMaterials() {
  return [];
}

export async function approveMaterial(materialId, moderatorId) {
  return { success: true };
}

export async function rejectMaterial(materialId) {
  return { success: true };
}
