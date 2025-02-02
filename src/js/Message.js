export default class Message {
  constructor() {
    this.container = document.querySelector('.widget');
    this.addTicket = this.addTicket.bind(this);
    this.elem = null;
  }

  init() {
    // console.log('ops!!!');
    const widget = document.createElement('div');
    widget.classList.add('message-container');
    widget.innerHTML = `
                        <div class="list"></div>
                        <div class="footer">
                                <form class="form">
                                        <input class="form-input" name="input" type="text">
                                </form>
                        </div>
                `;
    this.container.appendChild(widget);

    const formText = document.querySelector('.form');
    formText.addEventListener('submit', this.addTicket);
  }

  addTicket(event) {
    event.preventDefault();
    // console.log('!!!');
    // console.log('event.target: ', event.target);
    this.elem = document.createElement('span');
    this.elem.textContent = event.target.input.value;
    // console.log('event.target.input.value: ', event.target.input.value);
    this.positionUser();
  }

  async positionUser() {
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition((data) => {
        const { latitude, longitude } = data.coords;
        // console.log(latitude, longitude);
        this.showTicket(latitude.toFixed(5), longitude.toFixed(5));
      }, (error) => {
        this.showModal();
        // eslint-disable-next-line
        console.log(error);
      });
    }
  }

  showTicket(latitude, longitude) {
    // console.log('latitude ' + latitude);
    // console.log('longitude '+ longitude);
    const lists = document.querySelector('.list');
    const ticket = document.createElement('div');
    ticket.classList.add('ticket');
    ticket.innerHTML = `
                <div class="elem"></div>
                <div class="date">${new Date().toLocaleString()}</div>
                <div class="geo">[${latitude}, ${longitude}]</div>
                `;

    lists.insertAdjacentElement('afterbegin', ticket); // вставляем в самое начало

    const elemContainer = this.container.querySelector('.elem');

    elemContainer.insertAdjacentElement('afterbegin', this.elem);
    this.container.querySelector('.form-input').value = '';
  }

  showModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
                <div class="modal-text">Что-то пошло не так  
                        <p>К сожалению, нам не удалось определить ваше местоположение, 
                        пожалуйста, дайте разрешение на использование геолокации 
                        либо введите координаты вручную
                        </p>
                        <p>Широта и долгота через запятую</p>
                        <form class="modal-form">
                                <input class="modal-input" name="modal" type="text">
                                <div class="buttons">
                                        <button type="reset" class="reset">Отмена</button>
                                        <button type="submit" class="ok">Ok</button>
                                </div>
                        </form>
                </div>
                `;

    this.container.querySelector('.message-container').appendChild(modal);
    const btnReset = this.container.querySelector('.reset');
    btnReset.addEventListener('click', this.resetModal);

    const modalForm = this.container.querySelector('.modal-form');
    modalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const valueValidity = event.target.modal.value;
      let value;
      if (valueValidity) {
        value = this.checkValidity(valueValidity);
      } else {
        alert('Введите валидные коородинаты!');
        return;
      }

      if (value) {
        const valueCoords = value[0].split(','); // преобразуем строку в массив
        const latitude = valueCoords[0].trim();
        const longitude = valueCoords[1].trim();
        this.showTicket(latitude, longitude);
        this.resetModal();
      } else {
        alert('Введены невалидные координаты!');
        document.querySelector('.modal-input').value = '';
      }
    });
  }

  resetModal() {
    document.querySelector('.modal').remove();
    document.querySelector('.form-input').value = '';
  }

  checkValidity(string) {
    return string.match(/^\[?\d+\.\d+,\s?\-?\d+\.\d+\]?$/gm);
  }
}
