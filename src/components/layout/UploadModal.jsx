import { useState } from 'react';
import { X, Upload, File, Loader2 } from 'lucide-react';
import { uploadMaterial } from '../../api/materialService';
import { useToast } from '../../context/ToastContext';
import { useApp } from '../../context/AppContext';
import Button from '../shared/Button';
import './uploadmodal.css';

export default function UploadModal({ course, onClose, onUploadSuccess }) {
  const { user } = useApp();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const isModerator = user?.role === 'moderator' && user?.department_id === course?.department_id && user?.level === course?.level;
  const isAdmin = user?.role === 'admin';
  const canPublish = isAdmin || isModerator;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      if (!title) setTitle(selected.name.replace('.pdf', ''));
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) return;
    setUploading(true);
    setError(null);

    try {
      const res = await uploadMaterial(course.id, title, file);
      toast.success('Material uploaded successfully!');
      onUploadSuccess?.(res);
      onClose();
    } catch (err) {
      const msg = err.message || 'Failed to upload material.';
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="upload-modal animate-scale-in">
        <header className="upload-modal-header">
          <h3>Upload Material</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </header>

        <div className="upload-modal-body">
          <div className="visibility-indicator">
            {canPublish ? (
              <div className="visibility-badge visibility-badge--official">
                <Shield size={14} />
                <span>Official Publication (Public)</span>
              </div>
            ) : (
              <div className="visibility-badge visibility-badge--private">
                <Lock size={14} />
                <span>Private Library (For you only)</span>
              </div>
            )}
            <p className="upload-hint">
              {canPublish 
                ? `You are an authorized moderator for this level. This file will be visible to all ${course.code} students.`
                : "This document is for your personal study. It won't be visible to other students or moderators."}
            </p>
          </div>

          <div className={`file-dropzone ${file ? 'file-dropzone--active' : ''}`} onClick={() => document.getElementById('file-input').click()}>
            <input 
              id="file-input" 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            {file ? (
              <div className="file-info">
                <File size={32} className="file-icon" />
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
            ) : (
              <div className="dropzone-prompt">
                <Upload size={32} className="upload-icon" />
                <span>Click or drag PDF to upload</span>
                <span className="dropzone-sub">Maximum size: 10MB</span>
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Material Title</label>
            <input 
              type="text" 
              placeholder="e.g. Chapter 1: Introduction" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {error && <div className="upload-error">{error}</div>}
        </div>

        <footer className="upload-modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleUpload} 
            disabled={!file || !title.trim() || uploading}
          >
            {uploading ? <><Loader2 className="animate-spin" size={16} /> Uploading...</> : 'Upload PDF'}
          </Button>
        </footer>
      </div>
    </div>
  );
}
