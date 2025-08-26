import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">SSAFY 챗봇</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/chat">채팅</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">로그인</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">회원가입</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
