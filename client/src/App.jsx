import { useState } from 'react'
import ProductsPage from './pages/ProductsPage'
import CheckoutPage from './pages/CheckoutPage'
import SuccessPage from './pages/SuccessPage'
import Header from './components/Header'
import Footer from './components/Footer'

function priceForCombo(p) {
  return p.comboPrice ?? p.price ?? 0
}

export default function App() {
  const [view, setView] = useState('products')
  const [cartProducts, setCartProducts] = useState([])
  const [order, setOrder] = useState(null)

  const cartTotal = cartProducts.reduce((sum, p) => sum + priceForCombo(p), 0)

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        view={view}
        onBack={() => setView('products')}
        cartCount={cartProducts.length}
        cartTotal={cartTotal}
        onCheckout={() => setView('checkout')}
      />

      <main className="flex-1">
        {view === 'checkout' && (
          <CheckoutPage
            cartProducts={cartProducts}
            onSuccess={handleSuccess}
            onBack={() => setView('products')}
          />
        )}
        {view === 'success' && (
          <SuccessPage
            order={order}
            onContinue={handleContinue}
          />
        )}
        {view === 'products' && (
          <ProductsPage
            onCheckout={handleCheckout}
            // pass cart state down so the header cart button works too
          />
        )}
      </main>

      <Footer />
    </div>
  )
}