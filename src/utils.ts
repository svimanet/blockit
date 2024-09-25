
export const incrementScore = (element: HTMLSpanElement, n:number): void => {
  const val = Number(element.innerText);
  const total: number = val + n;
  element.innerText = String(total);
};