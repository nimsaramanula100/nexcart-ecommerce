import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Theme provider stores the selection and mirrors it to the document for CSS variable themes.
// Theme provider තේරීම සුරකිමින් CSS variable සඳහා document එකට ද යොදයි.
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('nexcart_theme');
    return savedTheme ? savedTheme : 'dark'; // Default to sleek modern dark theme
  });

  // Persist the current theme and expose it as a root data attribute / theme එක සුරකිමින් root data attribute එකක් ලෙස යොදයි.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexcart_theme', theme);
  }, [theme]);

  // Functional state update switches safely between the two supported modes.
  // function state update එක සහාය දක්වන modes දෙක අතර මාරු කරයි.
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
