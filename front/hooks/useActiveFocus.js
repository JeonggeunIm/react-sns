export default function useActiveFocus() {
  const body = document.querySelector('body');

  function onActiveFocus(e) {
    const setActiveEffect = () => {
      const activeInputs = document.querySelectorAll('[data-active="active"]');
      activeInputs.forEach((activeInput) => {
        if (activeInput.querySelector('input').value === '') {
          activeInput.dataset.active = '';
        }
      });
    };

    if (e.target.classList.contains('ant-input')) {
      if (e.type === 'focus') {
        setActiveEffect();
        e.target.closest('.ant-form-item').dataset.active = 'active';
      }
    } else {
      setActiveEffect();
    }
  }

  body.addEventListener('focus', onActiveFocus, { capture: true });
  body.addEventListener('click', onActiveFocus);

  return () => {
    body.removeEventListener('focus', onActiveFocus, { capture: true });
    body.removeEventListener('click', onActiveFocus);
  };
}
