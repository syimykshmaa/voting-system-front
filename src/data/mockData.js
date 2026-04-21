// ========== MOCK DATABASE ==========

export const USERS_DB = [
  { id: 1, username: "admin", password: "admin123", role: "ADMIN", name: "Alex Admin", email: "admin@vote.io", createdAt: "2024-01-01" },
  { id: 2, username: "manager", password: "manager123", role: "MANAGER", name: "Maria Manager", email: "manager@vote.io", createdAt: "2024-01-05" },
  { id: 3, username: "john", password: "john123", role: "USER", name: "John Doe", email: "john@vote.io", createdAt: "2024-02-01" },
  { id: 4, username: "jane", password: "jane123", role: "USER", name: "Jane Smith", email: "jane@vote.io", createdAt: "2024-02-10" },
  { id: 5, username: "bob", password: "bob123", role: "USER", name: "Bob Wilson", email: "bob@vote.io", createdAt: "2024-03-01" },
];

export const ELECTIONS_DB = [
  {
    id: 1,
    title: "Presidential Election 2024",
    description: "Choose the next president of the organization",
    status: "ACTIVE",
    startDate: "2024-11-01",
    endDate: "2025-12-31",
    createdBy: 2,
    candidates: [
      { id: 1, name: "Alice Johnson", party: "Progress Party", bio: "10 years experience in leadership" },
      { id: 2, name: "Carlos Rivera", party: "Unity Alliance", bio: "Former VP with 15 years tenure" },
      { id: 3, name: "Diana Chen", party: "Innovation Front", bio: "Tech entrepreneur and community leader" },
    ],
  },
  {
    id: 2,
    title: "Board Member Selection",
    description: "Select 2 new board members for the upcoming term",
    status: "ACTIVE",
    startDate: "2024-10-15",
    endDate: "2025-11-30",
    createdBy: 2,
    candidates: [
      { id: 4, name: "Edward Kim", party: "Independent", bio: "Financial expert" },
      { id: 5, name: "Fatima Al-Hassan", party: "Independent", bio: "Legal counsel specialist" },
      { id: 6, name: "George Patel", party: "Independent", bio: "Marketing & communications lead" },
    ],
  },
  {
    id: 3,
    title: "Policy Reform Referendum",
    description: "Vote on the proposed policy changes for 2025",
    status: "COMPLETED",
    startDate: "2024-08-01",
    endDate: "2024-09-30",
    createdBy: 1,
    candidates: [
      { id: 7, name: "Yes - Approve Changes", party: "", bio: "Support the new policy framework" },
      { id: 8, name: "No - Keep Current", party: "", bio: "Maintain existing policies" },
    ],
  },
  {
    id: 4,
    title: "Community Budget Allocation",
    description: "Decide how to allocate the annual community budget",
    status: "DRAFT",
    startDate: "2025-02-01",
    endDate: "2025-03-31",
    createdBy: 2,
    candidates: [
      { id: 9, name: "Infrastructure Focus", party: "", bio: "60% infrastructure, 40% social" },
      { id: 10, name: "Social Programs Focus", party: "", bio: "60% social, 40% infrastructure" },
      { id: 11, name: "Equal Split", party: "", bio: "50/50 balanced approach" },
    ],
  },
];

export const VOTES_DB = [
  { id: 1, userId: 3, electionId: 1, candidateId: 1, timestamp: "2024-11-02T10:30:00Z" },
  { id: 2, userId: 4, electionId: 1, candidateId: 2, timestamp: "2024-11-03T14:15:00Z" },
  { id: 3, userId: 5, electionId: 1, candidateId: 1, timestamp: "2024-11-04T09:45:00Z" },
  { id: 4, userId: 3, electionId: 2, candidateId: 5, timestamp: "2024-10-16T11:00:00Z" },
  { id: 5, userId: 4, electionId: 2, candidateId: 4, timestamp: "2024-10-17T16:30:00Z" },
  { id: 6, userId: 3, electionId: 3, candidateId: 7, timestamp: "2024-08-05T08:20:00Z" },
  { id: 7, userId: 4, electionId: 3, candidateId: 8, timestamp: "2024-08-06T13:45:00Z" },
  { id: 8, userId: 5, electionId: 3, candidateId: 7, timestamp: "2024-08-07T10:10:00Z" },
];
