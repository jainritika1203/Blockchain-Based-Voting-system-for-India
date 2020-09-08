import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Voting from './components/Voting';
import Auth from './components/Auth';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <h1>Hello</h1> */}
        <Switch>
          <Route exact path='/voting' component={Voting} />
          <Route component={Auth} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
