import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.png";

// Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://127.0.0.1:8000";

export default function App() {
  const [categories, setCategories] = useState([]);
  const [parts, setParts] = useState([]);
  const [sales, setSales] = useState([]);

  const [catName, setCatName] = useState("");
  const [partName, setPartName] = useState("");
  const [partCategory, setPartCategory] = useState("");
  const [salePart, setSalePart] = useState("");
  const [saleQty, setSaleQty] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [catRes, partRes, saleRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/parts`),
          fetch(`${API_URL}/sales`),
        ]);

        if (!catRes.ok || !partRes.ok || !saleRes.ok) {
          throw new Error("Failed to fetch data from API");
        }

        const catData = await catRes.json();
        const partData = await partRes.json();
        const saleData = await saleRes.json();

        setCategories(Array.isArray(catData) ? catData : []);
        setParts(Array.isArray(partData) ? partData : []);
        setSales(Array.isArray(saleData) ? saleData : []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Check backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // add category
  const addCategory = async () => {
    if (!catName) return toast.warn("Enter a category name");

    try {
      await fetch(`${API_URL}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName }),
      });

      setCatName("");
      fetchCategories();
      toast.success("Category added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save category.");
    }
  };

  // ---------------- Add Part ----------------
  const addPart = async () => {
    if (!partName || !partCategory)
      return toast.warn("Enter part name and category");

    try {
      await fetch(`${API_URL}/part`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: partName, category: partCategory }),
      });

      setPartName("");
      setPartCategory("");
      fetchParts();
      toast.success("Part added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save part.");
    }
  };

  // sales
  const recordSale = async () => {
    if (!salePart || saleQty <= 0)
      return toast.warn("Select part and enter quantity");

    try {
      await fetch(`${API_URL}/sale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ part_id: Number(salePart), qty: saleQty }),
      });

      setSalePart("");
      setSaleQty(0);
      fetchSales();
      toast.success("Sale recorded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save sale.");
    }
  };

  // fetch
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchParts = async () => {
    try {
      const res = await fetch(`${API_URL}/parts`);
      const data = await res.json();
      setParts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await fetch(`${API_URL}/sales`);
      const data = await res.json();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- UI ----------------
  if (loading) return <div className="app-container">Loading...</div>;
  if (error)
    return (
      <div className="app-container">
        <h2 style={{ color: "red" }}>{error}</h2>
      </div>
    );

  return (
    <div className="app-container">
      <div className="content">
        <img
          src={logo || "https://via.placeholder.com/150"}
          alt="Ismail Auto Parts Logo"
          className="logo"
        />

        {/* CATEGORY */}
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

        {/* PART */}
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

        {/* PART LIST */}
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

        {/* SALE */}
        <div className="card">
          <h2>Record Sale</h2>
          <div className="input-row">
            <select
              value={salePart}
              onChange={(e) => setSalePart(Number(e.target.value))}
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

        {/* SALES LIST */}
        <div className="card">
          <h2>Sales Records</h2>
          {sales.length === 0 ? (
            <p>No sales yet.</p>
          ) : (
            <ul>
              {sales.map((s) => {
                const soldPart = parts.find((p) => p.id === s.part_id);
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
        <p>Contact: info@ismailautoparts.com</p>
        <p>+254 700 000 000</p>
      </footer>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </div>
  );
}
