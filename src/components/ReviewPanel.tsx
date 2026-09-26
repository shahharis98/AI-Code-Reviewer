import { CircularProgress, Alert, Typography, Box, Stack, Chip } from '@mui/material';
import type { ReviewResult } from '@/lib/types';

interface ReviewPanelProps {
  review: ReviewResult | null;
  error: string | null;
  loading: boolean;
}

export default function ReviewPanel({ review, error, loading }: ReviewPanelProps) {
  if (loading) {
    return (
      <Stack direction="row" spacing={2} sx={{alignItems:"center"}}>
        <CircularProgress size={20} />
        <Typography>Analyzing your code...</Typography>
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (review) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {review.summary}
        </Typography>
        <Stack spacing={2}>
          {review.issues.map((issue) => (
            <Box key={`${issue.line}-${issue.message}`} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Stack direction="row" spacing={1}  sx={{ mb: 1 ,alignItems:"center" }}>
                <Chip label={`Line ${issue.line}`} size="small" />
                <Chip label={issue.severity} size="small" color={issue.severity === 'critical' ? 'error' : issue.severity === 'warning' ? 'warning' : 'default'} />
              </Stack>
              <Typography variant="body2">{issue.message}</Typography>
              {issue.suggestion && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: 'monospace' }}>
                  {issue.suggestion}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }

  return null;
}