import * as React from 'react';
import ReactDOM from 'react-dom/client'
import App from './components/App';
import './index.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });

root.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
);
