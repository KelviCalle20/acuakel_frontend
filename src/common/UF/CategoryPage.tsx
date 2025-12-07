import CategoryTable from "./CategoryTable";
import "./CategoryPage.css";

function CategoryPage() {
  return (
    <div className="categories-page">
      <h1>Bandeja de Productos</h1>
      <div className="categories-table-wrapper">
        <CategoryTable />
      </div>
    </div>
  );
}

export default CategoryPage;