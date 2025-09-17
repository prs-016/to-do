import Project from "./models/project.js";

const STORAGE_KEY = "todo.projects.v1";

export function saveProjects(projects = []) {
  try {
    const raw = JSON.stringify(projects.map((p) => p.toJSON()));
    localStorage.setItem(STORAGE_KEY, raw);
  } catch (err) {
    console.error("Failed to save projects:", err);
  }
}

export function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const arr = JSON.parse(raw);
    return arr.map((p) => Project.fromJSON(p));
  } catch (err) {
    console.error("Failed to parse saved projects:", err);
    return null;
  }
}