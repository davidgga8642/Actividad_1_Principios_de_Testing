// api/src/tests/projectsFactory.test.ts
import {
  validProject,
  invalidProjects,
  sampleProjects,
} from "./fixtures/projects";
import {
  buildProject,
  buildProjects,
  resetProjectFactory,
} from "./factories/projectsFactory";

describe("Project fixtures", () => {
  test("validProject tiene los campos mínimos necesarios", () => {
    expect(validProject.title).toBeTruthy();
    expect(validProject.description).toBeTruthy();
    expect(validProject.repoUrl).toMatch(/^https?:\/\//);
    expect(Array.isArray(validProject.technologies)).toBe(true);
  });

  test("invalidProjects contiene varias variantes inválidas", () => {
    expect(invalidProjects.withoutTitle.title).toBe("");
    expect(invalidProjects.withoutDescription.description).toBe("");
    expect(invalidProjects.withoutRepoUrl.repoUrl).toBe("");
  });

  test("sampleProjects contiene varios proyectos de ejemplo", () => {
    expect(sampleProjects).toHaveLength(3);
    sampleProjects.forEach((p) => {
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
    });
  });
});

describe("projectFactory", () => {
  beforeEach(() => {
    resetProjectFactory();
  });

  test("buildProject genera proyectos únicos por defecto", () => {
    const p1 = buildProject();
    const p2 = buildProject();

    expect(p1.id).not.toBe(p2.id);
    expect(p1.title).not.toBe(p2.title);
  });

  test("buildProject respeta los overrides", () => {
    const custom = buildProject({
      title: "Custom title",
      isActive: false,
    });

    expect(custom.title).toBe("Custom title");
    expect(custom.isActive).toBe(false);
  });

  test("buildProjects genera N proyectos", () => {
    const projects = buildProjects(5);

    expect(projects).toHaveLength(5);
    const ids = projects.map((p) => p.id);
    // todos los ids deben ser únicos
    expect(new Set(ids).size).toBe(5);
  });
});