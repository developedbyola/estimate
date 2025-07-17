import { createContext, useContext, useReducer, useCallback } from 'react';
import { trpc } from '~/utils/trpc';
import { useToast } from '~/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  createdAt: string;
  isOnboarded: boolean;
}

type UsersState = {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
};

type UsersAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'RESET' };

const initialState: UsersState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const usersReducer = (state: UsersState, action: UsersAction): UsersState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        currentUser: action.payload,
        error: null,
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        currentUser: state.currentUser
          ? { ...state.currentUser, ...action.payload }
          : null,
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
};

type UsersContextType = {
  state: UsersState;
  fetchCurrentUser: () => Promise<void>;
  updateProfile: (updates: { isOnboarded: boolean }) => Promise<void>;
  changePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  changeEmail: (data: { email: string; password: string }) => Promise<void>;
  reset: () => void;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(usersReducer, initialState);
  const { toast } = useToast();
  const utils = trpc.useContext();

  const fetchCurrentUser = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const result = await utils.client.users.me.get();
      if (result.success && result.data) {
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data.user });
      } else {
        throw new Error(result.error?.message || 'Failed to fetch user');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      dispatch({ type: 'FETCH_ERROR', payload: message });
      throw error;
    }
  }, [utils]);

  const updateProfile = useCallback(
    async (updates: { isOnboarded: boolean }) => {
      try {
        const result = await utils.client.users.me.update.mutate(updates);
        if (result.success) {
          dispatch({ type: 'UPDATE_PROFILE', payload: updates });
          toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully.',
          });
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to update profile';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [toast, utils]
  );

  const changePassword = useCallback(
    async (data: { currentPassword: string; newPassword: string }) => {
      try {
        const result = await utils.client.users.me.changePassword.mutate(data);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Your password has been changed successfully.',
          });
        } else {
          throw new Error('Failed to change password');
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to change password';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [toast, utils]
  );

  const changeEmail = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const result = await utils.client.users.me.changeEmail.mutate(data);
        if (result.success) {
          toast({
            title: 'Success',
            description: 'Please check your email to verify your new address.',
          });
        } else {
          throw new Error('Failed to change email');
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to change email';
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
        throw error;
      }
    },
    [toast, utils]
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value = {
    state,
    fetchCurrentUser,
    updateProfile,
    changePassword,
    changeEmail,
    reset,
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = (): UsersContextType => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};
