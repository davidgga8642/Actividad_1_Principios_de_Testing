import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../../api/api-client-factory', () => {
  return {
    __esModule: true,
    default: () => ({
      getDashboardInfo: async () => {
        const aboutResp = await fetch('/v1/aboutme/')
        if (!aboutResp.ok) throw new Error('About fetch failed')
        const about = await aboutResp.json()

        const projectsResp = await fetch('/v1/projects/')
        if (!projectsResp.ok) throw new Error('Projects fetch failed')
        const projects = await projectsResp.json()

        return { aboutMe: about, projects }
      }
    })
  }
})

import Dashboard from '../routes/Dashboard'
import { AuthProvider } from '../../context/AuthContext'
import { ProjectProvider } from '../../context/ProjectContext'

const projectFixtures = [
  {
    _id: '1',
    title: 'Project One',
    description: 'First project',
    version: '1.0',
    link: 'http://example.com/1',
    tag: 'web',
    timestamp: Date.now(),
  },
  {
    _id: '2',
    title: 'Project Two',
    description: 'Second project',
    version: '1.1',
    link: 'http://example.com/2',
    tag: 'api',
    timestamp: Date.now() - 1000,
  },
]

const aboutFixture = { id: 'me', name: 'Test User', bio: 'About me bio' }

beforeEach(() => {
  // Ensure a clean fetch mock per test
  global.fetch = jest.fn()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Dashboard (project list) integration with MSW', () => {
  test('Carga de proyectos exitosa: muestra proyectos después de loading', async () => {
    // Mock fetch for aboutme and projects
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/v1/aboutme')) {
        return Promise.resolve({ ok: true, json: async () => aboutFixture })
      }
      if (url.includes('/v1/projects')) {
        return Promise.resolve({ ok: true, json: async () => projectFixtures })
      }
      return Promise.resolve({ ok: false, status: 404 })
    })

    render(
      <AuthProvider>
        <ProjectProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ProjectProvider>
      </AuthProvider>
    )

    // Loading indicator present initially
    expect(screen.getByText(/Loading data/i)).toBeInTheDocument()

    // Wait for a known project title to appear
    await waitFor(() => expect(screen.getByText('Project One')).toBeInTheDocument())
    expect(screen.getByText('Project Two')).toBeInTheDocument()
  })

  test('Error de servidor: muestra mensaje de error', async () => {
    // Simulate server error for projects endpoint by mocking fetch
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/v1/aboutme')) {
        return Promise.resolve({ ok: true, json: async () => aboutFixture })
      }
      if (url.includes('/v1/projects')) {
        return Promise.resolve({ ok: false, status: 500 })
      }
      return Promise.resolve({ ok: false, status: 404 })
    })

    render(
      <AuthProvider>
        <ProjectProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ProjectProvider>
      </AuthProvider>
    )

    // Wait for error message from translations (or i18n key if not initialized)
    await waitFor(() => expect(screen.getByText(/Error loading data|dashboard\.error/)).toBeInTheDocument())
  })

  test('Lista vacía: muestra sin proyectos cuando el endpoint devuelve array vacío', async () => {
    ;(global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/v1/aboutme')) {
        return Promise.resolve({ ok: true, json: async () => aboutFixture })
      }
      if (url.includes('/v1/projects')) {
        return Promise.resolve({ ok: true, json: async () => [] })
      }
      return Promise.resolve({ ok: false, status: 404 })
    })

    render(
      <AuthProvider>
        <ProjectProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </ProjectProvider>
      </AuthProvider>
    )

    // Ensure previous loading state goes away
    await waitFor(() => expect(screen.queryByText(/Loading data/i)).not.toBeInTheDocument())

    // The fixture project titles should not be present
    expect(screen.queryByText('Project One')).not.toBeInTheDocument()
    expect(screen.queryByText('Project Two')).not.toBeInTheDocument()
  })
})
