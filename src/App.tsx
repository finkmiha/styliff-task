import React from 'react';
// import logo from './logo.svg';
import './App.css';
import RepoTable from './tables/repo-table';
import styliffLogo from './assets/images/styliff-logo.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          className="header-image"
          src={styliffLogo}
          alt="header logo"
        />
        <p className="header-title">
          GitHub repository search
        </p>
      </header>
      <RepoTable />
    </div>
  );
}

export default App;
