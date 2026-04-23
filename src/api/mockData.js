/**
 * PhySci Hub — Mock Data
 * Real Nigerian university course data. Replace with Supabase queries later.
 */

// ============================================================
// DEPARTMENTS
// ============================================================
export const departments = [
  { id: 'dept-chm', code: 'CHM', name: 'Chemistry', icon: '🧪', color: '#0D9488' },
  { id: 'dept-phy', code: 'PHY', name: 'Physics', icon: '⚛️', color: '#6366F1' },
  { id: 'dept-mth', code: 'MTH', name: 'Mathematics', icon: '📐', color: '#F59E0B' },
  { id: 'dept-csc', code: 'CSC', name: 'Computer Science', icon: '💻', color: '#3B82F6' },
  { id: 'dept-glg', code: 'GLG', name: 'Geology', icon: '🌍', color: '#D97706' },
];

export const levels = ['100L', '200L', '300L', '400L', '500L'];

// ============================================================
// COURSES
// ============================================================
export const courses = [
  // Chemistry 200L
  { id: 'crs-chm201', code: 'CHM 201', title: 'Physical Chemistry I', departmentId: 'dept-chm', level: '200L', materialCount: 10, completedCount: 4, description: 'Thermodynamics, chemical kinetics, and equilibria.', icon: '🔥' },
  { id: 'crs-chm211', code: 'CHM 211', title: 'Organic Chemistry I', departmentId: 'dept-chm', level: '200L', materialCount: 8, completedCount: 2, description: 'Nomenclature, stereochemistry, and reaction mechanisms.', icon: '🧬' },
  { id: 'crs-chm212', code: 'CHM 212', title: 'Chemistry of First-Row Transition Metals', departmentId: 'dept-chm', level: '200L', materialCount: 6, completedCount: 6, description: 'Coordination compounds, crystal field theory, spectroscopy.', icon: '⚗️' },
  { id: 'crs-chm221', code: 'CHM 221', title: 'Analytical Chemistry I', departmentId: 'dept-chm', level: '200L', materialCount: 5, completedCount: 0, description: 'Gravimetric and titrimetric analysis methods.', icon: '🔬' },
  { id: 'crs-chm231', code: 'CHM 231', title: 'Industrial Chemistry I', departmentId: 'dept-chm', level: '200L', materialCount: 7, completedCount: 3, description: 'Chemical process industries and unit operations.', icon: '🏭' },
  { id: 'crs-chm241', code: 'CHM 241', title: 'Environmental Chemistry', departmentId: 'dept-chm', level: '200L', materialCount: 4, completedCount: 1, description: 'Pollution, water treatment, and atmospheric chemistry.', icon: '🌿' },

  // Physics 200L
  { id: 'crs-phy201', code: 'PHY 201', title: 'Classical Mechanics', departmentId: 'dept-phy', level: '200L', materialCount: 9, completedCount: 5, description: 'Newtonian mechanics, oscillations, and rigid body dynamics.', icon: '🎯' },
  { id: 'crs-phy211', code: 'PHY 211', title: 'Electromagnetism I', departmentId: 'dept-phy', level: '200L', materialCount: 7, completedCount: 2, description: 'Electric fields, Gauss law, capacitors, and DC circuits.', icon: '⚡' },
  { id: 'crs-phy221', code: 'PHY 221', title: 'Thermal Physics', departmentId: 'dept-phy', level: '200L', materialCount: 6, completedCount: 0, description: 'Laws of thermodynamics, entropy, and heat engines.', icon: '🌡️' },
  { id: 'crs-phy231', code: 'PHY 231', title: 'Waves & Optics', departmentId: 'dept-phy', level: '200L', materialCount: 5, completedCount: 3, description: 'Wave motion, interference, diffraction, and polarization.', icon: '🌊' },

  // Computer Science 200L
  { id: 'crs-csc201', code: 'CSC 201', title: 'Computer Programming I', departmentId: 'dept-csc', level: '200L', materialCount: 12, completedCount: 8, description: 'Introduction to programming with Python.', icon: '🐍' },
  { id: 'crs-csc211', code: 'CSC 211', title: 'Data Structures', departmentId: 'dept-csc', level: '200L', materialCount: 10, completedCount: 4, description: 'Arrays, linked lists, stacks, queues, trees, and graphs.', icon: '🌳' },
  { id: 'crs-csc221', code: 'CSC 221', title: 'Discrete Mathematics', departmentId: 'dept-csc', level: '200L', materialCount: 8, completedCount: 1, description: 'Logic, sets, combinatorics, and graph theory.', icon: '🔢' },

  // Mathematics 200L
  { id: 'crs-mth201', code: 'MTH 201', title: 'Mathematical Methods I', departmentId: 'dept-mth', level: '200L', materialCount: 9, completedCount: 3, description: 'Sequences, series, and functions of several variables.', icon: '∑' },
  { id: 'crs-mth211', code: 'MTH 211', title: 'Linear Algebra I', departmentId: 'dept-mth', level: '200L', materialCount: 7, completedCount: 2, description: 'Vectors, matrices, determinants, and linear transformations.', icon: '📊' },

  // Geology 200L
  { id: 'crs-glg201', code: 'GLG 201', title: 'Mineralogy', departmentId: 'dept-glg', level: '200L', materialCount: 6, completedCount: 1, description: 'Crystal systems, mineral identification, and optical mineralogy.', icon: '💎' },
  { id: 'crs-glg211', code: 'GLG 211', title: 'Structural Geology', departmentId: 'dept-glg', level: '200L', materialCount: 5, completedCount: 0, description: 'Folds, faults, joints, and deformation mechanics.', icon: '🏔️' },
];

// ============================================================
// MATERIALS
// ============================================================
export const materials = [
  // CHM 212 materials
  { id: 'mat-001', courseId: 'crs-chm212', courseCode: 'CHM 212', title: 'Crystal Field Theory - Lecture Notes', type: 'pdf', pageCount: 15, fileUrl: '/sample.pdf', fileHash: 'a1b2c3d4', uploadedBy: 'user-002', uploadedByName: 'Amina Ibrahim', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-04-18T10:00:00Z', isCompleted: true, lastReadPage: 15, readCount: 45 },
  { id: 'mat-002', courseId: 'crs-chm212', courseCode: 'CHM 212', title: 'Coordination Compounds – Full Notes', type: 'pdf', pageCount: 22, fileUrl: '/sample.pdf', fileHash: 'e5f6g7h8', uploadedBy: 'user-003', uploadedByName: 'Usman Bello', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-04-10T08:30:00Z', isCompleted: true, lastReadPage: 22, readCount: 38 },
  { id: 'mat-003', courseId: 'crs-chm212', courseCode: 'CHM 212', title: 'Ligand Field Theory & Applications', type: 'pdf', pageCount: 18, fileUrl: '/sample.pdf', fileHash: 'i9j0k1l2', uploadedBy: 'user-002', uploadedByName: 'Amina Ibrahim', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-03-25T14:00:00Z', isCompleted: true, lastReadPage: 18, readCount: 32 },
  { id: 'mat-004', courseId: 'crs-chm212', courseCode: 'CHM 212', title: 'Spectroscopy of TM Complexes', type: 'pdf', pageCount: 25, fileUrl: '/sample.pdf', fileHash: 'm3n4o5p6', uploadedBy: 'user-004', uploadedByName: 'Chioma Okafor', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-03-15T09:00:00Z', isCompleted: true, lastReadPage: 25, readCount: 28 },
  { id: 'mat-005', courseId: 'crs-chm212', courseCode: 'CHM 212', title: 'Past Questions – CHM 212 (2023/2024)', type: 'pdf', pageCount: 8, fileUrl: '/sample.pdf', fileHash: 'q7r8s9t0', uploadedBy: 'user-005', uploadedByName: 'Fatima Yusuf', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-03-01T16:00:00Z', isCompleted: false, lastReadPage: 3, readCount: 62 },
  { id: 'mat-006', courseId: 'crs-chm212', courseCode: 'CHM 212', title: 'Tutorial Solutions Week 1-6', type: 'pdf', pageCount: 12, fileUrl: '/sample.pdf', fileHash: 'u1v2w3x4', uploadedBy: 'user-003', uploadedByName: 'Usman Bello', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-02-20T11:00:00Z', isCompleted: false, lastReadPage: 0, readCount: 55 },

  // CHM 201 materials
  { id: 'mat-007', courseId: 'crs-chm201', courseCode: 'CHM 201', title: 'Thermodynamics – First & Second Law', type: 'pdf', pageCount: 20, fileUrl: '/sample.pdf', fileHash: 'y5z6a7b8', uploadedBy: 'user-002', uploadedByName: 'Amina Ibrahim', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-04-15T10:00:00Z', isCompleted: true, lastReadPage: 20, readCount: 50 },
  { id: 'mat-008', courseId: 'crs-chm201', courseCode: 'CHM 201', title: 'Chemical Kinetics – Rate Laws', type: 'pdf', pageCount: 16, fileUrl: '/sample.pdf', fileHash: 'c9d0e1f2', uploadedBy: 'user-004', uploadedByName: 'Chioma Okafor', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-04-12T08:00:00Z', isCompleted: true, lastReadPage: 16, readCount: 42 },
  { id: 'mat-009', courseId: 'crs-chm201', courseCode: 'CHM 201', title: 'Chemical Equilibrium', type: 'pdf', pageCount: 14, fileUrl: '/sample.pdf', fileHash: 'g3h4i5j6', uploadedBy: 'user-003', uploadedByName: 'Usman Bello', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-04-05T12:00:00Z', isCompleted: true, lastReadPage: 14, readCount: 37 },
  { id: 'mat-010', courseId: 'crs-chm201', courseCode: 'CHM 201', title: 'Electrochemistry Basics', type: 'pdf', pageCount: 18, fileUrl: '/sample.pdf', fileHash: 'k7l8m9n0', uploadedBy: 'user-005', uploadedByName: 'Fatima Yusuf', status: 'approved', approvedBy: 'user-mod1', createdAt: '2026-03-28T14:00:00Z', isCompleted: true, lastReadPage: 12, readCount: 35 },

  // CSC 201 materials
  { id: 'mat-011', courseId: 'crs-csc201', courseCode: 'CSC 201', title: 'Introduction to Python Programming', type: 'pdf', pageCount: 30, fileUrl: '/sample.pdf', fileHash: 'o1p2q3r4', uploadedBy: 'user-006', uploadedByName: 'Ibrahim Musa', status: 'approved', approvedBy: 'user-mod2', createdAt: '2026-04-16T09:00:00Z', isCompleted: true, lastReadPage: 30, readCount: 78 },
  { id: 'mat-012', courseId: 'crs-csc201', courseCode: 'CSC 201', title: 'Control Flow – Loops & Conditionals', type: 'pdf', pageCount: 18, fileUrl: '/sample.pdf', fileHash: 's5t6u7v8', uploadedBy: 'user-006', uploadedByName: 'Ibrahim Musa', status: 'approved', approvedBy: 'user-mod2', createdAt: '2026-04-10T10:00:00Z', isCompleted: true, lastReadPage: 18, readCount: 65 },
];

// ============================================================
// READING NOTEBOOKS (personal curated collections)
// ============================================================
export const readingNotebooks = [
  { id: 'nb-001', name: 'Finals Prep 🔥', userId: 'user-001', materialIds: ['mat-001', 'mat-005', 'mat-007', 'mat-010'], createdAt: '2026-04-15T08:00:00Z', updatedAt: '2026-04-19T14:00:00Z', color: '#EF4444', icon: '🎯' },
  { id: 'nb-002', name: 'Organic Chem Review', userId: 'user-001', materialIds: ['mat-007', 'mat-008', 'mat-009'], createdAt: '2026-04-10T10:00:00Z', updatedAt: '2026-04-18T16:00:00Z', color: '#8B5CF6', icon: '🧬' },
];

// ============================================================
// CURRENT USER
// ============================================================
export const currentUser = {
  id: 'user-001',
  email: 'ahmad.buhari@stu.unn.edu.ng',
  name: 'Ahmad Buhari',
  avatar: null,
  departmentId: 'dept-chm',
  level: '200L',
  role: 'student',
  studyStreak: 5,
  totalMaterialsRead: 12,
  totalMaterials: 45,
  createdAt: '2026-01-15T08:00:00Z',
};

// ============================================================
// RECENT ACTIVITY (last opened materials)
// ============================================================
export const recentMaterials = [
  { ...materials[0], courseCode: 'CHM 212' },  // Crystal Field Theory
  { ...materials[4], courseCode: 'CHM 212' },  // Past Questions
  { ...materials[6], courseCode: 'CHM 201' },  // Thermodynamics
  { ...materials[10], courseCode: 'CSC 201' }, // Python Programming
];

// ============================================================
// AI RESPONSES (simulated)
// ============================================================
export const aiResponses = {
  summary: `Crystal Field Theory (CFT) is a model used to explain the electronic structure and properties of transition metal complexes. When ligands approach a metal ion, they create an electrostatic field that causes the five degenerate d-orbitals to split into two groups of different energy levels. In an octahedral complex, this results in a lower-energy t₂g set (three orbitals) and a higher-energy eg set (two orbitals).

The energy difference between these two sets is called the crystal field splitting energy (Δ), and its magnitude depends on the nature of both the metal ion and the surrounding ligands. Strong-field ligands like CN⁻ and CO produce large splitting, while weak-field ligands like I⁻ and Br⁻ produce small splitting. This concept is organized in the spectrochemical series.

CFT successfully explains many properties of transition metal complexes, including their characteristic colors (due to d-d transitions), magnetic behavior (paramagnetic vs. diamagnetic), and thermodynamic stability. However, it has limitations — it treats metal-ligand bonding as purely electrostatic and doesn't account for covalent character, which is better addressed by Ligand Field Theory.`,

  flashcards: [
    { front: 'What is Crystal Field Splitting Energy (Δ)?', back: 'The energy difference between the t₂g and eg sets of d-orbitals in a transition metal complex caused by the electrostatic field of surrounding ligands.' },
    { front: 'In an octahedral field, which d-orbitals form the t₂g set?', back: 'dxy, dxz, and dyz — these are the three lower-energy orbitals that point between the ligand axes.' },
    { front: 'In an octahedral field, which d-orbitals form the eg set?', back: 'dx²-y² and dz² — these are the two higher-energy orbitals that point directly toward the ligands.' },
    { front: 'What is the spectrochemical series?', back: 'An ordering of ligands by their ability to cause d-orbital splitting: I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < NO₂⁻ < CN⁻ < CO' },
    { front: 'What determines if a complex is high-spin or low-spin?', back: 'The relative magnitude of Δ (crystal field splitting energy) compared to the electron pairing energy (P). If Δ > P → low-spin. If Δ < P → high-spin.' },
    { front: 'Why are many transition metal complexes colored?', back: 'Because electrons absorb visible light photons to undergo d-d transitions from lower-energy t₂g orbitals to higher-energy eg orbitals. The transmitted/reflected wavelengths appear as color.' },
    { front: 'What is the Crystal Field Stabilisation Energy (CFSE)?', back: 'The net energy stabilisation gained by distributing d-electrons in the split orbital sets compared to the hypothetical unsplit (spherical field) arrangement.' },
    { front: 'How does CFT explain magnetic properties?', back: 'By determining the number of unpaired electrons. Strong-field (low-spin) complexes have fewer unpaired electrons → weaker paramagnetism or diamagnetic. Weak-field (high-spin) → more unpaired electrons → stronger paramagnetism.' },
  ],

  quiz: [
    {
      question: 'In Crystal Field Theory, what causes the splitting of d-orbitals?',
      options: [
        'Covalent bonding between metal and ligands',
        'The electrostatic field created by surrounding ligands',
        'Nuclear spin-spin coupling',
        'Van der Waals interactions'
      ],
      correctIndex: 1,
      explanation: "Not quite! The correct answer is B. In CFT, the splitting occurs because ligands create an electrostatic field around the metal ion. This field isn't uniform — ligands approach from specific directions, causing d-orbitals pointing toward ligands to experience greater repulsion (higher energy) than those pointing between ligands."
    },
    {
      question: 'In an octahedral complex, which set of orbitals has HIGHER energy?',
      options: ['t₂g (dxy, dxz, dyz)', 'eg (dx²-y², dz²)', 'Both have equal energy', 'It depends on the metal'],
      correctIndex: 1,
      explanation: "Not quite! The eg set (dx²-y² and dz²) has higher energy in an octahedral field because these orbitals point directly toward the ligands, experiencing greater electrostatic repulsion. The t₂g orbitals point between the ligands, so they're more stable."
    },
    {
      question: 'Which ligand produces the LARGEST crystal field splitting?',
      options: ['I⁻ (iodide)', 'H₂O (water)', 'CN⁻ (cyanide)', 'F⁻ (fluoride)'],
      correctIndex: 2,
      explanation: "Not quite! CN⁻ (cyanide) is one of the strongest field ligands in the spectrochemical series. It produces very large Δ values due to its ability to act as both a σ-donor and a π-acceptor, which significantly increases the energy gap between t₂g and eg."
    },
    {
      question: 'A complex with Δ > P (pairing energy) will be:',
      options: ['High-spin', 'Low-spin', 'Diamagnetic always', 'Colorless'],
      correctIndex: 1,
      explanation: "Not quite! When Δ (splitting energy) exceeds P (pairing energy), it's energetically favorable for electrons to pair up in the lower t₂g orbitals before occupying the higher eg. This results in a low-spin configuration with fewer unpaired electrons."
    },
    {
      question: 'Why is [Ti(H₂O)₆]³⁺ purple?',
      options: [
        'It reflects all visible light',
        'A single d-electron absorbs yellow-green light during a d-d transition',
        'The water ligands are blue',
        'Ti³⁺ ions are inherently purple'
      ],
      correctIndex: 1,
      explanation: "Not quite! Ti³⁺ has one d-electron (d¹ configuration). This electron absorbs a photon of yellow-green light (~500 nm) to jump from the t₂g to eg level. The complementary color — purple — is what we see. This is a classic example of how CFT explains color in transition metal complexes!"
    },
  ],
};

// ============================================================
// HELPER: Delay for simulating network requests
// ============================================================
export const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));
