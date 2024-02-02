import React, { useRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import NotesIcon from '@mui/icons-material/Notes';
import FileSaver from 'file-saver';
import dayjs from 'dayjs';
import { loadAtom } from '../atom.ts';
import { useAtom } from 'jotai';

export default function ResponsiveAppBar() {
  const [, setLoad] = useAtom(loadAtom);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleSave = () => {
    const storedTasks = localStorage.getItem('tasks') || '[]';
    FileSaver.saveAs(new Blob([storedTasks], {type: 'text/plain;charset=utf-8'}), `tasks-${dayjs().format('YYYY-MM-DD HH_mm_ss')}.json`);
  };

  const handleLoad = () => { 
    if (inputFile.current) { inputFile.current.click(); }
  };

  const handleFileChange = () => {
    const file = inputFile.current?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result;
        if (contents) {
          console.log(contents);
          localStorage.setItem('tasks', contents as string);
          setLoad(true);
        }
      };
      reader.readAsText(file);
    }
  }

  return (
    <>
      <input 
        type='file'
        ref={inputFile} 
        style={{display: 'none'}} 
        accept='.json'
        onChange={handleFileChange}
      />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <NotesIcon sx={{ mr: 2 }}/>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
              Todo App
            </Typography>
            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} 
                        onClick={handleSave} aria-label="save">
              <SaveIcon />
            </IconButton>
            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} 
                        onClick={handleLoad} aria-label="load">
              <UploadIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
