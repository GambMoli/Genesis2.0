import React from 'react';

export const Login: React.FC = () => {
  return (
    <div>
      <h1>LTU MAMA ME LO CHUPA RICO</h1>
      <form>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};
