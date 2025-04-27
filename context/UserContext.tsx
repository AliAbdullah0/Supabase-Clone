"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from '@/actions/user.actions';
import { User } from '@/types';

const UserContext = createContext<User | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={currentUser}>
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;
