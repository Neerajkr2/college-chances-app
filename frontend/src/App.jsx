import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Wizard from './components/Wizard';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      
      <main className="container">
        <div className="page-header">
          <h1>College Chances Calculator</h1>
          <p>See how your GPA and SAT scores measure up to your dream colleges. Get personalized estimates and
            improvement recommendations.</p>
        </div>

        <Wizard />
      </main>

      <Footer />
    </div>
  );
}

export default App;