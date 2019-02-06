import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel} />, root);
}

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clicks: 0,
      tiles: [],
      log: []
    }

    this.channel = props.channel;
    this.channel
    .join()
    .receive("ok", this.got_view.bind(this))
    .receive("error", resp => { console.log("Unable to join", resp); });
  }

  got_view(view) {
    console.log("View", view)
    this.setState(view.game)

    if (view.game.log.length == 2 && view.game.log[0] !== null) {
      setTimeout(() => this.channel.push("close", {}).receive("ok", this.got_view.bind(this)), 1000)
    }
  }

  handleTile(idx) {
    if (this.state.log.length < 2) {
      this.channel.push("flip", {card: idx}).receive("ok", this.got_view.bind(this))
    }
  }

  handleReset() {
    this.channel.push("reset", {}).receive("ok", this.got_view.bind(this))
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
                    {tile.label}
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
            <button onClick={_ev => this.handleReset()}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

