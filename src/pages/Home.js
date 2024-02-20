import React from 'react';
import './Home.css';

function Home() {
  return (
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet" />
      <header>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/data">User Data</a></li>
          </ul>
        </nav>
      </header>
      <h1>This is the home page</h1>
      <img src="https://img.logoipsum.com/245.svg" alt="Logo" />
      <div className="blob" id="blob1"></div>
      <div className="blob" id="blob2"></div>
      <div className="blob" id="blob3"></div>
      <svg id="line" viewBox="0 0 500 500" width="500" height="500">
        <path style={{ strokeWidth: '3px', strokeLinecap: 'round', stroke: 'rgb(179, 192, 239)', paintOrder: 'stroke', fill: 'none' }} d="M 410.107 119.627 C 610.559 91.754 447.468 205.23 267.236 230.292 C 98.654 236.087 197.1 61.629 103.197 159.266 C 142.803 121.311 -69.077 302.058 126.896 342.895"></path>
      </svg>
    </div>
  );
}

export default Home;
