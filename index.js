import ObjectStateStorage from 'object-state-storage';

class ActionTimer {
  constructor(handlers = {}) {
    this.store = new ObjectStateStorage({ tick: 0 });
    this.handlers = handlers;
  }
  get state() {
    return this.store.state;
  }
  subscribe(fn) {
    return this.store.subscribe(fn);
  }
  start() {
    this.intervalID = global.setInterval(() => {
      this.store.setState(state => {
        return { tick: state.tick + 1 };
      });
    }, 1000);

    this.unsubsribe = this.store.subscribe(state => {
      if (this.handlers[state.tick] && typeof this.handlers[state.tick] === 'function') {
        this.handlers[state.tick](this.cancel.bind(this));
      }
    });
  }
  cancel() {
    global.clearInterval(this.intervalID);
    this.unsubsribe();
  }
}

export default ActionTimer;
