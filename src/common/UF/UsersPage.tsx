import UserTable from "./UserTable";
import "./UsersPage.css";

function UsersPage() {
  return (
    <div className="users-page">
      <h1>Bandeja de usuarios</h1>
      <div className="user-table-wrapper">
        <UserTable />
      </div>
    </div>
  );
}

export default UsersPage;

