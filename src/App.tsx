import React from 'react';
import './App.scss';
import Editor from './components/editor/Editor';

function App(): React.ReactElement {
  return (
    <div className="App">
      <Editor />
    </div>
  );
}

export default App;
