import React, { Component } from 'react';
import './App.css';

const center = { x: 350, y: 250 }

class App extends Component {

  constructor() {
    super();

    var q1 = {
      x: center.x + 35,
      y: center.y + 35,
      length: 200,
      thickness: 30,
      rotation: 0,
    }

    var q2 = {
      x: 0,
      y: 0,
      length: 150,
      thickness: 20,
      rotation: 0,
    }

    this.state = { q1, q2 }
  }

  componentDidMount() {
    document.querySelector('body').addEventListener('mousemove', this.myHandler.bind(this));
  }

  componentWillUnmount() {
    document.querySelector('body').removeEventListener('mousemove', this.myHandler.bind(this));
  }

  myHandler(e) {
    const { clientX, clientY } = e;

    if (clientY < 130 && clientX < 750) { 
      return;
    }

    this.moveTo({ x: clientX, y: window.innerHeight - clientY });
  }

  render() {
    const { q1, q2, x, y } = this.state;

    q2.x = q1.x + (q1.length - q1.thickness) * Math.cos(q1.rotation * Math.PI / 180);
    q2.y = q1.y - (q1.length - q1.thickness) * Math.sin(q1.rotation * Math.PI / 180);

    return (
      <div className="App">
        <div className="controls">
          <h1>coolbeans</h1>
          <input type="range" style={{ width: 300 }} min={-180} max={180} value={q1.rotation} onChange={this.onQ1RangeChange.bind(this)} />
          <input type="range" style={{ width: 300 }} min={-180} max={180} value={q2.rotation} onChange={this.onQ2RangeChange.bind(this)} />
          <input type="number" min={-90} max={0} value={q1.rotation} onChange={this.onQ1RangeChange.bind(this)} />
          <input type="number" min={-180} max={180} value={q2.rotation} onChange={this.onQ2RangeChange.bind(this)} />
        </div>
        <div className="cursor" style={{ bottom: y - 15, left: x - 15 }}></div>
        <div className="base" style={{ width: 50, height: 50, left: center.x, bottom: center.y }}></div>
        <div className="q1" style={{
          width: q1.length,
          height: q1.thickness,
          left: q1.x - q1.thickness / 2,
          bottom: q1.y - q1.thickness / 2,
          transform: `rotate(${q1.rotation}deg)`,
          transformOrigin: `${q1.thickness / 2}px center`,
          borderRadius: `${q1.thickness / 2}px`
        }}>q1</div>
        <div className="q2" style={{ width: q2.length,
          height: q2.thickness,
          left: q2.x - q2.thickness / 2,
          bottom: q2.y - q2.thickness / 2,
          transform: `rotate(${parseFloat(q1.rotation) + parseFloat(q2.rotation)}deg)`,
          transformOrigin: `${q2.thickness / 2}px center`,
          borderRadius: `${q2.thickness / 2}px`
        }}>q2
          <div className="gripper"></div>
        </div>
      </div>
    );
  }

  onQ1RangeChange(e) {
    var rotation = e.target.value;
    this.setState(prevState => ({
      q1: { ...prevState.q1, rotation },
    }));
  }

  onQ2RangeChange(e) {
    var rotation = e.target.value;
    this.setState(prevState => ({
      q2: { ...prevState.q2, rotation }
    }));
  }

  moveTo({ x, y }) {
    this.setState(prevState => {
      const normalizedX = x - (center.x + 35);
      const normalizedY = y - (center.y + 35);

      const h = Math.sqrt(normalizedX**2 + normalizedY**2);
      const { q1, q2 } = prevState;
      const q1Length = q1.length - q1.thickness;
      const q2Length = q2.length - q2.thickness + 25;
      const O = Math.atan2(normalizedY, normalizedX) * 180 / Math.PI;

      if (h > (q1Length + q2Length)) {
        return {
          q1: { ...q1, rotation: -O },
          q2: { ...q2, rotation: 0 },
          x,
          y,
        };
      }

      if (0 === h) {
        return;
      }

      const A = this.cosARule(q2Length, q1Length, h);
      const C = this.cosARule(h, q1Length, q2Length);

      var q1Rotation = - O - A;
      var q2Rotation = 180 - C;

      return {
        q1: { ...q1, rotation: q1Rotation },
        q2: { ...q2, rotation: q2Rotation },
        x,
        y,
      }
    });
  }

  cosARule(a, b, c) {
    return Math.acos((b**2 + c**2 - a**2) / (2 * b * c)) * 180 / Math.PI;
  }
}

export default App;
