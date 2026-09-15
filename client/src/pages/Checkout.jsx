import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, bankDetails, deliveryOptions, formatNaira, whatsappNumber } from '../lib/api.js';
import { useCart } from '../context/CartContext.jsx';
import { getCampaign } from '../lib/analytics.js';
import { setPageMeta } from '../lib/seo.js';
import FormInput, { validators } from '../components/FormInput.jsx';
import { useAddressBook } from '../context/AddressBookContext.jsx';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { addresses, addAddress, getDefaultAddress } = useAddressBook();
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  useEffect(() => {
    setPageMeta({ title: 'Checkout', description: 'Complete your order for Roc Realm Perfumes.', noindex: true });
  }, []);

  useEffect(() => {
    const defaultAddr = getDefaultAddress();
    if (defaultAddr) {
      setSelectedAddress(defaultAddr);
      setForm(prev => ({
        ...prev,
        customerName: defaultAddr.name || prev.customerName,
        customerPhone: defaultAddr.phone || prev.customerPhone,
        customerEmail: defaultAddr.email || prev.customerEmail,
        deliveryAddress: defaultAddr.address || prev.deliveryAddress,
        deliveryCity: defaultAddr.city || prev.deliveryCity,
      }));
    }
  }, [addresses]);

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryCity: 'Owerri',
    deliveryNote: '',
    deliveryMethod: 'PICKUP',
    paymentMethod: 'BANK_TRANSFER',
  });
  const [formErrors, setFormErrors] = useState({});

  const selectedDelivery = deliveryOptions.find(o => o.value === form.deliveryMethod) || deliveryOptions[0];
  const deliveryFee = selectedDelivery.fee;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const update = (key, value) => setForm(c => ({ ...c, [key]: value }));
  const copy = value => navigator.clipboard?.writeText(String(value)).catch(() => null);

  const handleSaveAddress = () => {
    if (!form.customerName || !form.customerPhone || !form.deliveryAddress) return;
    addAddress({
      name: form.customerName,
      phone: form.customerPhone,
      email: form.customerEmail,
      address: form.deliveryAddress,
      city: form.deliveryCity,
    });
    setShowAddressBook(false);
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setForm(prev => ({
      ...prev,
      customerName: address.name || prev.customerName,
      customerPhone: address.phone || prev.customerPhone,
      customerEmail: address.email || prev.customerEmail,
      deliveryAddress: address.address || prev.deliveryAddress,
      deliveryCity: address.city || prev.deliveryCity,
    }));
    setShowAddressBook(false);
  };

  const validateCoupon = async () => {
    if (!couponCode) return;
    setCouponMessage('');
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, subtotal });
      setDiscount(res.data.discount);
      setCouponMessage(`Coupon applied: ${formatNaira(res.data.discount)} off.`);
    } catch (err) {
      setDiscount(0);
      setCouponMessage(err.response?.data?.message || 'Coupon is invalid or expired.');
    }
  };

  const submit = async e => {
    e.preventDefault();
    if (!items.length) return;

    const errors = {
      customerName: validators.required(form.customerName),
      customerPhone: validators.phone(form.customerPhone),
      customerEmail: validators.email(form.customerEmail),
      deliveryAddress: validators.required(form.deliveryAddress),
    };

    const hasError = Object.values(errors).some(v => v);
    if (hasError) {
      setFormErrors(errors);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        ...form,
        couponCode: couponCode || null,
        ...getCampaign(),
        items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
      });

      const order = res.data.order;
      const customerActionToken = res.data.customerActionToken;

      const lines = order.items.map((item, index) => `${index + 1}. ${item.productName} - ${formatNaira(item.productPrice)} x ${item.quantity}`).join('\n');

      const message = encodeURIComponent(`Hello Roc Realm Perfume, I just placed an order.\n\nOrder No: ${order.orderNumber}\nName: ${order.customerName}\nPhone: ${order.customerPhone}\nAddress: ${order.deliveryAddress}, ${order.deliveryCity || ''}\nDelivery: ${selectedDelivery.label} (${formatNaira(order.deliveryFee || 0)})\n\nItems:\n${lines}\n\nSubtotal: ${formatNaira(order.subtotal)}\nDiscount: ${formatNaira(order.discount)}\nDelivery Fee: ${formatNaira(order.deliveryFee || 0)}\nTotal: ${formatNaira(order.total)}\nPayment: ${order.paymentMethod}\n\nPlease confirm availability.`);

      clearCart();
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
      navigate('/order-success', { state: { order, customerActionToken } });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl font-semibold">Checkout</h1>
      {error && (
        <div role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 font-semibold text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          {addresses.length > 0 && (
            <div className="mb-6 rounded-2xl bg-amber-50 p-4">
              <button
                type="button"
                onClick={() => setShowAddressBook(!showAddressBook)}
                className="flex items-center justify-between w-full font-semibold text-amber-900"
              >
                <span>📍 Saved Addresses ({addresses.length})</span>
                <span>{showAddressBook ? '▼' : '▶'}</span>
              </button>
              {showAddressBook && (
                <div className="mt-4 space-y-2">
                  {addresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectAddress(addr)}
                      className={`w-full rounded-xl p-3 text-left transition ${
                        selectedAddress?.id === addr.id
                          ? 'bg-amber-200 ring-2 ring-amber-600'
                          : 'bg-white hover:bg-amber-100'
                      }`}
                    >
                      <div className="font-semibold">{addr.name}</div>
                      <div className="text-sm text-stone-600">{addr.phone}</div>
                      <div className="text-sm text-stone-600">{addr.address}, {addr.city}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="Full Name"
              value={form.customerName}
              onChange={e => update('customerName', e.target.value)}
              placeholder="Your full name"
              required
              validate={validators.required}
              error={formErrors.customerName}
              className="md:col-span-2"
            />
            <FormInput
              label="Phone Number"
              type="tel"
              value={form.customerPhone}
              onChange={e => update('customerPhone', e.target.value)}
              placeholder="WhatsApp number"
              required
              validate={validators.phone}
              error={formErrors.customerPhone}
              className="md:col-span-2"
            />
            <FormInput
              label="Email"
              type="email"
              value={form.customerEmail}
              onChange={e => update('customerEmail', e.target.value)}
              placeholder="For order confirmation"
              validate={validators.email}
              error={formErrors.customerEmail}
              className="md:col-span-2"
            />
            <FormInput
              label="Delivery Address"
              value={form.deliveryAddress}
              onChange={e => update('deliveryAddress', e.target.value)}
              placeholder="Full address"
              required
              validate={validators.required}
              error={formErrors.deliveryAddress}
              className="md:col-span-2"
            />
            <button
              type="button"
              onClick={handleSaveAddress}
              className="md:col-span-2 rounded-full border-2 border-amber-600 bg-amber-50 px-6 py-3 font-semibold text-amber-900 hover:bg-amber-100"
            >
              💾 Save Address to Address Book
            </button>
            <textarea
              placeholder="Delivery note optional"
              value={form.deliveryNote}
              onChange={e => update('deliveryNote', e.target.value)}
              className="min-h-24 rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2"
            />
            <div className="grid gap-3 rounded-2xl bg-amber-50 p-4 md:col-span-2">
              <h2 className="font-display text-2xl font-semibold">Delivery Method</h2>
              {deliveryOptions.map(o => (
                <label key={o.value} className={`cursor-pointer rounded-2xl border p-4 ${form.deliveryMethod === o.value ? 'border-amber-600 bg-white' : 'border-transparent bg-white/60'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <input type="radio" checked={form.deliveryMethod === o.value} onChange={() => update('deliveryMethod', o.value)} />
                      {o.label}
                    </span>
                    <strong>{formatNaira(o.fee)}</strong>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-stone-600">{o.note}</p>
                </label>
              ))}
            </div>
            <select
              value={form.paymentMethod}
              onChange={e => update('paymentMethod', e.target.value)}
              className="rounded-2xl bg-stone-100 px-4 py-3 outline-none md:col-span-2"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="PAY_ON_DELIVERY">Pay on Delivery</option>
              <option value="WHATSAPP_CONFIRMATION">Confirm on WhatsApp</option>
            </select>
          </div>
        </div>
        <aside className="h-fit rounded-[2rem] bg-stone-950 p-6 text-white">
          <h2 className="font-display text-2xl">Summary</h2>
          <div className="mt-5 grid gap-3 text-sm text-stone-300">
            {items.map(i => (
              <div key={i.id} className="flex justify-between gap-3">
                <span>{i.name} x {i.quantity}</span>
                <span>{formatNaira(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <input
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Coupon"
              className="w-full rounded-full bg-white/10 px-4 py-3 outline-none"
            />
            <button type="button" onClick={validateCoupon} className="rounded-full bg-white/10 px-4 py-3">
              Apply
            </button>
          </div>
          {couponMessage && (
            <p role="status" className={`mt-2 text-sm ${discount ? 'text-green-300' : 'text-red-300'}`}>
              {couponMessage}
            </p>
          )}
          {form.paymentMethod === 'BANK_TRANSFER' && (
            <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm">
              <h3 className="font-display text-xl text-amber-200">Bank Transfer Details</h3>
              <div className="mt-3 grid gap-2 text-stone-200">
                <div className="flex justify-between gap-3">
                  <span>Bank</span>
                  <strong>{bankDetails.bankName}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Account No.</span>
                  <button type="button" onClick={() => copy(bankDetails.accountNumber)} className="font-bold text-amber-200 underline">
                    {bankDetails.accountNumber}
                  </button>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Name</span>
                  <strong className="text-right">{bankDetails.accountName}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Amount</span>
                  <button type="button" onClick={() => copy(total)} className="font-bold text-amber-200 underline">
                    {formatNaira(total)}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-stone-300">
                After transfer, place the order and use “I have paid” on the success page. You can also send proof on WhatsApp.
              </p>
            </div>
          )}
          <div className="mt-6 grid gap-3 border-t border-white/10 pt-5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>{formatNaira(subtotal)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <strong>{formatNaira(discount)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <strong>{formatNaira(deliveryFee)}</strong>
            </div>
            <div className="flex justify-between text-xl">
              <span>Total</span>
              <strong>{formatNaira(total)}</strong>
            </div>
          </div>
          <button
            disabled={loading || !items.length}
            className="mt-6 w-full rounded-full bg-amber-500 px-6 py-4 font-semibold text-stone-950 disabled:opacity-50"
          >
            {loading ? 'Placing order...' : 'Place Order via WhatsApp'}
          </button>
        </aside>
      </form>
    </main>
  );
}
