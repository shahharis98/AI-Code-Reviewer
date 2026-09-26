export interface ReviewIssue {
  line: number;
  severity: 'critical' | 'warning' | 'suggestion';
  message: string;
  suggestion?: string;
}

export interface ReviewResult {
  issues: ReviewIssue[];
  summary: string;
}
