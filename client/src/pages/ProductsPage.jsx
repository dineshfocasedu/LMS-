import { useEffect, useState } from 'react'
import { api } from '../api'

function priceForCombo(product) {
  return product.comboPrice ?? product.price ?? 0
}

function StockBadge({ stock }) {
  if (stock == null) return null
  if (stock <= 5 && stock > 0)
    return (
      <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
        Only {stock} left
      </span>
    )
  return (
    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
      In stock
    </span>
  )
}

function TypeBadge({ isCourse, shipToHome }) {
  if (isCourse)
    return (
      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
        Course
      </span>
    )
  if (shipToHome)
    return (
      <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
        Kit Book
      </span>
    )
  return null
}

export default function ProductsPage({ onCheckout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState([]) // array of product._id

  useEffect(() => {
    api.getProducts()
      .then(({ products }) => setProducts(products))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  function toggle(id) {
    setCart((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const cartProducts = products.filter((p) => cart.includes(p._id))
  const cartTotal = cartProducts.reduce((sum, p) => sum + priceForCombo(p), 0)

  function handleCheckout() {
    if (cart.length === 0) return
    onCheckout(cartProducts)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <p className="text-red-600 font-medium">Failed to load products</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Course Store</h1>
            <p className="text-xs text-gray-400">Select items for your combo order</p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={handleCheckout}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <span>Cart ({cart.length})</span>
              <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No products available</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => {
                const inCart = cart.includes(product._id)
                const comboPrice = priceForCombo(product)

                return (
                  <div
                    key={product._id}
                    className={`bg-white rounded-2xl border-2 transition-all shadow-sm ${
                      inCart
                        ? 'border-blue-500 shadow-blue-100 shadow-md'
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    {/* Image */}
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-44 object-cover rounded-t-2xl"
                      />
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-2xl flex items-center justify-center">
                        <span className="text-4xl">
                          {product.isCourse ? '🎓' : '📦'}
                        </span>
                      </div>
                    )}

                    <div className="p-4 space-y-3">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <TypeBadge isCourse={product.isCourse} shipToHome={product.shipToHome} />
                        <StockBadge stock={product.stock} />
                        {product.level && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            {product.level}
                          </span>
                        )}
                      </div>

                      {/* Name & description */}
                      <div>
                        <h3 className="font-semibold text-gray-900 leading-snug">{product.name}</h3>
                        {product.description && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{comboPrice.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-300 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {product.comboPrice && product.price && product.comboPrice !== product.price && (
                          <span className="text-xs text-blue-600 font-medium">Combo price</span>
                        )}
                      </div>

                      {/* Add / Remove button */}
                      <button
                        onClick={() => toggle(product._id)}
                        className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                          inCart
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {inCart ? '✓ Added' : '+ Add to Order'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Cart Summary Sidebar — visible when items selected */}
        {cart.length > 0 && (
          <aside className="w-72 shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-24 p-5 space-y-4">
              <h2 className="font-semibold text-gray-900">Order Summary</h2>

              <ul className="space-y-3">
                {cartProducts.map((p) => (
                  <li key={p._id} className="flex items-start justify-between gap-2 text-sm">
                    <div>
                      <p className="text-gray-800 font-medium leading-snug">{p.name}</p>
                      {p.level && <p className="text-xs text-gray-400">{p.level}</p>}
                    </div>
                    <span className="text-gray-700 font-semibold whitespace-nowrap">
                      ₹{priceForCombo(p).toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600 text-base">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Proceed to Checkout →
              </button>

              <button
                onClick={() => setCart([])}
                className="w-full text-gray-400 text-xs hover:text-gray-600 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
