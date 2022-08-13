import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import GameContainer from './containers/GameContainer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContainer />
    </QueryClientProvider>
  );
}

export default App;
