import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import AdminDashboard from '../pages/AdminDashboard';

describe('AdminDashboard', () => {
  it('renders dashboard title', () => {
    render(
      <Provider store={store}>
        <AdminDashboard />
      </Provider>
    );
    expect(screen.getByText('Tableau de Bord Admin')).toBeInTheDocument();
  });

  it('renders users table header', () => {
    render(
      <Provider store={store}>
        <AdminDashboard />
      </Provider>
    );
    expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
  });
});