import { createRoot } from 'react-dom/client';
import './theme';
import './legacy.css';
import './app.css';
import './palarnia.css';
import { App } from './App';
createRoot(document.getElementById('root')!).render(<App />);
