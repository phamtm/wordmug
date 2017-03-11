import { h, render, Component } from 'preact';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

// Set up store and saga
const sagaMiddleware = createSagaMiddleware();
const storeEnhancer = compose(applyMiddleware(sagaMiddleware));

const store = createStore({}, null, storeEnhancer);
// sagaMiddleware.run();

class App extends Component {
  render() {
    return <h2>Hello mugger</h2>;
  }
}

render(<App />, document.getElementById('app'));
