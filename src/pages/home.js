var React = require('react');

var Home = React.createClass({
    displayName: "Home",
    name: 'home',
    render: function() {
        return (
            <section>
                <h1>Home Page!!</h1>
            </section>
        )
    }
});

module.exports = Home;
