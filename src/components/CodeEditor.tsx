'use client';

import Editor from '@monaco-editor/react';
import { Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
   language: string;
  setLanguage: (lang: string) => void;
}


export default function CodeEditor({ code, setCode,language,setLanguage }: CodeEditorProps) {

      const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };
  return (
    <Box>


     <Select
        value={language}
        onChange={handleLanguageChange}
        size="small"
        sx={{ mb: 1, minWidth: 150 }}
      >
        <MenuItem value="javascript">JavaScript</MenuItem>
        <MenuItem value="typescript">TypeScript</MenuItem>
        <MenuItem value="python">Python</MenuItem>
      </Select>
    <Editor
      height="400px"
      language={language}
      value={code}
      theme="vs-dark"
       onChange={(value) => setCode(value ?? '')}
    />
        </Box>
  );
}