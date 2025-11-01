import ProductTable from "./ProductTable";
import "./ProductPage.css";

function ProductPage() {
  return (
    <div className="products-page">
      <h1>Bandeja de Productos</h1>
      <div className="products-table-wrapper">
        <ProductTable />
      </div>
    </div>
  );
}

export default ProductPage;
