import { useState } from "react";
import { useOutletContext } from "react-router-dom";


function ProductQualityCheck() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [outputImageUrl, setOutputImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { addNotification } = useOutletContext(); 
  const { setNotifications } = useOutletContext();


  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResult("");
    setOutputImageUrl("");
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
      const res = await fetch(
        "http://localhost:3000/api/products/quality-check",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      setResult(data.message);
      setOutputImageUrl(
        `http://localhost:3000/${data.outputImage}`
      );

       console.log(data.status);
      if (data.status === "NOT_OK") {
 setNotifications((prev) => [
  {
    id: Date.now(),
    message: "❌ Defective product detected",
  },
  ...prev,
]);

}

    } catch (err) {
      console.error(err);
      setResult("❌ Error checking product");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Product Quality Check (AI)</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br /><br />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Checking..." : "Check Product"}
      </button>

      {result && (
        <h3
          style={{
            marginTop: "20px",
            color: result.includes("❌") ? "red" : "green",
          }}
        >
          {result}
        </h3>
      )}

      {outputImageUrl && (
        <div style={{ marginTop: "20px" }}>
          <h4>AI Output</h4>
          <img
            src={outputImageUrl}
            alt="AI Result"
            style={{
              width: "100%",
              border: "2px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ProductQualityCheck;
