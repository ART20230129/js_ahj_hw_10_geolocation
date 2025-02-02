import Message from '../Message';

const widget = new Message();

test('Валидно с пробелом', () => {
  const received = widget.checkValidity('51.50851, -0.1257');
  expect(received).toEqual(['51.50851, -0.1257']);
});

test('Валидно без пробела', () => {
  const received = widget.checkValidity('51.50851,0.1257');
  expect(received).toEqual(['51.50851,0.1257']);
});

test('Пустое поле', () => {
  const received = widget.checkValidity('');
  expect(received).toBe(null);
});

test('Неправильный формат', () => {
  const received = widget.checkValidity('675667,4883939');
  expect(received).toBe(null);
});

test('Не валидно', () => {
  const received = widget.checkValidity('fgdhhdhd, 34.99393');
  expect(received).toBe(null);
});

test('Неправильный формат', () => {
  const received = widget.checkValidity('[51.50851,0.1257]');
  expect(received).toBe(null);
});
