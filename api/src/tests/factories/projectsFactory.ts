import { ProjectFixture } from "../fixtures/projects";

let projectIdCounter = 1;

export function buildProject(
  overrides: Partial<ProjectFixture> = {}
): ProjectFixture {
  const id = overrides.id ?? `project-${projectIdCounter}`;

  const project: ProjectFixture = {
    id,
    title: overrides.title ?? `Proyecto ${projectIdCounter}`,
    description:
      overrides.description ?? `Descripción del proyecto ${projectIdCounter}`,
    technologies: overrides.technologies ?? ["Node.js", "React"],
    repoUrl:
      overrides.repoUrl ??
      `https://github.com/example/project-${projectIdCounter}`,
    liveUrl:
      overrides.liveUrl ??
      `https://example.com/project-${projectIdCounter}`,
    priority: overrides.priority ?? 1,
    isActive:
      overrides.isActive !== undefined ? overrides.isActive : true,
  };

  projectIdCounter += 1;

  return project;
}

export function buildProjects(
  count: number,
  overrides: Partial<ProjectFixture> = {}
): ProjectFixture[] {
  return Array.from({ length: count }, () => buildProject(overrides));
}

export function resetProjectFactory(): void {
  projectIdCounter = 1;
}