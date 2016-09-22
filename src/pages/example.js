var React = require('react');
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Counter from '../components/Counter';
import reducer from '../reducers/counter';

const store = createStore(reducer)

var Example = React.createClass({
    displayName: "Example",
    name: 'example',
    render() {
        return (
            <Provider store={store}>
                <Counter
                     value={store.getState()}
                     onIncrement={() => store.dispatch({ type: 'INCREMENT' })}
                     onDecrement={() => store.dispatch({ type: 'DECREMENT' })}
                   />
            </Provider>
        )
    }
});

module.exports = Example;
