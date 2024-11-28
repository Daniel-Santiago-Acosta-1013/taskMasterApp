import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../Home';
import { Provider } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { configureStore } from '@reduxjs/toolkit';
import useAuth from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');
jest.mock('../../firebaseConfig');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Home Page', () => {
  const mockNavigate = jest.fn();
  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });
    auth.signOut = mockSignOut;
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('should render without crashing', () => {
    const store = configureStore({ reducer: {} });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('TaskMaster')).toBeInTheDocument();
    expect(screen.getByText('Hola, test@example.com')).toBeInTheDocument();
  });

  it('should call signOut and navigate to login on logout', () => {
    const store = configureStore({ reducer: {} });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Cerrar sesión'));
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should redirect to login if user is not authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    const store = configureStore({ reducer: {} });
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
