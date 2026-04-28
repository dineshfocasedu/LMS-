import { useState } from 'react'
import { api } from '../api'

function priceForCombo(product) {
  return product.comboPrice ?? product.price ?? 0
}

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry',
]

export default function CheckoutPage({ cartProducts, onSuccess, onBack }) {
  const [form, setForm] = useState({
    name: '', phone: '',
    line1: '', line2: '', city: '', state: '', pincode: '',
  })
  const [errors, setErrors] = useState({})
  const [paying, setPaying] = useState(false)
  const [apiError, setApiError] = useState('')

  const cartTotal = cartProducts.reduce((sum, p) => sum + priceForCombo(p), 0)

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid 10-digit phone number'
    if (!form.line1.trim()) e.line1 = 'Address line 1 is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.state) e.state = 'State is required'
    if (!form.pincode.trim()) e.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    return e
  }

  async function handlePay(e) {
    e.preventDefault()
    setApiError('')
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }

    setPaying(true)
    try {
      const loaded = await loadRazorpay()
      if (!loaded) throw new Error('Failed to load payment gateway. Check your connection.')

      const productIds = cartProducts.map((p) => p._id)

      const order = await api.createOrder({
        productIds,
        name: form.name.trim(),
        phoneNumber: form.phone.trim(),
        source: 'combo',
      })

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.key,
          amount: order.amount,
          currency: order.currency || 'INR',
          order_id: order.orderId,
          name: 'Course Store',
          description: cartProducts.map((p) => p.name).join(', '),
          prefill: {
            name: form.name.trim(),
            contact: form.phone.trim(),
          },
          theme: { color: '#2563eb' },
          handler: async (response) => {
            try {
              const result = await api.verifyPayment({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
                productIds,
                name: form.name.trim(),
                phoneNumber: form.phone.trim(),
                source: 'combo',
                address: {
                  line1:   form.line1.trim(),
                  line2:   form.line2.trim() || undefined,
                  city:    form.city.trim(),
                  state:   form.state,
                  pincode: form.pincode.trim(),
                },
              })
              resolve(result)
            } catch (err) {
              reject(err)
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment cancelled')),
          },
        })
        rzp.open()
      })
        .then((result) => {
          onSuccess({
            orderId: order.orderId,
            products: cartProducts,
            total: cartTotal,
            name: form.name.trim(),
            grants: result.grants || [],
          })
        })
        .catch((err) => {
          if (err.message !== 'Payment cancelled') setApiError(err.message)
        })
    } catch (err) {
      setApiError(err.message)
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-700 transition-colors text-sm flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form — left */}
        <form onSubmit={handlePay} className="lg:col-span-3 space-y-6">

          {/* Personal Details */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Personal Details</h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="Enter your full name"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </section>

          {/* Delivery Address */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Delivery Address</h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                value={form.line1}
                onChange={(e) => setField('line1', e.target.value)}
                placeholder="House no., Street, Area"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.line1 ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.line1 && <p className="text-red-500 text-xs mt-1">{errors.line1}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Address Line 2 <span className="text-gray-400">(optional)</span>
              </label>
              <input
                value={form.line2}
                onChange={(e) => setField('line2', e.target.value)}
                placeholder="Landmark, Colony (optional)"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  placeholder="City"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.pincode}
                  onChange={(e) => setField('pincode', e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.pincode ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={form.state}
                onChange={(e) => setField('state', e.target.value)}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.state ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </section>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={paying}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {paying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${cartTotal.toLocaleString('en-IN')}`
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            Secured by Razorpay. Your payment info is never stored on our servers.
          </p>
        </form>

        {/* Order Summary — right */}
        <aside className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24 space-y-4">
            <h2 className="font-semibold text-gray-900">Order Summary</h2>

            <ul className="space-y-3">
              {cartProducts.map((p) => (
                <li key={p._id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                      {p.isCourse ? '🎓' : '📦'}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium leading-snug">{p.name}</p>
                      {p.level && <p className="text-xs text-gray-400">{p.level}</p>}
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900 whitespace-nowrap">
                    ₹{priceForCombo(p).toLocaleString('en-IN')}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 pt-3 space-y-1">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900">
                <span>Total</span>
                <span className="text-blue-600 text-base">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl px-3 py-2.5 text-xs text-blue-700 space-y-1">
              <p className="font-semibold">Combo Order</p>
              <p>Physical kit book will be shipped to your address. Course access granted instantly after payment.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
