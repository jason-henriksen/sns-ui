import React from 'react';
import { Provider } from 'mobx-react';                                    // provide model data to components

import DataStore from './data/DataStore';
import MainPage from './ui/MainPage';


function App() {
  return (
    <div className="App">
      <Provider DataStore={DataStore}>
        <MainPage/>
      </Provider>
    </div>

  );
}

export default App;
