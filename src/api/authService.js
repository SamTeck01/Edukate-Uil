/**
 * Auth Service — handles login, signup, user profile
 * Swap the implementations for real Supabase Auth later.
 */
import { currentUser, departments, delay } from './mockData';

let _user = null;
let _isOnboarded = false;

export async function login(email, password) {
  await delay(600);
  // In production: return supabase.auth.signInWithPassword({ email, password })
  if (email && password) {
    _user = { ...currentUser, email };
    return { user: _user, error: null };
  }
  return { user: null, error: 'Invalid credentials' };
}

export async function signup(email, password, name) {
  await delay(800);
  // In production: return supabase.auth.signUp({ email, password, options: { data: { name } } })
  if (email && password && name) {
    _user = { ...currentUser, email, name, totalMaterialsRead: 0, studyStreak: 0 };
    _isOnboarded = false;
    return { user: _user, error: null };
  }
  return { user: null, error: 'All fields are required' };
}

export async function loginWithGoogle() {
  await delay(500);
  // In production: return supabase.auth.signInWithOAuth({ provider: 'google' })
  _user = { ...currentUser };
  return { user: _user, error: null };
}

export async function logout() {
  await delay(200);
  _user = null;
  return { error: null };
}

export async function getCurrentUser() {
  await delay(200);
  // In production: check supabase.auth.getUser() + fetch profile from DB
  return _user;
}

export async function updateProfile(updates) {
  await delay(400);
  // In production: supabase.from('profiles').update(updates).eq('id', user.id)
  if (_user) {
    _user = { ..._user, ...updates };
    _isOnboarded = true;
  }
  return { user: _user, error: null };
}

export async function isUserOnboarded() {
  await delay(100);
  return _isOnboarded && _user?.departmentId && _user?.level;
}

export function getDepartments() {
  return departments;
}

// Set user directly (for mock flow)
export function setMockUser(user) {
  _user = user;
  _isOnboarded = true;
}
