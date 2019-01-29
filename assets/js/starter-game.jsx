import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<MemoryGame />, root);
}

const constTiles = [
  {isOpen: false, isSolved: false, label: 'A'},
  {isOpen: false, isSolved: false, label: 'A'},
  {isOpen: false, isSolved: false, label: 'B'},
  {isOpen: false, isSolved: false, label: 'B'},
  {isOpen: false, isSolved: false, label: 'C'},
  {isOpen: false, isSolved: false, label: 'C'},
  {isOpen: false, isSolved: false, label: 'D'},
  {isOpen: false, isSolved: false, label: 'D'},
  {isOpen: false, isSolved: false, label: 'E'},
  {isOpen: false, isSolved: false, label: 'E'},
  {isOpen: false, isSolved: false, label: 'F'},
  {isOpen: false, isSolved: false, label: 'F'},
  {isOpen: false, isSolved: false, label: 'G'},
  {isOpen: false, isSolved: false, label: 'G'},
  {isOpen: false, isSolved: false, label: 'H'},
  {isOpen: false, isSolved: false, label: 'H'}
]

// function is attributed to the following website:
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function randomizeOrder(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  array.map((e, idx) => {
    e.index = idx;
  })

  return array;
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tiles: randomizeOrder(this.copyArray(constTiles)),
      pair: [],
      solved: 0,
      clicks: 0 
    }
  }

  handleTile(tileIdx) {
    if (this.state.pair.length < 2) {
      this.openTile(tileIdx);
      this.checkPair();
    }
  }

  openTile(tileIdx) {
    let tiles = this.state.tiles;
    const btnState = !tiles[tileIdx].isOpen;
    tiles[tileIdx].isOpen = btnState;
    if (btnState) {
      this.setState({ tiles: tiles, clicks: this.state.clicks + 1 });
    } else {
      this.setState({ tiles: tiles });
    }
    this.state.pair.push(tiles[tileIdx]);
  }

  solveTile(tileIdx) {
    let tiles = this.state.tiles;
    tiles[tileIdx].isSolved = !tiles[tileIdx].isSolved;
    this.setState({ tiles: tiles });
  }

  checkPair() {
    const pair = this.state.pair;

    if (pair.length === 2) {
      if (pair[0].label === pair[1].label) {
        this.solveTile(pair[0].index);
        this.solveTile(pair[1].index);
        this.setState({ pair: [], solved: this.state.solved + 1 });
      } else {
        new Promise(resolve => setTimeout(resolve, 1000))
        .then(closeAll => pair.map(e => this.openTile(e.index)))
        .then(reset => this.setState({ pair: [] }))
      }
    }
  }

  reset() {
    this.setState({ 
      tiles: randomizeOrder(this.copyArray(constTiles)),
      pair: [],
      solved: 0,
      clicks: 0 
    });
  }

  copyArray(array) {
    return array.map(e => Object.assign({}, e));
  }

  render() {
    const { tiles } = this.state;
    const tileRender = [];

    for (let i = 0; i < 16; i+=4) {
      tileRender.push(tiles.slice(i, i+4));
    }

    return (
      <div>
        {tileRender.map((row, rowIdx) =>
          <div key={rowIdx} className="row">
          {row.map((tile, tileIdx) => 
            <div key={tileIdx} className="column">
            <p><button style={tile.isSolved ? {backgroundColor: 'grey'} : null} 
                    onClick={_ev => this.handleTile(rowIdx*4 + tileIdx)}>
                    {tile.isOpen ? tile.label : ""}
            </button></p>
            </div>
          )}
          </div>
        )}
        <div className="container">
          <div className="row">
            <div className="column">
            Clicks: {this.state.clicks}
            </div>
            <div className="column" id="reset">
            <button onClick={_ev => this.reset()}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

