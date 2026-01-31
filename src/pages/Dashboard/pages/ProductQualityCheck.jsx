import { useState } from "react";

function ProductQualityCheck() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResult("");
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("productImage", image);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/products/quality-check", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setResult(data.message);
    } catch (err) {
      setResult("Error checking product");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Quality Check (AI)</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br /><br />

      <button onClick={handleSubmit}>
        {loading ? "Checking..." : "Check Product"}
      </button>

      {result && <h3>{result}</h3>}
    </div>
  );
}

export default ProductQualityCheck;