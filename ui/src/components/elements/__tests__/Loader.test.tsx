
import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  test('renderiza el mensaje recibido', () => {
    render(<Loader message="Cargando datos" />);
    expect(screen.getByText('Cargando datos')).toBeInTheDocument();
  });

  test('usa el mensaje como alt de la imagen', () => {
    render(<Loader message="Mensaje ALT" />);
    const img = screen.getByAltText('Mensaje ALT');
    expect(img).toBeInTheDocument();
  });
});