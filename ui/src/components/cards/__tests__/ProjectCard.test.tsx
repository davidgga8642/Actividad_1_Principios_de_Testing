// ui/src/components/cards/_tests_/ProjectCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectCard from '../ProjectCard';
import { Project } from '../../../model/project';
import useAuth from '../../../hooks/useAuth';
import useToggle from '../../../hooks/useToogle';

// Mocks manuales para evitar importar lógica real (AuthContext, etc.)
jest.mock('../../../hooks/useAuth', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../../hooks/useToogle', () => ({
  __esModule: true,
  default: jest.fn()
}));

const mockedUseAuth = useAuth as unknown as jest.MockedFunction<typeof useAuth>;
const mockedUseToggle = useToggle as unknown as jest.MockedFunction<typeof useToggle>;

const baseProject: Project = {
  _id: '1',
  title: 'Proyecto de prueba',
  description: 'Descripción de prueba',
  version: '1.0.0',
  link: 'https://example.com',
  tag: 'testing',
  timestamp: Date.now()
};

describe('ProjectCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('muestra el título del proyecto y el caption', () => {
    mockedUseAuth.mockReturnValue({ user: undefined } as any);
    mockedUseToggle.mockReturnValue([false, jest.fn()]);

    render(
      <ProjectCard
        project={baseProject}
        closeButton={jest.fn()}
        updateButton={jest.fn()}
        captionText="Proyecto destacado"
      />
    );

    expect(screen.getByText('Proyecto de prueba')).toBeInTheDocument();
    expect(screen.getByText('Proyecto destacado')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  test('si no hay usuario autenticado no se muestra el menú (Update / Delete)', () => {
    mockedUseAuth.mockReturnValue({ user: undefined } as any);
    mockedUseToggle.mockReturnValue([false, jest.fn()]);

    render(
      <ProjectCard
        project={baseProject}
        closeButton={jest.fn()}
        updateButton={jest.fn()}
      />
    );

    expect(screen.queryByText('Update')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  test('al hacer clic en el botón de tres puntos se llama al toggle del menú', () => {
    const toggleMock = jest.fn();

    mockedUseAuth.mockReturnValue({ user: { _id: 'u1' } } as any);
    mockedUseToggle.mockReturnValue([false, toggleMock]);

    const { getByRole } = render(
      <ProjectCard
        project={baseProject}
        closeButton={jest.fn()}
        updateButton={jest.fn()}
      />
    );

    const kebabButton = getByRole('button');
    fireEvent.click(kebabButton);

    expect(toggleMock).toHaveBeenCalledTimes(1);
  });

  test('cuando el menú está visible, Update y Delete llaman a las funciones pasadas por props', () => {
    mockedUseAuth.mockReturnValue({ user: { _id: 'u1' } } as any);
    mockedUseToggle.mockReturnValue([true, jest.fn()]);

    const onUpdate = jest.fn();
    const onClose = jest.fn();

    render(
      <ProjectCard
        project={baseProject}
        closeButton={onClose}
        updateButton={onUpdate}
      />
    );

    const updateButton = screen.getByText('Update');
    const deleteButton = screen.getByText('Delete');

    fireEvent.click(updateButton);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate.mock.calls[0][1]).toEqual(baseProject);

    fireEvent.click(deleteButton);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose.mock.calls[0][1]).toBe(baseProject._id);
  });
});