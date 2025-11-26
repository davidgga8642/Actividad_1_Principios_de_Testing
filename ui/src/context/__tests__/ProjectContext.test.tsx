import { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { ProjectProvider } from '../ProjectContext';
import useProject from '../../hooks/useProject';

const mockProject = {
  id: '1',
  name: 'Proyecto de prueba',
  description: 'Descripción de prueba',
} as any;

function wrapper({ children }: { children: ReactNode }) {
  return <ProjectProvider>{children}</ProjectProvider>;
}

describe('ProjectContext + useProject', () => {
  test('estado inicial: project es undefined', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    expect(result.current.project).toBeUndefined();
  });

  test('addProject establece el project en el estado', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    act(() => {
      result.current.addProject(mockProject);
    });

    expect(result.current.project).toEqual(mockProject);
  });

  test('removeProject pone project a undefined', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    act(() => {
      result.current.addProject(mockProject);
    });

    expect(result.current.project).toEqual(mockProject);

    act(() => {
      result.current.removeProject();
    });

    expect(result.current.project).toBeUndefined();
  });

  test('removeProject sobre un estado ya vacío no rompe la app', () => {
    const { result } = renderHook(() => useProject(), { wrapper });

    
    expect(result.current.project).toBeUndefined();

    act(() => {
      result.current.removeProject();
      result.current.removeProject();
    });

    expect(result.current.project).toBeUndefined();
  });
});