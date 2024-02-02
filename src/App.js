import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar.tsx';
import TodoApp from './components/ToDoApp.tsx';

function App() {
  return (
    <div className="App">
      {/* <h1>My first React App</h1> */}
      <ResponsiveAppBar />
      <TodoApp />
    </div>
  );
}

export default App;
