'use client';

import { useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import CodeEditor from '@/components/CodeEditor';
import ReviewPanel from '@/components/ReviewPanel';
import type { ReviewResult } from '@/lib/types';

export default function Home() {
  const [code, setCode] = useState('// Paste your code here\n');
  const [language, setLanguage] = useState('typescript');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    setLoading(true);
    setError(null);
    setReview(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      if (!res.ok) throw new Error('Review failed. Please try again.');
      const data: ReviewResult = await res.json();
      setReview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        AI Code Reviewer
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Paste your code and get instant, structured feedback — like a senior dev review.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0,1fr) minmax(0,1fr)' }, gap: 3 }}>
        <Box>
          <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
          <Button
            variant="contained"
            onClick={handleReview}
            disabled={loading || !code.trim()}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Review Code'}
          </Button>
        </Box>

        <Box>
          <ReviewPanel review={review} error={error} loading={loading} />
        </Box>
      </Box>
    </Container>
  );
}