import React, { useEffect, useState } from "react";
import {
  Container,
  Nav,
  Dropdown,
  NavDropdown,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  Settings,
  Menu,
  X,
  Sofa,
  CookingPot,
  Hamburger,
  Building2,
  PackageCheck,
  FlagTriangleRight,
  CarTaxiFront,
  IndianRupee,
  Cog,
  MessageSquareDot,
  LogOut,
} from "lucide-react";
import logo from "../assets/images/logo.png";

const inventory = [
  { label: "Kitchen Material", href: "/kitchen-material" },
  { label: "Outsource Material", href: "/outsource-material" },
];

const company = [
  { label: "Company", href: "/company" },
  { label: "Waitter", href: "/waitter" },
  { label: "Captains", href: "/captains" },
];

const food = [
  { label: "Food Category", href: "/food-category" },
  { label: "Menu Item", href: "/menu-item" },
];

const report = [
  { label: "Kitchen Matrials Report", href: "/kitchen-matrials-report" },
  { label: "Outsource Matrials Report", href: "/outsource-matrials-report" },
];

function Header() {
  const { pathname } = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const closeMenu = () => setShowMenu(false);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isInventoryActive = inventory.some(({ href }) => isActive(href));
  const isCompanyActive = company.some(({ href }) => isActive(href));
  const isFoodActive = food.some(({ href }) => isActive(href));
  const isReportActive = report.some(({ href }) => isActive(href));

  const renderDropdown = (items, title, icon, active, id, mobile) => (
    <NavDropdown
      title={
        <span className="restonest-more-title">
          {icon}
          <span>{title}</span>
          <ChevronDown size={13} />
        </span>
      }
      id={id}
      className={`restonest-more-dropdown ${active ? "active" : ""}`}
    >
      {items.map(({ label, href }) => (
        <NavDropdown.Item
          as={Link}
          to={href}
          key={href}
          active={isActive(href)}
          onClick={mobile ? closeMenu : undefined}
        >
          {label}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );

  const renderNavigation = (mobile = false) => (
    <>
      <Nav.Link
        as={Link}
        to="/"
        onClick={mobile ? closeMenu : undefined}
        className={`restonest-nav-link ${isActive("/") ? "active" : ""}`}
      >
        <LayoutDashboard size={15} strokeWidth={1.7} />
        <span>Dashboard</span>
      </Nav.Link>

      <Nav.Link
        as={Link}
        to="/pos"
        onClick={mobile ? closeMenu : undefined}
        className={`restonest-nav-link ${isActive("/pos") ? "active" : ""} ${isActive("/under-pos") ? "active" : ""} ${isActive("/generate-qr") ? "active" : ""} ${isActive("/table") ? "active" : ""}`}
      >
        <Sofa size={15} strokeWidth={1.7} />
        <span>POS</span>
      </Nav.Link>

      <Nav.Link
        as={Link}
        to="/orders"
        onClick={mobile ? closeMenu : undefined}
        className={`restonest-nav-link ${isActive("/orders") ? "active" : ""}`}
      >
        <CookingPot size={15} strokeWidth={1.7} />
        <span>Orders</span>
      </Nav.Link>

      {renderDropdown(
        food,
        "Food",
        <Hamburger size={15} strokeWidth={1.7} />,
        isFoodActive,
        mobile ? "mobile-food-dropdown" : "desktop-food-dropdown",
        mobile,
      )}

      {renderDropdown(
        company,
        "Company",
        <Building2 size={15} strokeWidth={1.7} />,
        isCompanyActive,
        mobile ? "mobile-company-dropdown" : "desktop-company-dropdown",
        mobile,
      )}

      {renderDropdown(
        inventory,
        "Inventory",
        <PackageCheck size={15} strokeWidth={1.7} />,
        isInventoryActive,
        mobile ? "mobile-inventory-dropdown" : "desktop-inventory-dropdown",
        mobile,
      )}

      {renderDropdown(
        report,
        "Report",
        <FlagTriangleRight size={15} strokeWidth={1.7} />,
        isReportActive,
        mobile ? "mobile-report-dropdown" : "desktop-report-dropdown",
        mobile,
      )}

      {/* <Nav.Link
        as={Link}
        to="/parking-management"
        onClick={mobile ? closeMenu : undefined}
        className={`restonest-nav-link ${
          isActive("/parking-management") ? "active" : ""
        }`}
      >
        <CarTaxiFront size={15} strokeWidth={1.7} />
        <span>Parking Management</span>
      </Nav.Link> */}

      <Nav.Link
        as={Link}
        to="/profit-loss"
        onClick={mobile ? closeMenu : undefined}
        className={`restonest-nav-link ${
          isActive("/profit-loss") ? "active" : ""
        }`}
      >
        <IndianRupee size={15} strokeWidth={1.7} />
        <span>Profit &amp; Loss</span>
      </Nav.Link>
    </>
  );

  return (
    <div className="sticky-top">
      <header className="restonest-header">
        <Container fluid className="restonest-header-container">
          <div className="restonest-topbar">
            <Button
              type="button"
              className="restonest-mobile-menu"
              aria-label="Open navigation menu"
              onClick={() => setShowMenu(true)}
            >
              <Menu size={21} />
            </Button>

            <Link to="/" className="restonest-brand">
              <img src={logo} alt="Restonest logo" />
            </Link>

            <Nav className="restonest-main-nav">{renderNavigation()}</Nav>

            <div className="restonest-header-right">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="restonest-profile-toggle"
                >
                  <span className="restonest-avatar">R</span>

                  <span className="restonest-profile-info">
                    <strong>Restonest Admin</strong>
                    <small>Restaurant Manager</small>
                  </span>

                  <ChevronDown size={15} />
                </Dropdown.Toggle>

                <Dropdown.Menu className="restonest-profile-menu">
                  <Dropdown.Item as={Link} to="/settings">
                    <Cog size={15} /> Settings
                  </Dropdown.Item>

                  <Dropdown.Item as={Link} to="/login" className="log-out">
                    <LogOut size={15} /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>

        <Offcanvas
          show={showMenu}
          onHide={closeMenu}
          placement="start"
          className="restonest-offcanvas"
          backdrop
          scroll={false}
          aria-labelledby="restonest-mobile-title"
        >
          <Offcanvas.Header className="restonest-offcanvas-header">
            <Offcanvas.Title id="restonest-mobile-title">
              <Link to="/" className="restonest-brand" onClick={closeMenu}>
                <img src={logo} alt="Restonest logo" />
              </Link>
            </Offcanvas.Title>

            <Button
              type="button"
              variant="light"
              className="restonest-offcanvas-close"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </Button>
          </Offcanvas.Header>

          <Offcanvas.Body className="restonest-offcanvas-body">
            <div className="restonest-mobile-user">
              <span className="restonest-avatar">R</span>

              <span className="restonest-profile-info">
                <strong>Restonest Admin</strong>
                <small>Restaurant Manager</small>
              </span>
            </div>

            <div className="restonest-mobile-nav-heading">MAIN MENU</div>

            <Nav className="restonest-mobile-nav">{renderNavigation(true)}</Nav>

            <div className="restonest-mobile-footer">
              <Link
                to="/profile"
                className="restonest-mobile-footer-link"
                onClick={closeMenu}
              >
                <Users size={16} />
                My Profile
              </Link>

              <Link
                to="/settings"
                className="restonest-mobile-footer-link"
                onClick={closeMenu}
              >
                <Settings size={16} />
                Settings
              </Link>

              <Link
                to="/login"
                className="restonest-mobile-footer-link"
                onClick={closeMenu}
              >
                <X size={16} />
                Logout
              </Link>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </header>
    </div>
  );
}

export default Header;
