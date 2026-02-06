const form = document.querySelector('#contact-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  emailjs
    .sendForm(
      'service_qug3bgp',
      'template_e9kzgib',
      event.currentTarget,
      'HUL6DhVXJxuJu8INw'
    )
    .then(() => alert('Mensagem enviada com sucesso!'))
    .catch((err) => {
      alert('Ocorreu um erro ao enviar a mensagem.');
      console.error(err);
    });
});
