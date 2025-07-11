import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, addToWishlist, removeFromWishlist } from '../../redux/reducers/cartReducer';
import '/src/styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.cart.wishlist);
  const isWishlisted = product ? wishlist.some(item => item._id === product._id) : false;

  const [imgSrc, setImgSrc] = useState(product.imageUrl || '/images/products/default-product.jpg');

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation when clicking wishlist button
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation when clicking add to cart button

    const itemToAdd = {
      ...product,
      quantity: 1,
      // Provide default color and size from the first available options
      color: product.colors && product.colors.length > 0 ? product.colors[0] : 'Default Color',
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Default Size',
    };
    
    dispatch(addToCart(itemToAdd));
    // You might want to add a Snackbar notification here, similar to ProductDetails.jsx
    // However, for product lists, a single Snackbar managed at a higher level (e.g., Shop.jsx)
    // that responds to cart additions might be more appropriate to avoid multiple pop-ups.
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image-container">
        <img
          src={imgSrc}
          alt={product.name}
          className="product-image"
          onError={() => setImgSrc('/images/products/default-product.jpg')}
        />
        <button
          className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? "white" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div className="product-info">
        <div className="brand-name">{product.brand}</div>
        <h3 className="product-name-card">{product.name}</h3>
        <div className="price-container">
          <div className="current-price">Rs. {product.price.toLocaleString()}</div>
          {product.originalPrice && (
            <div className="original-price">Rs. {product.originalPrice.toLocaleString()}</div>
          )}
          {product.discount && (
            <div className="discount">{product.discount}% OFF</div>
          )}
        </div>
        <div className="button-container">
          <Link to={`/product/${product._id}`} className="buy-now">Buy Now</Link>
          <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;