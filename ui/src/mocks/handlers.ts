import { rest } from 'msw'

const projects = [
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

const aboutMe = {
  id: 'me',
  name: 'Test User',
  bio: 'About me bio',
}

export const handlers = [
  // GET /v1/projects/
  rest.get(/\/v1\/projects\/?$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(projects))
  }),

  // POST /v1/projects (requires Authorization header)
  rest.post(/\/v1\/projects\/?$/, async (req, res, ctx) => {
    const auth = req.headers.get('authorization')
    if (!auth) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }))
    }

    const body = await req.json()
    const newProject = { _id: String(Date.now()), timestamp: Date.now(), ...body }
    projects.push(newProject)
    return res(ctx.status(201), ctx.json(newProject))
  }),

  // GET /v1/aboutme/
  rest.get(/\/v1\/aboutme\/?$/, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(aboutMe))
  }),
]

export default handlers
import { rest } from 'msw';

export const handlers = [
  rest.get(/\/v1\/projects\/?$/, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', title: 'Proyecto 1', description: 'Descripción 1' },
        { id: '2', title: 'Proyecto 2', description: 'Descripción 2' },
      ])
    );
  }),

  rest.post(/\/v1\/projects\/?$/, (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
    }

    const body = req.body as any;

    const newProject = {
      id: '999',
      title: body.title ?? 'Nuevo proyecto',
      description: body.description ?? '',
    };

    return res(ctx.status(201), ctx.json(newProject));
  }),

  rest.get(/\/v1\/aboutme\/?$/, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'Perfil de prueba',
        role: 'Full Stack Developer',
        description: 'Este es un perfil mockeado con MSW.',
      })
    );
  }),
];
