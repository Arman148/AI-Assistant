import React from 'react';
import "./Style.css"

const Menu = ({ themes, onSelectTheme }) => {
  return (
    <div className="menu">
      <h2>Topics</h2>
      {themes.map((theme, index) => (
        <button key={index} onClick={() => onSelectTheme(theme)}>
          {theme}
        </button>
      ))}
    </div>
  );
};

export default Menu;
