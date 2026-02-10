export default class Dialog {
  constructor(dialog) {
    this.dialog = document.querySelector(dialog);
    this.dialogContentContainer = this.dialog.querySelector(
      '[data-dialog-content-container]',
    );
    this.openButtons = document.querySelectorAll(
      `[data-dialog-target="${this.dialog.dataset.dialogId}"]`,
    );
  }

  renderDialogContents(contentItem) {
    this.dialogContentContainer.innerHTML = contentItem.innerHTML;
  }

  open({ currentTarget }) {
    this.dialog.classList.replace('hidden', 'block');

    const contentItem = document.querySelector(
      `[data-dialog-item-id="${currentTarget.dataset.dialogItemTarget}"]`,
    );
    this.renderDialogContents(contentItem);
  }

  close(event) {
    if (event.target.hasAttribute('data-dialog-close')) {
      this.dialog.classList.replace('block', 'hidden');
    }
  }

  bindEvents() {
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  addDialogEvents() {
    this.openButtons.forEach((btn) => btn.addEventListener('click', this.open));
    this.dialog.addEventListener('click', this.close);
  }

  init() {
    this.bindEvents();
    this.addDialogEvents();
  }
}
