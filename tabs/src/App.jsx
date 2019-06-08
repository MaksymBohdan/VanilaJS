import React, { Component } from 'react';
import s from './App.module.css'

class App extends Component {
  state = {
    tabs: [
      { id: 0, title: "Tab1", content: 'Lorembb ipsum dolor sit amet consectetur adipisicing elit. Molestiae, explicabo.' },
      { id: 1, title: "Tab2", content: 'Lorem ipsum dolor sit amet.' },
      { id: 2, title: "Tab3", content: 'Lorem ipsum dolor sit amet consectetur adipisicing.' }],
    activeTabIndex: 0,

  }

  changeActiveTabIndex = (inx) => this.setState({ activeTabIndex: inx })

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.activeTabIndex !== this.state.activeTabIndex;
  }

  render() {
    const { tabs, activeTabIndex } = this.state;
    const { content } = tabs[activeTabIndex];

    console.log('object');
    return (
      <div className={s.constainer}>
        <div className="actions">
          {tabs.map((tab, inx) => <button
            type="button"
            className={activeTabIndex === inx ? s.active : s.btn}
            key={tab.id}
            onClick={() => this.changeActiveTabIndex(inx)}
          >
            {tab.title}
          </button>)}
        </div>
        <p>
          {content}
        </p>
      </div>
    );
  }
}

export default App;


