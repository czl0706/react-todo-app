import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Box, Checkbox, Container, Grid, Typography } from '@mui/material';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs  } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useAtom } from 'jotai';
import { loadAtom } from '../atom.ts';

type TodoAppProps = {};

type TaskProps = {
  task: string;
  date: Date | null;
  completed: boolean;
};

// type SimpleDialogProps = {
//   open: boolean;
//   onClose: () => void;
// }

// function 

export default function ToDoApp(props: TodoAppProps) {
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [newTask, setNewTask] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [load, setLoad] = useAtom(loadAtom);
  const [firstLoad, setFirstLoad] = useState(true);

  // const [openDialog, setOpenDialog] = useState(false);
  // const [openIndex, setOpenIndex] = useState(0);

  // const [dialogTitle, setDialogTitle] = useState('');
  // const [dialogDate, setDialogDate] = useState(null);

  // const SimpleDialog = () => {
  //   // setDialogTitle(tasks[openIndex]?.task || '');
  //   // setDialogDate(tasks[openIndex]?.date || null);

  //   return (
  //     <React.Fragment>
  //       <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
  //         <DialogTitle>Modify task {openIndex}</DialogTitle>
  //         {/* <List sx={{ pt: 0 }}>
  //           {emails.map((email) => (
  //             <ListItem disableGutters key={email}>
  //               <ListItemButton onClick={() => handleListItemClick(email)}>
  //                 <ListItemAvatar>
  //                   <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
  //                     <PersonIcon />
  //                   </Avatar>
  //                 </ListItemAvatar>
  //                 <ListItemText primary={email} />
  //               </ListItemButton>
  //             </ListItem>
  //           ))}
  //           <ListItem disableGutters>
  //             <ListItemButton
  //               autoFocus
  //               onClick={() => handleListItemClick('addAccount')}
  //             >
  //               <ListItemAvatar>
  //                 <Avatar>
  //                   <AddIcon />
  //                 </Avatar>
  //               </ListItemAvatar>
  //               <ListItemText primary="Add account" />
  //             </ListItemButton>
  //           </ListItem>
  //         </List> */}
  //         <DialogContent>
  //           <TextField
  //               label="Task title"
  //               variant="outlined"
  //               fullWidth
  //               value={dialogTitle}
  //               onChange={(e) => setDialogTitle(e.target.value)}
  //             />
  //           <LocalizationProvider dateAdapter={AdapterDayjs}>
  //             <DatePicker
  //               label="Select Date"
  //               value={dialogDate ? dayjs(dialogDate) : null}
  //               onChange={(date) => setDialogDate(date)}
  //             />
  //           </LocalizationProvider>
  //         </DialogContent>
  //         <DialogActions>
  //           <Button autoFocus onClick={() => {}}>
  //             Save changes
  //           </Button>
  //         </DialogActions>
          
  //       </Dialog>
  //     </React.Fragment>
  //   );
  // }

  const addTask = () => {
    if (newTask.trim() !== '') {
      const _newTask: TaskProps = {
        task: newTask,
        date: selectedDate || null,
        completed: false,
      };
      setTasks([...tasks, _newTask]);
      setNewTask('');
    }
  };

  const removeTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = tasks.map((task, i) => {
      if (i === index) {
        task.completed = !task.completed;
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    setTasks(storedTasks);
    setLoad(false);
  }, [load, setLoad]);

  useEffect(() => {
    // Save tasks to localStorage whenever tasks change
    if (firstLoad) { setFirstLoad(false); return; }
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks, firstLoad]);

  return (
    <Container maxWidth="lg" style={{ display: 'flex', flexDirection: 'column', minHeight: '90vh' }}>
      <div style={{ margin: '8px' }} />
      <Box style={{ flex: 1 }}>
        {tasks.map((data, index) => {
          const isPast = !data.completed && dayjs(data.date).isBefore(dayjs(), 'day'); // Check if the date is before today

          return (
            <Card key={index} style={{ color: isPast ? 'red' : 'black', margin: '8px', textDecoration: data.completed ? 'line-through' : '' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={1}>
                    <Checkbox
                      color="primary"
                      checked={data.completed || false}
                      onChange={() => toggleTaskCompletion(index)}
                    />
                  </Grid>
                  <Grid 
                    item xs={9} 
                    // onClick={() => {setOpenIndex(index); setOpenDialog(true);}}
                  >
                    <Typography variant="h5" align="left">
                      {data.task}
                    </Typography>
                    <Typography variant="subtitle1" color={isPast ? 'red' : 'text.secondary'} component="div" align="left">
                      {(data.date !== null) && (dayjs(data.date).format('MM/DD/YYYY') + (isPast ? ' due' : ''))}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} style={{ textAlign: 'right' }}>
                    <Fab color="primary" aria-label="delete" onClick={() => removeTask(index)}>
                      <DeleteIcon />
                    </Fab>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={6} sm={8} md={8} lg={8}>
          <TextField
            label="New Task"
            variant="outlined"
            fullWidth
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </Grid>
        <Grid item xs={4} sm={3} md={3} lg={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(date) => setSelectedDate(date?.toDate())}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={2} sm={1} md={1} lg={1}>
          <Fab color="primary" aria-label="add" onClick={addTask}>
            <AddIcon />
          </Fab>
        </Grid>
      </Grid>

      {/* <SimpleDialog/> */}
    </Container>
  );
}