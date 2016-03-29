import React from 'react';

import './main.scss';

const App = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.children || <p>Main</p>}
      </div>
    );
  }
});

export default App;
