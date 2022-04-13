import './App.css';

import { Pages } from './pages/Pages';
import { useInitializeData } from './data-layer/useInitializeData';

import { useEffect } from 'react';

function useInitialize() {
  const initialize = useInitializeData();

  useEffect(() => {
    (async () => {
      await initialize();
    })();
  }, [initialize]);
}

function App() {
  useInitialize();

  return <Pages />;
}

export default App;
