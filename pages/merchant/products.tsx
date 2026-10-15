import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
};

export default function MerchantProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", slug: "", price: "", image: "", description: "" });

  async function load() {
    const res = await fetch("/api/merchant/products");
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/merchant/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form, price: Math.round(Number(form.price) * 100) })
    });
    if (res.ok) {
      setForm({ name: "", slug: "", price: "", image: "", description: "" });
      load();
    } else {
      const body = await res.json();
      alert(body.error || "Failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete product?")) return;
    const res = await fetch(`/api/merchant/products/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else alert("Delete failed");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ovmixIndigo mb-4">Merchant — Products</h1>

      <form onSubmit={create} className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Name" className="p-2 border rounded" />
        <input value={form.slug} onChange={e => setForm({...form, slug:e.target.value})} placeholder="Slug" className="p-2 border rounded" />
        <input value={form.price} onChange={e => setForm({...form, price:e.target.value})} placeholder="Price (dollars)" className="p-2 border rounded" />
        <input value={form.image} onChange={e => setForm({...form, image:e.target.value})} placeholder="Image URL" className="p-2 border rounded" />
        <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Description" className="p-2 border rounded sm:col-span-2" />
        <div className="sm:col-span-2">
          <button className="bg-ovmixIndigo text-white px-4 py-2 rounded">Create product</button>
        </div>
      </form>

      <div className="grid gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">${(p.price/100).toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              <a href={`/product/${p.slug}`} className="text-sm text-ovmixIndigo">View</a>
              <button className="text-red-600" onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
