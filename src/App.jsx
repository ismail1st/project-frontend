import { useState } from "react";
import "./App.css";
import logo from "./assets/logo.png"; // import your logo

export default function App() {
  const [categories, setCategories] = useState([]);
  const [parts, setParts] = useState([]);
  const [sales, setSales] = useState([]);

  const [catName, setCatName] = useState("");
  const [partName, setPartName] = useState("");
  const [partCategory, setPartCategory] = useState("");
  const [salePart, setSalePart] = useState("");
  const [saleQty, setSaleQty] = useState(0);

  const addCategory = () => {
    if (!catName) return;
    setCategories([...categories, { id: Date.now(), name: catName }]);
    setCatName("");
  };

  const addPart = () => {
    if (!partName || !partCategory) return;
    setParts([
      ...parts,
      { id: Date.now(), name: partName, category: partCategory },
    ]);
    setPartName("");
    setPartCategory("");
  };

  const recordSale = () => {
    if (!salePart || saleQty <= 0) return;
    setSales([...sales, { id: Date.now(), partId: salePart, qty: saleQty }]);
    setSalePart("");
    setSaleQty(0);
  };

  return (
    <div className="app-container">
      <div className="content">
        <img src={logo} alt="Ismail Auto Parts Logo" className="logo" />

        <div className="card">
          <h2>Add Category</h2>
          <div className="input-row">
            <input
              placeholder="Category name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
            <button onClick={addCategory}>Add</button>
          </div>
        </div>

        <div className="card">
          <h2>Add Spare Part</h2>
          <div className="input-row">
            <input
              placeholder="Part name"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
            />
            <select
              value={partCategory}
              onChange={(e) => setPartCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button onClick={addPart}>Add Part</button>
          </div>
        </div>

        <div className="card">
          <h2>All Spare Parts</h2>
          {parts.length === 0 ? (
            <p>No parts added yet.</p>
          ) : (
            <ul>
              {parts.map((p) => (
                <li key={p.id}>
                  {p.name} — <span>{p.category}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>Record Sale</h2>
          <div className="input-row">
            <select
              value={salePart}
              onChange={(e) => setSalePart(e.target.value)}
            >
              <option value="">Select part</option>
              {parts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Qty"
              value={saleQty}
              onChange={(e) => setSaleQty(Number(e.target.value))}
            />
            <button onClick={recordSale}>Save Sale</button>
          </div>
        </div>

        <div className="card">
          <h2>Sales Records</h2>
          {sales.length === 0 ? (
            <p>No sales yet.</p>
          ) : (
            <ul>
              {sales.map((s) => {
                const soldPart = parts.find((p) => p.id === s.partId);
                return (
                  <li key={s.id}>
                    {soldPart ? soldPart.name : "Unknown Part"} — Qty: {s.qty}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <footer>
        <p>Contact: info@ismailautoparts.com </p>
        <p>+254 700 000 000</p>
      </footer>
    </div>
  );
}
