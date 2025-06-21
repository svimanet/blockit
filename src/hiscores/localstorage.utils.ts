
/**
 * Fetch and return hiscores table data from local storage.
 * Default sort by date.
 * @returns hiscores json object
 */
export const getHiscoresFromLocalStorage = (): Array<Hiscore> => {
  const hiscoresStorage = window.localStorage.getItem('hiscores');
  const hiscores = JSON.parse(hiscoresStorage as string) as unknown as Array<Hiscore>;
  hiscores.sort((a: Hiscore, b: Hiscore) => (b.date < a.date ? -1 : b.date > a.date ? 1 : 0));
  return hiscores;
}
