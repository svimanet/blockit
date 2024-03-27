
export const gameScoreForm = () => {
  return (`
    <form hx-post="api/hiscore" id="score-form" name="score form">
      <input name="name" type="name" autocomplete="name" required />
      <input name="score" type="number" required id="score" />
      <button type="submit" value>submit</button>
    </form>
  `);
};

export const Game = () => {
  return (`
    <div id="game-container">
      ${ gameScoreForm() }
      <script src='game.js' type='module'></script>
      <div id="game"/>
    </div>
  `);
}