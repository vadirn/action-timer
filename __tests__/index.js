import ActionTimer from '..';

describe('ActionTimer', () => {
  it('.start() runs interval, that increments tick value every second', () => {
    const timer = new ActionTimer();
    timer.start();
    const result = new Promise(resolve => {
      global.setTimeout(() => {
        timer.cancel();
        resolve();
      }, 3000);
    });
    return result.then(() => {
      expect(timer.store.state.tick).toEqual(2);
    });
  });
  it('constructor accepts handlers, that run when specified tick is reached', () => {
    const timer = new ActionTimer({
      3: cancel => {
        cancel();
        expect(timer.state.tick).toEqual(3);
      },
    });
    timer.start();
  });
  it('can be used to make sure async event is fired in time', () => {
    const asyncAction = new Promise((resolve, reject) => {
      const timer = new ActionTimer();
      const timeoutID = global.setTimeout(() => {
        resolve(timer);
      }, 1000);
      timer.handlers = {
        3: cancel => {
          cancel();
          global.clearTimeout(timeoutID);
          reject(timer);
        },
      };
      timer.start();
    });
    return asyncAction.then(timer => {
      expect(timer.state.tick <= 1).toEqual(true);
    });
  });
});
