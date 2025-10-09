import { DocumentStatus, MetricType, ChartMonth } from './enums';

// Data passed as props to the root component
export const mockRootProps = {
  user: {
    name: "Emmy Watson" as const,
    avatar: "/images/avatar-emmy.png" as const,
    role: "Internal User" as const
  },
  metrics: [
    {
      type: MetricType.TOTAL_DOCUMENTS,
      value: 1247,
      changePercent: 12,
      isPositive: true
    },
    {
      type: MetricType.TOTAL_QUERIES,
      value: 8392,
      changePercent: 23,
      isPositive: true
    },
    {
      type: MetricType.ACTIVE_USERS,
      value: 156,
      changePercent: 8,
      isPositive: false
    },
    {
      type: MetricType.SUCCESS_RATE,
      value: 94.2,
      changePercent: 2,
      isPositive: true
    }
  ],
  chartData: [
    { month: ChartMonth.JUN, value: 400 },
    { month: ChartMonth.JUL, value: 850 },
    { month: ChartMonth.AUG, value: 650 },
    { month: ChartMonth.SEP, value: 900 },
    { month: ChartMonth.OCT, value: 1000 }
  ],
  documents: [
    {
      id: "1" as const,
      name: "Employee Handbook.pdf" as const,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: 2516582,
      queryCount: 24,
      status: DocumentStatus.PROCESSED
    },
    {
      id: "2" as const,
      name: "Handbook.pdf" as const,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: 2516582,
      queryCount: 24,
      status: DocumentStatus.PROCESSED
    },
    {
      id: "3" as const,
      name: "Financial Report Q3.xlsx" as const,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: 2516582,
      queryCount: 24,
      status: DocumentStatus.PROCESSED
    },
    {
      id: "4" as const,
      name: "Market Guidelines.pptx" as const,
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      size: 2516582,
      queryCount: 24,
      status: DocumentStatus.ERROR
    }
  ],
  conversations: [
    {
      id: "1" as const,
      question: "What are the vacation policies for remote employees?" as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sourceCount: 2,
      confidence: 95
    },
    {
      id: "2" as const,
      question: "How do I submit an expense report?" as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sourceCount: 2,
      confidence: 85
    },
    {
      id: "3" as const,
      question: "What are the requirements for the new product feature?" as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sourceCount: 2,
      confidence: 95
    }
  ],
  hasUnreadNotifications: true
};