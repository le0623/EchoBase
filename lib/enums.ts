export enum UserRole {
  ADMIN = "Admin",
  EDITOR = "Editor",
  VIEWER = "Viewer"
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  PENDING = "Pending"
}

export enum DocumentStatus {
  PENDING = "Pending",
  PROCESSED = "Processed",
  ERROR = "Error",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  REVIEWING = "Reviewing"
}

export enum AIProvider {
  OPENAI = "OpenAI",
  GOOGLE_GEMINI = "Google Gemini"
}

export enum IntegrationStatus {
  CONNECTED = "Connected",
  NOT_CONNECTED = "Not Connected"
}

export enum BackupFrequency {
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly"
}

export enum SessionTimeout {
  ONE_HOUR = "1 hour",
  TWO_HOURS = "2 hours",
  FOUR_HOURS = "4 hours",
  EIGHT_HOURS = "8 hours"
}

export enum RetentionPeriod {
  ONE_YEAR = "1 year",
  THREE_YEARS = "3 years",
  FIVE_YEARS = "5 years",
  SEVEN_YEARS = "7 years"
}

export enum SearchIndexRefreshRate {
  ONE_MINUTE = "1 Minute",
  FIVE_MINUTES = "5 Minutes",
  FIFTEEN_MINUTES = "15 Minutes",
  THIRTY_MINUTES = "30 Minutes"
}

export enum MetricType {
  TOTAL_DOCUMENTS = "Total Documents",
  TOTAL_QUERIES = "Total Queries",
  ACTIVE_USERS = "Active Users",
  SUCCESS_RATE = "Success Rate"
}

export enum ChartMonth {
  JUN = "Jun",
  JUL = "Jul",
  AUG = "Aug",
  SEP = "Sep",
  OCT = "Oct"
}