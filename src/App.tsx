import React from 'react';
import { RouterProvider } from 'react-router-dom';
import appRouter from './router';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={appRouter} />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;