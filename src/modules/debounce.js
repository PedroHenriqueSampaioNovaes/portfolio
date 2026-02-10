export default function debounce(callback, delay = 1000) {
  let timer = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback();
    }, delay);
  };
}
