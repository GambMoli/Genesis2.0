import React from 'react';
import { Header } from '../../Core/Components';

export const Login: React.FC = () => {
  return (
    <div>
      <Header></Header>
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