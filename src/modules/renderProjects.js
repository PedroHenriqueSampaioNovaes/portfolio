import getProjects from './get-projects';

export default async function renderProjects() {
  const container = document.querySelector('#slide');
  container.innerHTML = '';

  renderSkeleton(container);

  const projects = await getProjects();
  container.innerHTML = '';

  projects.forEach((project, i) => {
    const projectItem = createProjectItem(project, i);
    container.appendChild(projectItem);
  });
}

function renderSkeleton(container) {
  for (let i = 0; i < 4; i++) {
    const projectItem = document.createElement('li');
    projectItem.className =
      'w-75 h-47.5 lg:w-100 lg:h-70 rounded-[60px] overflow-hidden bg-linear-to-r from-cinza-500 via-cinza-700 to-cinza-500 bg-size-[200%] animate-skeleton';
    container.appendChild(projectItem);
  }
}

function createProjectItem(project, i) {
  const technologies = extractTechnologies(project.technologies);
  const card = createCard(project, i);
  const cardDetails = createCardDetails(project, i, technologies);
  const cardActions = createCardActions(project);
  cardDetails.appendChild(cardActions);
  card.appendChild(cardDetails);
  return card;
}

function extractTechnologies(technologies) {
  return technologies.replace(/\s*;\s*/g, ';').split(';');
}

function createCard(project, i) {
  const projectItem = document.createElement('li');
  projectItem.className =
    'w-75 h-47.5 lg:w-100 lg:h-70 rounded-[60px] overflow-hidden grid grid-rows-[4fr_1fr]';

  const image = document.createElement('img');
  image.className = 'object-cover w-full min-h-full h-full pointer-events-none';
  image.src = project.image.url;
  image.alt = project.title;
  projectItem.appendChild(image);

  const footer = document.createElement('div');
  footer.className =
    'bg-cinza-800 font-secondary flex items-center justify-between px-8';
  projectItem.appendChild(footer);

  const title = document.createElement('h3');
  title.className = 'text-white text-xl font-bold';
  title.textContent = project.title;
  footer.appendChild(title);

  const callToAction = document.createElement('button');
  callToAction.className =
    'cursor-pointer text-roxo-200 flex items-center gap-2';
  callToAction.textContent = 'Sobre';
  callToAction.innerHTML += `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#b292ff">
      <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  `;
  callToAction.dataset.dialogTarget = 'projects';
  callToAction.dataset.dialogItemTarget = `project-${i}`;
  footer.appendChild(callToAction);

  return projectItem;
}

function createCardDetails(project, i, technologies) {
  const itemId = `project-${i}`;

  const containerDetails = document.createElement('div');
  containerDetails.className = 'hidden';
  containerDetails.dataset.dialogItemId = itemId;

  const image = document.createElement('img');
  image.className = 'w-75 h-47.5 rounded-[60px] mb-8 object-cover';
  image.src = project.image.url;
  image.alt = project.title;
  containerDetails.appendChild(image);

  const description = document.createElement('p');
  description.className =
    'mb-8 max-w-xl min-h-14 max-h-40 overflow-y-auto text-balance text-center text-cinza-300 md:text-lg leading-relaxed';
  description.textContent = project.description;
  containerDetails.appendChild(description);

  const technologiesTitle = document.createElement('h4');
  technologiesTitle.className = 'font-secondary text-2xl mb-3';
  technologiesTitle.textContent = 'Tecnologias usadas:';
  containerDetails.appendChild(technologiesTitle);

  const technologyListElement = document.createElement('ul');
  technologyListElement.className =
    'mb-10 max-w-md flex flex-wrap justify-center gap-3 text-black *:bg-roxo-200 *:px-2.5 *:py-1 *:rounded-full *:font-medium *:text-xs lg:*:text-sm';
  containerDetails.appendChild(technologyListElement);

  technologies.forEach((technology) => {
    const technologyItem = document.createElement('li');
    technologyItem.textContent = technology;
    technologyListElement.appendChild(technologyItem);
  });

  return containerDetails;
}

function createCardActions(project) {
  const containerActions = document.createElement('div');
  containerActions.className = 'flex items-center gap-8 font-secondary';

  const button = document.createElement('button');
  button.className = 'cursor-pointer py-2 px-3 bg-red-500 rounded-full';
  button.dataset.dialogClose = '';
  button.textContent = 'Fechar';
  containerActions.appendChild(button);

  const link = document.createElement('a');
  link.href = project.url;
  link.target = '_blank';
  link.className = 'py-2 px-3 flex items-center gap-2.5 text-roxo-200';
  link.innerHTML =
    'Ver Projeto <img src="/open_in_new_tab.svg" alt="Abrir em nova aba">';
  containerActions.appendChild(link);

  return containerActions;
}
