import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../Register';
import { MemoryRouter } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
jest.mock('firebase/auth');
jest.mock('sweetalert2');

describe('Register Page', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
  });

  it('should render registration form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    expect(screen.getByText('Registro')).toBeInTheDocument();
  });

  it('should handle successful registration', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({});
    (Swal.fire as jest.Mock).mockResolvedValue({});

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar Contraseña'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Registrarse'));

    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'test@example.com',
        'password123'
      );
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Registro exitoso',
        showConfirmButton: false,
        timer: 1500,
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should handle password mismatch', async () => {
    (Swal.fire as jest.Mock).mockResolvedValue({});

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar Contraseña'), {
      target: { value: 'differentpassword' },
    });
    fireEvent.click(screen.getByText('Registrarse'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Las contraseñas no coinciden',
      });
    });
  });

  it('should handle registration error', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Registration failed'));
    (Swal.fire as jest.Mock).mockResolvedValue({});

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirmar Contraseña'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Registrarse'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error en el registro',
        text: 'Registration failed',
      });
    });
  });
});
