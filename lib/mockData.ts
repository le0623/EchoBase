import { UserRole, UserStatus, DocumentStatus, AIProvider, IntegrationStatus } from './enums';

// Mock data for root props
export const mockRootProps = {
  user: {
    name: "Emmy Watson",
    email: "emmy.watson@example.com",
    role: UserRole.ADMIN as const,
    avatar: "/images/avatar.jpg"
  }
};

// Mock data for dashboard
export const mockDashboardData = {
  stats: {
    totalDocuments: 1247,
    totalDocumentsChange: 12,
    totalQueries: 8392,
    totalQueriesChange: 23,
    activeUsers: 156,
    activeUsersChange: -8,
    successRate: 94.2,
    successRateChange: 2
  },
  // ... existing code ...
  recentDocuments: [
    {
      id: "1",
      name: "Employee Handbook.pdf",
      size: 2.4 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      queries: 24,
      status: DocumentStatus.PROCESSED as const
    },
    {
      id: "2",
      name: "Handbook.pdf",
      size: 2.4 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      queries: 24,
      status: DocumentStatus.PROCESSED as const
    },
    {
      id: "3",
      name: "Financial Report Q3.xlsx",
      size: 2.4 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      queries: 24,
      status: DocumentStatus.PROCESSED as const
    },
    {
      id: "4",
      name: "Market Guidelines.pptx",
      size: 2.4 * 1024 * 1024,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      queries: 24,
      status: DocumentStatus.ERROR as const
    }
  ],
  recentConversations: [
    {
      id: "1",
      question: "What are the vacation policies for remote employees?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sources: 2,
      confidence: 95
    },
    {
      id: "2",
      question: "How do I submit an expense report?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sources: 2,
      confidence: 85
    },
    {
      id: "3",
      question: "What are the requirements for the new product feature?",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sources: 2,
      confidence: 95
    }
  ],
  analyticsData: [
    { month: "Jun", value: 500 },
    { month: "Jul", value: 1000 },
    { month: "Aug", value: 850 },
    { month: "Sep", value: 900 },
    { month: "Oct", value: 1200 }
  ]
};

// ... existing code ...

// Mock data for billing
export const mockBillingData = {
  currentMonth: 142.50,
  currentMonthChange: 12,
  tokensUsed: 2100000,
  tokensUsedChange: 10,
  apiCalls: 24567,
  apiCallsChange: 75,
  estimatedMonthEnd: 189.30,
  estimatedMonthEndChange: -23,
  providers: [
    {
      id: "1",
      name: AIProvider.OPENAI as const,
      models: "GPT-4o, GPT-4",
      cost: 98.75,
      calls: 18432,
      logo: "/images/openai-logo.png"
    },
    {
      id: "2",
      name: AIProvider.GOOGLE_GEMINI as const,
      models: "Gemini Pro, Flash",
      cost: 98.75,
      calls: 18432,
      logo: "/images/google-gemini-logo.png"
    }
  ],
  modelBreakdown: [
    { model: "GPT-4o", calls: 12456, cost: 67.80 },
    { model: "GPT-4", calls: 5976, cost: 30.95 },
    { model: "Gemini Pro", calls: 4234, cost: 28.90 },
    { model: "Gemini Flash", calls: 1901, cost: 14.85 }
  ]
};

// ... existing code ...

export const mockAPIKeys = [
  {
    id: "1",
    provider: AIProvider.OPENAI as const,
    models: "GPT-4o, GPT-4",
    logo: "/images/openai-logo.png",
    isActive: true,
    validated: true,
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    dailyLimit: 50,
    monthlyLimit: 500
  },
  {
    id: "2",
    provider: AIProvider.GOOGLE_GEMINI as const,
    models: "Gemini Pro, Gemini Flash",
    logo: "/images/google-gemini-logo.png",
    isActive: true,
    validated: true,
    lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000),
    dailyLimit: 50,
    monthlyLimit: 500
  }
];

export const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "demoemailaddress@gmail.com",
    avatar: "/images/avatar-user.png",
    role: UserRole.ADMIN as const,
    status: UserStatus.ACTIVE as const,
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
    joinedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    name: "John Smith",
    email: "demoemailaddress@gmail.com",
    avatar: "/images/avatar-user.png",
    role: UserRole.ADMIN as const,
    status: UserStatus.ACTIVE as const,
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
    joinedAt: new Date("2024-01-15")
  },
  {
    id: "3",
    name: "John Smith",
    email: "demoemailaddress@gmail.com",
    avatar: "/images/avatar-user.png",
    role: UserRole.ADMIN as const,
    status: UserStatus.ACTIVE as const,
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
    joinedAt: new Date("2024-01-15")
  },
  {
    id: "4",
    name: "John Smith",
    email: "demoemailaddress@gmail.com",
    avatar: "/images/avatar-user.png",
    role: UserRole.ADMIN as const,
    status: UserStatus.ACTIVE as const,
    lastActive: new Date(Date.now() - 2 * 60 * 1000),
    joinedAt: new Date("2024-01-15")
  }
];

export const mockUserStats = {
  totalUsers: 248,
  totalUsersChange: 23,
  activeUsers: 17,
  activeUsersChange: 10,
  pendingInvites: 231,
  pendingInvitesChange: 75,
  adminUsers: 12,
  adminUsersChange: 23
};

export const mockDocuments = [
  {
    id: "1",
    name: "Q4 Financial Report 2024",
    size: 2.4 * 1024 * 1024,
    author: {
      name: "Sarah Johnson",
      avatar: "/images/avatar-user.png"
    },
    version: "V2.1",
    status: DocumentStatus.PENDING as const,
    lastModified: new Date("2024-01-15"),
    downloads: 45,
    tags: ["finance", "quarterly", "revenue"]
  },
  {
    id: "2",
    name: "Q4 Financial Report 2024",
    size: 2.4 * 1024 * 1024,
    author: {
      name: "Sarah Johnson",
      avatar: "/images/avatar-user.png"
    },
    version: "V2.1",
    status: DocumentStatus.PENDING as const,
    lastModified: new Date("2024-01-15"),
    downloads: 45,
    tags: ["finance", "quarterly", "revenue"]
  },
  {
    id: "3",
    name: "Q4 Financial Report 2024",
    size: 2.4 * 1024 * 1024,
    author: {
      name: "Sarah Johnson",
      avatar: "/images/avatar-user.png"
    },
    version: "V2.1",
    status: DocumentStatus.PENDING as const,
    lastModified: new Date("2024-01-15"),
    downloads: 45,
    tags: ["finance", "quarterly", "revenue"]
  },
  {
    id: "4",
    name: "Q4 Financial Report 2024",
    size: 2.4 * 1024 * 1024,
    author: {
      name: "Sarah Johnson",
      avatar: "/images/avatar-user.png"
    },
    version: "V2.1",
    status: DocumentStatus.ERROR as const,
    lastModified: new Date("2024-01-15"),
    downloads: 45,
    tags: []
  }
];

export const mockDocumentStats = {
  totalDocuments: 4,
  totalDocumentsChange: 23,
  approved: 3,
  approvedChange: 75,
  pendingReview: 1,
  pendingReviewChange: 10,
  totalDownloads: 143,
  totalDownloadsChange: -23
};

export const mockApprovalStats = {
  pending: 10,
  pendingChange: 23,
  reviewing: 10,
  reviewingChange: -8,
  approved: 10,
  approvedChange: 12,
  rejected: 15,
  rejectedChange: 2
};

export const mockConversations = [
  {
    id: "1",
    title: "Vacation Policy Questions",
    messageCount: 4,
    lastMessage: "What are the vacation policies for remote employees?",
    timestamp: new Date("2025-09-25")
  },
  {
    id: "2",
    title: "Vacation Policy Questions",
    messageCount: 4,
    lastMessage: "What are the vacation policies for remote employees?",
    timestamp: new Date("2025-09-25")
  },
  {
    id: "3",
    title: "Vacation Policy Questions",
    messageCount: 4,
    lastMessage: "What are the vacation policies for remote employees?",
    timestamp: new Date("2025-09-25")
  }
];

export const mockIntegrations = [
  {
    id: "1",
    name: "Microsoft 365",
    description: "SharePoint and Teams integration",
    status: IntegrationStatus.CONNECTED as const,
    logo: "/images/microsoft-365-logo.png"
  },
  {
    id: "2",
    name: "Active Directory",
    description: "User authentication and management",
    status: IntegrationStatus.CONNECTED as const,
    logo: "/images/active-directory-logo.png"
  },
  {
    id: "3",
    name: "Slack",
    description: "Team notifications and collaboration",
    status: IntegrationStatus.NOT_CONNECTED as const,
    logo: "/images/slack-logo.png"
  }
];

export const mockRoles = [
  {
    name: "Administrator",
    userCount: 12,
    description: "Full system access"
  },
  {
    name: "Editor",
    userCount: 45,
    description: "Can upload and edit documents"
  },
  {
    name: "Viewer",
    userCount: 132,
    description: "Read-only access"
  }
];