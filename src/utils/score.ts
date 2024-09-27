

export const incrementScore = (n:number): void => {
  const element = document.getElementById('score') as HTMLSpanElement;
  const val = Number(element.innerText);
  const total: number = val + n;
  element.innerText = String(total);
};