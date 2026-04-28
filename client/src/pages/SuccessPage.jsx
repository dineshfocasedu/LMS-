function priceForCombo(product) {
  return product.comboPrice ?? product.price ?? 0
}

export default function SuccessPage({ order, onContinue }) {
  // order: { orderId, products, total, name, grants }
  const physicalItems = order.products.filter((p) => p.shipToHome)
  const digitalItems  = order.products.filter((p) => p.isCourse)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-md p-8 space-y-6 text-center">

        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-500 text-sm mt-1">
            Thank you, <strong>{order.name}</strong>. Your combo order has been placed successfully.
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-xs text-gray-400">Order ID</p>
          <p className="font-mono text-sm font-semibold text-gray-700 mt-0.5">{order.orderId}</p>
        </div>

        {/* Items purchased */}
        <div className="text-left space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Items Ordered</p>
          <ul className="space-y-2">
            {order.products.map((p) => (
              <li key={p._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{p.isCourse ? '🎓' : '📦'}</span>
                  <span className="text-gray-800">{p.name}</span>
                </div>
                <span className="text-gray-600 font-medium">
                  ₹{priceForCombo(p).toLocaleString('en-IN')}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2 mt-1">
            <span className="text-gray-900">Total Paid</span>
            <span className="text-green-600">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* What happens next */}
        <div className="text-left space-y-3">
          {digitalItems.length > 0 && (
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl px-4 py-3">
              <span className="text-lg mt-0.5">🎓</span>
              <div>
                <p className="text-xs font-semibold text-blue-800">Course Access</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Your course access has been granted. Login to start learning.
                </p>
              </div>
            </div>
          )}

          {physicalItems.length > 0 && (
            <div className="flex items-start gap-3 bg-purple-50 rounded-xl px-4 py-3">
              <span className="text-lg mt-0.5">📦</span>
              <div>
                <p className="text-xs font-semibold text-purple-800">Kit Book Delivery</p>
                <p className="text-xs text-purple-600 mt-0.5">
                  Your kit book will be shipped to the address you provided. You'll receive tracking info shortly.
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Shop More
        </button>
      </div>
    </div>
  )
}
