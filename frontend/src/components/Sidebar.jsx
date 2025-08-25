import { useState, useEffect, useContext } from "react"
import "./Sidebar.css"
import { LayoutDashboard, User, Users, FileText, LogOut,House, ChevronLeft, ChevronRight, Activity } from "lucide-react"
import { NavLink, useNavigate } from "react-router"
import logo from '../assets/Lab-logo.png'
import {LoginContext} from "../context/LoginContext";

const Sidebar = () => {
  const navigate= useNavigate()
    const SecretaryMenuItems = [
    { id: "accueil", label: "Accueil", icon: House, path: "/" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "profile", label: "Profil", icon: User, path: "/profile" },
    { id: "patients", label: "Patients", icon: Users, path: "/patients" },
    { id: "demandes d'analyses", label: "Demandes d'analyses", icon: FileText, path: "/demandes-d'analyse" },
  ]
  const PatientMenuItems = [
    { id: "accueil", label: "Accueil", icon: House, path: "/" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "profile", label: "Profil", icon: User, path: "/profile" },
    { id: "rapports d'analyse", label: "Analyses", icon: FileText, path: "/rapports-d'analyse" },
  ]
  const TechMenuItems = [
    { id: "accueil", label: "Accueil", icon: House, path: "/" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "profile", label: "Profil", icon: User, path: "/profile" },
    { id: "patients", label: "Patients", icon: Users, path: "/patients" },
    { id: "demandes d'analyses", label: "Demandes d'analyses", icon: FileText, path: "/demandes-d'analyse" },
    { id: "rapports d'analyse", label: "Analyses", icon: FileText, path: "/rapports-d'analyse" },
  ]
    const AdminMenuItems = [
    { id: "accueil", label: "Accueil", icon: House, path: "/" },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "profile", label: "Profil", icon: User, path: "/profile" },
    { id: "utilisateurs", label: "Utilisateurs", icon: Users, path: "/utilisateurs" },
  ]
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("dashboard")
  const [menuItems, setMenuItems] = useState(SecretaryMenuItems)
  const {role,token,logoutHandler}= useContext(LoginContext);
  // const role= localStorage.getItem("role");

  useEffect(() => {
    switch (role) {
      case "Admin":
        setMenuItems(AdminMenuItems)
        break
      case "Technicien de laboratoire":
        setMenuItems(TechMenuItems)
        break
      case "Patient":
        setMenuItems(PatientMenuItems)
        break
      default:
        setMenuItems(SecretaryMenuItems)
    }
  }, [role])

  const handleItemClick = (itemId) => {
    setActiveItem(itemId)
    // Ici vous pourriez aussi utiliser useNavigate pour changer de route
    // navigate(item.path);
  }

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {!isCollapsed && (
            <div className="logo-text">
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
          )}
        </div>

        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <NavLink to={item.path} key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeItem === item.id ? "active" : ""}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="nav-icon">
                    <IconComponent size={20} />
                  </div>
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                </button>
              </NavLink>
            )
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn"onClick={()=>{
            logoutHandler();
               navigate("/");
            }}>
          <div className="nav-icon" 
          >
            <LogOut size={20} />
          </div>
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar 