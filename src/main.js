import Dialog from './modules/Dialog';
import SlideNav from './modules/Slide';
import debounce from './modules/debounce';
import renderProjects from './modules/renderProjects';
import setupSendMail from './modules/send-mail';

setupSendMail();

await renderProjects();

const projectSlide = new SlideNav('#slide-wrapper', '#slide', 'left');
projectSlide.init();
projectSlide.addControl(null, '#slide-wrapper-controls');

// handle the slide related to the technologies section
let slideTechnologies = null;

function handleSlides() {
  const isMobile = window.matchMedia('(max-width: 1023px)').matches;
  if (isMobile) {
    if (!slideTechnologies) {
      slideTechnologies = new SlideNav(
        '#slide-technologies-wrapper',
        '#slide-technologies',
      );
      slideTechnologies.init();
    }
    projectSlide.changeSlideAlignment('center');
  } else {
    if (slideTechnologies) {
      slideTechnologies.disableSlide();
      slideTechnologies = null;
    }
    projectSlide.changeSlideAlignment('left');
  }
}

function handleResize() {
  handleSlides();
}
handleResize();
handleResize = debounce(handleResize, 200);

window.addEventListener('resize', handleResize);

// dialog
const dialog = new Dialog('[data-dialog-id="projects"]');
dialog.init();
