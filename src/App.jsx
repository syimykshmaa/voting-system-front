import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ElectionsPage from "./pages/ElectionsPage";
import VotePage from "./pages/VotePage";
import ResultsPage from "./pages/ResultsPage";
import ManageElectionsPage from "./pages/ManageElectionsPage";
import UsersPage from "./pages/UsersPage";
import AuditPage from "./pages/AuditPage";
import Navbar from "./components/Navbar";

function AppInner() {
  const { currentUser, loading } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [pageParam, setPageParam] = useState(null);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ color: "#7c3aed", fontSize: 18, fontWeight: 700 }}>Loading…</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  const navigate = (page, param = null) => {
    setActivePage(page);
    setPageParam(param);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard onNavigate={navigate} />;
      case "elections": return <ElectionsPage onNavigate={navigate} />;
      case "vote": return <VotePage selectedElectionId={pageParam} onNavigate={navigate} />;
      case "results": return <ResultsPage selectedElectionId={pageParam} />;
      case "manage-elections": return <ManageElectionsPage />;
      case "users": return <UsersPage />;
      case "audit": return <AuditPage />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div style={styles.app}>
      <Navbar activePage={activePage} onNavigate={navigate} />
      <main style={styles.main}>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppInner />
      </DataProvider>
    </AuthProvider>
  );
}

const styles = {
  app: {
    display: "flex", minHeight: "100vh",
    background: "#0f0f18", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },
  main: {
    flex: 1, overflowY: "auto", minHeight: "100vh",
  },
};
