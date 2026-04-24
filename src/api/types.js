/**
 * Edukate UIL — Type Definitions (JSDoc)
 * These mirror what the real Supabase schema will look like.
 */

/**
 * @typedef {'student' | 'moderator' | 'admin'} UserRole
 * @typedef {'pending' | 'approved' | 'rejected'} MaterialStatus
 * @typedef {'user' | 'assistant'} ChatRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} avatar - URL or null (initials used as fallback)
 * @property {string} departmentId
 * @property {string} level - e.g., "200L"
 * @property {UserRole} role
 * @property {number} studyStreak - consecutive days
 * @property {number} totalMaterialsRead
 * @property {number} totalMaterials - total available for their dept/level
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Department
 * @property {string} id
 * @property {string} code - e.g., "CHM"
 * @property {string} name - e.g., "Chemistry"
 * @property {string} icon - emoji
 * @property {string} color - hex color for theming
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} code - e.g., "CHM 201"
 * @property {string} title - e.g., "Physical Chemistry I"
 * @property {string} departmentId
 * @property {string} level - e.g., "200L"
 * @property {number} materialCount
 * @property {number} completedCount - how many the current user has read
 * @property {string} description
 * @property {string} icon - emoji representing the course
 */

/**
 * @typedef {Object} Material
 * @property {string} id
 * @property {string} courseId
 * @property {string} courseCode - denormalized for convenience
 * @property {string} title
 * @property {'pdf' | 'doc' | 'pptx'} type
 * @property {number} pageCount
 * @property {string} fileUrl - URL to the PDF
 * @property {string} fileHash - SHA-256 hash for duplicate detection
 * @property {string} uploadedBy - userId
 * @property {string} uploadedByName
 * @property {MaterialStatus} status
 * @property {string|null} approvedBy - moderator userId
 * @property {string} createdAt
 * @property {boolean} isCompleted - has current user marked it read
 * @property {number} lastReadPage - bookmark
 * @property {number} readCount - how many students have read this
 */

/**
 * @typedef {Object} ReadingNotebook
 * @property {string} id
 * @property {string} name - e.g., "Finals Prep", "Organic Chem Review"
 * @property {string} userId
 * @property {string[]} materialIds - curated list of material IDs
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} color - accent color for the notebook card
 * @property {string} icon - emoji
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {ChatRole} role
 * @property {string} content
 * @property {string} timestamp
 * @property {string} materialId - which PDF this chat is about
 */

/**
 * @typedef {Object} Flashcard
 * @property {string} front - question/term
 * @property {string} back - answer/definition
 */

/**
 * @typedef {Object} QuizQuestion
 * @property {string} question
 * @property {string[]} options - 4 choices
 * @property {number} correctIndex - 0-3
 * @property {string} explanation - empathetic explanation for wrong answers
 */

/**
 * @typedef {Object} AIResponse
 * @property {string} summary - 3-paragraph summary
 * @property {Flashcard[]} flashcards
 * @property {QuizQuestion[]} quiz
 */

/**
 * @typedef {Object} StudyStats
 * @property {number} streak - consecutive days
 * @property {number} totalRead
 * @property {number} totalAvailable
 * @property {number} completionPercentage
 * @property {Object[]} recentActivity - last 5 actions
 */

export {};
