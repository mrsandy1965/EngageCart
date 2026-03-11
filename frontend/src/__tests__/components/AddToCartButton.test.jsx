/**
 * AddToCartButton — component tests
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock CartContext
const mockAddToCart = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('../../hooks/useCart', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

import { useCart } from '../../hooks/useCart';
import AddToCartButton from '../../components/cart/AddToCartButton';

const inStockProduct = { _id: 'prod1', name: 'Watch', stock: 10 };
const outOfStockProduct = { _id: 'prod2', name: 'Shoes', stock: 0 };

function setupCart(qty = 0) {
  useCart.mockReturnValue({
    cart: qty > 0
      ? { items: [{ product: { _id: 'prod1' }, quantity: qty }] }
      : { items: [] },
    addToCart: mockAddToCart,
    updateQuantity: mockUpdateQuantity,
    removeItem: mockRemoveItem,
  });
}

beforeEach(() => jest.clearAllMocks());

describe('AddToCartButton', () => {
  it('renders "Add to Cart" when product not in cart', () => {
    setupCart(0);
    render(<AddToCartButton product={inStockProduct} />);
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('renders "Out of Stock" when stock is 0', () => {
    setupCart(0);
    render(<AddToCartButton product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows stepper with qty when item is in cart', () => {
    setupCart(3);
    render(<AddToCartButton product={inStockProduct} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByLabelText('Decrease')).toBeInTheDocument();
    expect(screen.getByLabelText('Increase')).toBeInTheDocument();
  });

  it('calls addToCart when "Add to Cart" is clicked', async () => {
    setupCart(0);
    mockAddToCart.mockResolvedValue({});
    render(<AddToCartButton product={inStockProduct} />);
    fireEvent.click(screen.getByText('Add to Cart'));
    await waitFor(() => expect(mockAddToCart).toHaveBeenCalledWith('prod1', 1));
  });

  it('calls updateQuantity on + click', async () => {
    setupCart(2);
    mockUpdateQuantity.mockResolvedValue({});
    render(<AddToCartButton product={inStockProduct} />);
    fireEvent.click(screen.getByLabelText('Increase'));
    await waitFor(() => expect(mockUpdateQuantity).toHaveBeenCalledWith('prod1', 3));
  });

  it('calls updateQuantity on - click when qty > 1', async () => {
    setupCart(2);
    mockUpdateQuantity.mockResolvedValue({});
    render(<AddToCartButton product={inStockProduct} />);
    fireEvent.click(screen.getByLabelText('Decrease'));
    await waitFor(() => expect(mockUpdateQuantity).toHaveBeenCalledWith('prod1', 1));
  });

  it('calls removeItem when - clicked and qty is 1', async () => {
    setupCart(1);
    mockRemoveItem.mockResolvedValue({});
    render(<AddToCartButton product={inStockProduct} />);
    fireEvent.click(screen.getByLabelText('Decrease'));
    await waitFor(() => expect(mockRemoveItem).toHaveBeenCalledWith('prod1'));
  });

  it('disables + button when qty equals stock', () => {
    setupCart(10);
    render(<AddToCartButton product={inStockProduct} />);
    expect(screen.getByLabelText('Increase')).toBeDisabled();
  });
});
