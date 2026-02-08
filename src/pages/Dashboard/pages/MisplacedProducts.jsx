import { useState } from "react";
import styles from "../DashboardCSS/MainContent.module.css";
import { checkMisplaced } from "../../../api/api"; // ✅ import from api.js

const MisplacedProducts = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:3000";

  const handleFileChange = (e) => setSelectedImage(e.target.files[0]);

  const handleSubmit = async () => {
    if (!selectedImage) return alert("Please select an image");

    const formData = new FormData();
    formData.append("productImage", selectedImage);

    try {
      setLoading(true);
      const data = await checkMisplaced(formData); // ✅ use api.js function
      setResultImage(data.image);
      setResultData(data.results);
    } catch (err) {
      console.error(err);
      alert("Failed to process image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <h2>AI – Misplaced Products</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Check"}
      </button>

      {resultImage && (
        <div className={styles.card}>
          <h3>Annotated Result:</h3>
          <img
  src={`${BACKEND_URL}${resultImage}`}
  alt="AI Result"
  style={{ maxWidth: "100%" }}
/>

        </div>
      )}

      {resultData && (
        <div className={styles.card}>
          <h3>Detection Data:</h3>
          <pre>{JSON.stringify(resultData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MisplacedProducts;
