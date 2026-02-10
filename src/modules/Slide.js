import debounce from './debounce.js';

export class Slide {
  constructor(wrapper, slide, alignment = 'center') {
    this.wrapper = document.querySelector(wrapper);
    this.slide = document.querySelector(slide);

    this.alignment = alignment;
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = 'active';
    this.slideIsActive = true;

    this.eventChangedSlide = new Event('changedSlide');
  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  updatePosition(clientX) {
    this.dist.movement = (clientX - this.dist.startX) * 1.6;
    return this.dist.movement + this.dist.finalPosition;
  }

  moveSlide(distX) {
    this.slide.style.transform = `translateX(${distX}px)`;
  }

  onStart(event) {
    let eventType;
    if (event.type === 'touchstart') {
      eventType = 'touchmove';
      this.dist.startX = event.touches[0].clientX;
    } else {
      eventType = 'mousemove';
      this.dist.startX = event.clientX;
    }
    this.wrapper.addEventListener(eventType, this.onMove);
    this.transition(false);
  }

  onMove(event) {
    const pointerPosition =
      event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    const eventType = event.type === 'touchend' ? 'touchmove' : 'mousemove';
    this.wrapper.removeEventListener(eventType, this.onMove);
    this.transition(true);
    this.changeSlideOnEnd();
    this.dist.movement = 0;
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.previous !== undefined) {
      this.changeSlide(this.index.previous);
    } else if (this.dist.movement < -120 && this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    } else {
      this.changeSlide(this.index.active);
    }
  }

  slidePosition(slide) {
    if (this.alignment === 'center') {
      const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
      return -(slide.offsetLeft - margin);
    } else if (this.alignment === 'left') {
      return -slide.offsetLeft;
    }
    throw new Error('Opção de alinhamento inválida.');
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { element, position };
    });
  }

  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      previous: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.changeActiveClass();
    this.dist.finalPosition = activeSlide.position;
    this.wrapper.dispatchEvent(this.eventChangedSlide);
  }

  changeActiveClass() {
    this.slideArray.forEach((item) => {
      item.element.classList.remove(this.activeClass);
    });
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  changeSlideAlignment(alignment) {
    this.alignment = alignment;
    this.slidesConfig();
    this.changeSlide(this.index.active);
  }

  onResize() {
    if (!this.slideIsActive) return;

    this.slidesConfig();
    this.changeSlide(this.index.active);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  disableSlide() {
    this.slideIsActive = false;
    this.removeSlideEvents();
    this.slide.style.transform = '';
  }

  removeSlideEvents() {
    this.wrapper.removeEventListener('mousedown', this.onStart);
    this.wrapper.removeEventListener('touchstart', this.onStart);
    this.wrapper.removeEventListener('mouseup', this.onEnd);
    this.wrapper.removeEventListener('touchend', this.onEnd);
    window.removeEventListener('resize', this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.addResizeEvent();
    this.slidesConfig();
    this.changeSlide(0);
  }
}

export default class SlideNav extends Slide {
  constructor(wrapper, slide, alignment) {
    super(wrapper, slide, alignment);
    this.bindControlEvents();
  }

  createControl(wrapperControl) {
    const control = document.createElement('ul');
    control.dataset.control = 'slide';
    this.slideArray.forEach((_, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${
        index + 1
      }</a></li>`;
    });
    const wrapper = document.querySelector(wrapperControl) || this.wrapper;
    wrapper.appendChild(control);
    return control;
  }

  activeControlItem() {
    this.controlArray.forEach((item) => {
      item.classList.remove(this.activeClass);
    });
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  addControl(control, wrapperControl) {
    this.control =
      document.querySelector(control) || this.createControl(wrapperControl);
    this.controlArray = [...this.control.children];
    this.activeControlItem();
    this.controlArray.forEach(this.eventControl);
  }

  eventControl(item, index) {
    item.addEventListener('click', () => {
      this.changeSlide(index);
    });
    this.wrapper.addEventListener('changedSlide', this.activeControlItem);
  }

  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }
}
