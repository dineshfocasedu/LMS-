import { useState } from 'react'
import ProductsPage from './pages/ProductsPage'
import CheckoutPage from './pages/CheckoutPage'
import SuccessPage from './pages/SuccessPage'

// view: 'products' | 'checkout' | 'success'
export default function App() {
  const [view, setView] = useState('products')
  const [cartProducts, setCartProducts] = useState([])
  const [order, setOrder] = useState(null)

  function handleCheckout(selectedProducts) {
    setCartProducts(selectedProducts)
    setView('checkout')
  }

  function handleSuccess(orderInfo) {
    setOrder(orderInfo)
    setView('success')
  }

  function handleContinue() {
    setCartProducts([])
    setOrder(null)
    setView('products')
  }

  if (view === 'checkout') {
    return (
      <CheckoutPage
        cartProducts={cartProducts}
        onSuccess={handleSuccess}
        onBack={() => setView('products')}
      />
    )
  }

  if (view === 'success') {
    return (
      <SuccessPage
        order={order}
        onContinue={handleContinue}
      />
    )
  }

  return (
    <ProductsPage onCheckout={handleCheckout} />
  )
}
