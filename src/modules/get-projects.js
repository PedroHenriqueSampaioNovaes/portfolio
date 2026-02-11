export default async function getProjects() {
  const url = import.meta.env.VITE_COSMIC_GET_OBJECT_API_URL;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  const data = await response.json();
  const projects = data.object.metadata.projects;

  return projects;
}
