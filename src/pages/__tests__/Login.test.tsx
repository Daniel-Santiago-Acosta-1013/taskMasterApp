import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { MemoryRouter } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
jest.mock('../../hooks/useAuth');
jest.mock('firebase/auth');
jest.mock('sweetalert2');

describe('Login Page', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
  });

  it('should render login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});
    (Swal.fire as jest.Mock).mockResolvedValue({});

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'test@example.com',
        'password123'
      );
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        showConfirmButton: false,
        timer: 1500,
      });
    });
  });

  it('should handle login error', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Login failed'));
    (Swal.fire as jest.Mock).mockResolvedValue({});

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByText('Iniciar Sesión'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Correo electrónico o contraseña incorrectos',
      });
    });
  });
});
