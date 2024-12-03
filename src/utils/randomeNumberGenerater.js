export const randomeNumberGenerater = () => {
    const arr = new Uint8Array(20);
    typeof window !== "undefined" ?  window.crypto.getRandomValues(arr) : false;
    return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
  };
  