import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import ProductCard from '../components/ProductCard';

describe('ProductCard', () => {
  const product = { _id: '1', name: 'Test Product', price: 10, imageUrl: 'test.jpg' };

  it('renders product name', () => {
    render(
      <Provider store={store}>
        <ProductCard product={product} />
      </Provider>
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(
      <Provider store={store}>
        <ProductCard product={product} />
      </Provider>
    );
    expect(screen.getByText('$10')).toBeInTheDocument();
  });

  it('renders add to cart button', () => {
    render(
      <Provider store={store}>
        <ProductCard product={product} />
      </Provider>
    );
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });
});