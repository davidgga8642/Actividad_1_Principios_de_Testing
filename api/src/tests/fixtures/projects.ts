export type ProjectFixture = {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  repoUrl: string;
  liveUrl?: string;
  priority: number;
  isActive: boolean;
};

export const validProject: ProjectFixture = {
  id: "project-1",
  title: "Portfolio Web",
  description: "Aplicación web para mostrar proyectos personales.",
  technologies: ["React", "TypeScript", "Node.js"],
  repoUrl: "https://github.com/example/portfolio",
  liveUrl: "https://example.com/portfolio",
  priority: 1,
  isActive: true,
};

export const invalidProjects = {
  withoutTitle: {
    id: "invalid-1",
    title: "",
    description: "Sin título",
    technologies: ["React"],
    repoUrl: "https://github.com/example/invalid-no-title",
    priority: 1,
    isActive: true,
  } as ProjectFixture,
  withoutDescription: {
    id: "invalid-2",
    title: "Proyecto sin descripción",
    description: "",
    technologies: ["Node.js"],
    repoUrl: "https://github.com/example/invalid-no-description",
    priority: 2,
    isActive: true,
  } as ProjectFixture,
  withoutRepoUrl: {
    id: "invalid-3",
    title: "Proyecto sin repo",
    description: "Falta la URL del repositorio",
    technologies: ["TypeScript"],
    repoUrl: "",
    priority: 3,
    isActive: false,
  } as ProjectFixture,
};

export const sampleProjects: ProjectFixture[] = [
  {
    id: "sample-1",
    title: "Ecommerce",
    description: "Tienda online con carrito y pagos.",
    technologies: ["React", "Redux", "Node.js"],
    repoUrl: "https://github.com/example/ecommerce",
    liveUrl: "https://example.com/ecommerce",
    priority: 1,
    isActive: true,
  },
  {
    id: "sample-2",
    title: "API REST",
    description: "API para gestionar recursos.",
    technologies: ["Node.js", "Express", "MongoDB"],
    repoUrl: "https://github.com/example/api-rest",
    priority: 2,
    isActive: true,
  },
  {
    id: "sample-3",
    title: "Dashboard Admin",
    description: "Panel de administración con gráficas.",
    technologies: ["React", "Recharts"],
    repoUrl: "https://github.com/example/dashboard",
    liveUrl: "https://example.com/dashboard",
    priority: 3,
    isActive: false,
  },
];