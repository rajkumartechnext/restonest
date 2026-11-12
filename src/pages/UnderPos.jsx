import React, { useRef, useState } from "react";
import Header from "../components/Header";
import { Col, Container, Row, Form, Modal, InputGroup } from "react-bootstrap";
import { Offcanvas } from "react-bootstrap";
import {
  Banknote,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Drumstick,
  Landmark,
  Minus,
  Plus,
  ScanLine,
  Search,
  SquareDashedPlus,
  Vegan,
  X,
} from "lucide-react";
import categoryImage from "../assets/images/cate-1.jpg";
import categoryImage2 from "../assets/images/cate-2.jpg";
import categoryImage3 from "../assets/images/cate-3.jpg";
import categoryImage4 from "../assets/images/cate-4.jpg";
import Veg from "../assets/images/veg.png";
import NonVeg from "../assets/images/non-veg.png";
const foodItems = [
  {
    id: 1,
    name: "Chicken Reshmi Kebab",
    price: 999,
    category: "Main Courses",
    foodType: "nonveg",
    image: categoryImage,
  },
  {
    id: 2,
    name: "Paneer Tikka",
    price: 249,
    category: "Appetizers",
    foodType: "veg",
    image: categoryImage2,
  },
  {
    id: 3,
    name: "Chicken Biryani",
    price: 299,
    category: "Main Courses",
    foodType: "nonveg",
    image: categoryImage3,
  },
  {
    id: 4,
    name: "Veg Hakka Noodles",
    price: 189,
    category: "Chinese Snacks",
    foodType: "veg",
    image: categoryImage4,
  },
  {
    id: 5,
    name: "Butter Chicken",
    price: 349,
    category: "Main Courses",
    foodType: "nonveg",
    image: categoryImage2,
  },
  {
    id: 6,
    name: "Masala Dosa",
    price: 149,
    category: "Fast Food",
    foodType: "veg",
    image: categoryImage3,
  },
  {
    id: 7,
    name: "Tandoori Chicken",
    price: 399,
    category: "Appetizers",
    foodType: "nonveg",
    image: categoryImage,
  },
  {
    id: 8,
    name: "Mutton Biryani",
    price: 379,
    category: "Main Courses",
    foodType: "nonveg",
    image: categoryImage4,
  },
  {
    id: 9,
    name: "Chilli Paneer",
    price: 229,
    category: "Chinese Snacks",
    foodType: "veg",
    image: categoryImage2,
  },
  {
    id: 10,
    name: "Chicken Momos",
    price: 169,
    category: "Chinese Snacks",
    foodType: "nonveg",
    image: categoryImage3,
  },
  {
    id: 11,
    name: "Fish Finger",
    price: 279,
    category: "Appetizers",
    foodType: "nonveg",
    image: categoryImage4,
  },
  {
    id: 12,
    name: "Margherita Pizza",
    price: 299,
    category: "Fast Food",
    foodType: "veg",
    image: categoryImage,
  },
  {
    id: 13,
    name: "Chicken Burger",
    price: 199,
    category: "Fast Food",
    foodType: "nonveg",
    image: categoryImage2,
  },
  {
    id: 14,
    name: "French Fries",
    price: 129,
    category: "Fast Food",
    foodType: "veg",
    image: categoryImage3,
  },
  {
    id: 15,
    name: "Chocolate Brownie",
    price: 149,
    category: "Desserts",
    foodType: "veg",
    image: categoryImage4,
  },
  {
    id: 16,
    name: "Cold Coffee",
    price: 119,
    category: "Drinks",
    foodType: "veg",
    image: categoryImage,
  },
];
const addOnGroups = [
  {
    id: "size",
    title: "Change Size",
    single: true,
    options: [
      { id: "large", label: "Large", detail: "(Serves 4)", price: 250 },
      { id: "medium", label: "Medium", detail: "(Serves 4)", price: 180 },
      { id: "regular", label: "Regular", detail: "(Serves 4)", price: 120 },
    ],
  },
  {
    id: "crust",
    title: "Change Crust",
    single: true,
    options: [
      { id: "cheese-burst", label: "Cheese Burst", price: 80 },
      { id: "fresh-pan", label: "Fresh Pan Pizza", price: 60 },
      { id: "wheat-thin", label: "100% Wheat Thin Crust", price: 50 },
      { id: "classic-hand", label: "Classic Hand Tossed", price: 40 },
    ],
  },
  {
    id: "toppings",
    title: "Extra Toppings",
    single: false,
    options: [
      { id: "extra-cheese", label: "Extra Cheese", price: 50 },
      { id: "jalapeno", label: "Jalapeno", price: 30 },
      { id: "black-olives", label: "Black Olives", price: 35 },
      { id: "mushroom", label: "Mushroom", price: 40 },
    ],
  },
  {
    id: "sauces",
    title: "Extra Sauces",
    single: false,
    options: [
      { id: "mayonnaise", label: "Mayonnaise", price: 20 },
      { id: "peri-peri", label: "Peri Peri Sauce", price: 25 },
      { id: "cheese-dip", label: "Cheese Dip", price: 35 },
    ],
  },
];
function CustomLeftArrow({ onClick }) {
  return (
    <button
      type="button"
      className="pos-carousel-arrow pos-carousel-prev"
      onClick={onClick}
      aria-label="Scroll categories left"
    >
      <ChevronLeft size={20} />
    </button>
  );
}
function CustomRightArrow({ onClick }) {
  return (
    <button
      type="button"
      className="pos-carousel-arrow pos-carousel-next"
      onClick={onClick}
      aria-label="Scroll categories right"
    >
      <ChevronRight size={20} />
    </button>
  );
}
function UnderPos() {
  const categoryListRef = useRef(null);
  const [showCategory, setShowCategory] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [foodType, setFoodType] = useState("nonveg");
  const [show, setShow] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [billType, setBillType] = useState("1");
  const [mobileNumber, setMobileNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [splitPayment, setSplitPayment] = useState(false);
  const [splitPaymentMethod, setSplitPaymentMethod] = useState("Cash");
  const [splitAmount, setSplitAmount] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("1");
  const categories = [
    { name: "All", image: categoryImage },
    { name: "Fast Food", image: categoryImage },
    { name: "Drinks", image: categoryImage2 },
    { name: "Desserts", image: categoryImage3 },
    { name: "Appetizers", image: categoryImage4 },
    { name: "Main Courses", image: categoryImage },
    { name: "Chinese Snacks", image: categoryImage2 },
    { name: "Main Courses", image: categoryImage },
    { name: "Chinese Snacks", image: categoryImage2 },
    { name: "Fast Food", image: categoryImage },
    { name: "Drinks", image: categoryImage2 },
    { name: "Desserts", image: categoryImage3 },
  ];
  const handleFoodTypeChange = (e) => {
    setFoodType(e.target.checked ? "veg" : "nonveg");
    setActiveCategory("All");
    if (categoryListRef.current) {
      categoryListRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (cartItems.length === 0) {
      alert("Please add food items before checkout.");
      return;
    }
    setShow(true);
  };
  const scrollCategories = (direction) => {
    const categoryList = categoryListRef.current;
    if (!categoryList) return;
    categoryList.scrollBy({
      left: direction * categoryList.clientWidth * 0.8,
      behavior: "smooth",
    });
  };
  const typeFoodItems = foodItems.filter((food) => food.foodType === foodType);
  const filteredCategories = categories.filter(
    (category, index, list) =>
      list.findIndex((item) => item.name === category.name) === index &&
      (category.name === "All" ||
        typeFoodItems.some((food) => food.category === category.name)),
  );
  const getCategoryCount = (categoryName) =>
    categoryName === "All"
      ? typeFoodItems.length
      : typeFoodItems.filter((food) => food.category === categoryName).length;
  const handleCategorySelect = (categoryName) => {
    setActiveCategory(categoryName);
    setShowCategory(false);
  };
  const filteredFoodItems = typeFoodItems.filter((food) => {
    const matchesCategory =
      activeCategory === "All" || food.category === activeCategory;
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const updateQuantity = (foodId, change) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(1, (prev[foodId] || 1) + change),
    }));
  };
  const openAddOnModal = (food) => {
    setSelectedFood(food);
    setSelectedAddOns({});
    setModalShow(true);
  };
  const closeAddOnModal = () => {
    setModalShow(false);
    setSelectedFood(null);
    setSelectedAddOns({});
  };
  const handleAddOnChange = (group, option) => {
    setSelectedAddOns((prev) => {
      const currentGroup = prev[group.id] || [];
      if (group.single) {
        const alreadySelected = currentGroup.some(
          (item) => item.id === option.id,
        );
        return {
          ...prev,
          [group.id]: alreadySelected ? [] : [option],
        };
      }
      const alreadySelected = currentGroup.some(
        (item) => item.id === option.id,
      );
      return {
        ...prev,
        [group.id]: alreadySelected
          ? currentGroup.filter((item) => item.id !== option.id)
          : [...currentGroup, option],
      };
    });
  };
  const selectedAddOnList = Object.values(selectedAddOns).flat();
  const addOnTotal = selectedAddOnList.reduce(
    (total, option) => total + option.price,
    0,
  );
  const selectedFoodTotal = selectedFood ? selectedFood.price + addOnTotal : 0;
  const addFoodToCart = () => {
    if (!selectedFood) return;
    const selectedQuantity = quantities[selectedFood.id] || 1;
    const selectedOptions = selectedAddOnList.map((option) => ({
      ...option,
    }));
    const cartKey = [
      selectedFood.id,
      ...selectedOptions.map((option) => option.id).sort(),
    ].join("-");
    const newCartItem = {
      ...selectedFood,
      cartKey,
      basePrice: selectedFood.price,
      price: selectedFood.price + addOnTotal,
      qty: selectedQuantity,
      addons: selectedOptions,
    };
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.cartKey === cartKey);
      if (existingItem) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, qty: item.qty + selectedQuantity }
            : item,
        );
      }
      return [...prev, newCartItem];
    });
    setQuantities((prev) => ({
      ...prev,
      [selectedFood.id]: 1,
    }));
    closeAddOnModal();
  };
  const removeFoodFromCart = (cartKey) => {
    setCartItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );
  const tax = Math.round(subtotal * 0.05);
  const donation = cartItems.length > 0 ? 1 : 0;
  const discountAmount = Math.min(
    subtotal + tax + donation,
    Math.max(
      0,
      discountType === "2"
        ? (subtotal * (Number(discount) || 0)) / 100
        : Number(discount) || 0,
    ),
  );
  const totalPayable = Math.max(0, subtotal + tax + donation - discountAmount);
  const handleCancel = () => {
    setCartItems([]);
    setDiscount("");
    setDiscountType("1");
    setQuantities({});
  };
  const resetBillingForm = () => {
    setBillType("1");
    setMobileNumber("");
    setCustomerName("");
    setPaymentStatus("Paid");
    setPaymentMethod("Card");
    setSplitPayment(false);
    setSplitPaymentMethod("Cash");
    setSplitAmount("");
  };
  const handleBillingSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Please add food items before checkout.");
      handleClose();
      return;
    }
    if (!mobileNumber.trim()) {
      alert("Please enter mobile number.");
      return;
    }
    if (!customerName.trim()) {
      alert("Please enter customer name.");
      return;
    }
    if (splitPayment) {
      const secondAmount = Number(splitAmount);
      if (!splitAmount || secondAmount <= 0 || secondAmount >= totalPayable) {
        alert("Please enter a valid split payment amount.");
        return;
      }
    }
    const billingDetails = [
      "Billing completed successfully!",
      `Customer: ${customerName}`,
      `Mobile: ${mobileNumber}`,
      `Total Payable: ₹${totalPayable.toFixed(2)}`,
      `Payment Method: ${paymentMethod}`,
    ];
    if (splitPayment) {
      billingDetails.push(
        `First Payment: ₹${(totalPayable - Number(splitAmount)).toFixed(
          2,
        )} (${paymentMethod})`,
        `Second Payment: ₹${Number(splitAmount).toFixed(2)} (${splitPaymentMethod})`,
      );
    }
    alert(billingDetails.join("\n"));
    handleCancel();
    handleClose();
    resetBillingForm();
  };
  return (
    <>
      <Header />
      <main className="restonest-dashboard pos-page">
        <Container fluid>
          <div className="dashboard-stat-card">
            <Row>
              <Col xl={9} md={9}>
                <Row className="mb-2">
                  <Col xl={3} md={5} className="switch-menu p-1">
                    <div className="type-tab">
                      <span className="nonveg">
                        <img src={NonVeg} alt="" /> Non-Veg
                      </span>
                      <Form.Check
                        type="switch"
                        id="food-type-switch"
                        checked={foodType === "veg"}
                        onChange={handleFoodTypeChange}
                        className="mb-0"
                      />
                      <span className="veg">
                        Veg <img src={Veg} alt="" />
                      </span>
                    </div>
                  </Col>
                  <Col xl={6} md={7} className="p-1 my-search">
                    <div className="search-wrapper">
                      <Form.Group>
                        <Form.Control
                          placeholder="Search your dish...."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search size={18} />
                      </Form.Group>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xl={2} md={3} className="p-0">
                    <div className="pos-food-wrapper">
                      <div className="pos-food-inner p-1">
                        {filteredCategories.map((category) => (
                          <div
                            className={`pos-category-item ${
                              activeCategory === category.name ? "active" : ""
                            }`}
                            key={category.name}
                            role="button"
                            tabIndex={0}
                            aria-pressed={activeCategory === category.name}
                            onClick={() => handleCategorySelect(category.name)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCategorySelect(category.name);
                              }
                            }}
                          >
                            <div className="pos-item-image">
                              <img
                                src={category.image}
                                alt={category.name}
                                draggable="false"
                              />
                            </div>
                            <div className="pos-name">{category.name}</div>
                            <div className="pos-qty">
                              {getCategoryCount(category.name)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="overlay-category">
                        <button
                          type="button"
                          className="resto-secondary w-100"
                          onClick={() => setShowCategory(true)}
                        >
                          Open Category
                        </button>
                      </div>
                      <Offcanvas
                        show={showCategory}
                        onHide={() => setShowCategory(false)}
                        placement="bottom"
                        className="mobile-category-offcanvas"
                      >
                        <Offcanvas.Header closeButton>
                          <Offcanvas.Title>Food Categories</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                          <div className="mobile-category-list">
                            {filteredCategories.map((category) => (
                              <div
                                className={`pos-category-item ${
                                  activeCategory === category.name
                                    ? "active"
                                    : ""
                                }`}
                                key={category.name}
                                role="button"
                                tabIndex={0}
                                aria-pressed={activeCategory === category.name}
                                onClick={() =>
                                  handleCategorySelect(category.name)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleCategorySelect(category.name);
                                  }
                                }}
                              >
                                <div className="pos-item-image">
                                  <img
                                    src={category.image}
                                    alt={category.name}
                                    draggable="false"
                                  />
                                </div>
                                <div className="pos-name">{category.name}</div>
                                <div className="pos-qty">
                                  {getCategoryCount(category.name)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Offcanvas.Body>
                      </Offcanvas>
                    </div>
                  </Col>
                  <Col xl={10} md={9} className="select-food">
                    <div className={`pos-food-wrapper ${foodType}`}>
                      <div className="pos-food-inner">
                        <Row>
                          {filteredFoodItems.length > 0 ? (
                            filteredFoodItems.map((food) => {
                              const isAdded = cartItems.some(
                                (item) => item.id === food.id,
                              );
                              return (
                                <Col
                                  md={4}
                                  xl={3}
                                  xs={6}
                                  className="mb-3 p-1"
                                  key={food.id}
                                >
                                  <div className="pos-food-item">
                                    <div className="pos-food-image">
                                      <img
                                        src={food.image}
                                        alt={food.name}
                                        draggable="false"
                                        className="img-fluid"
                                      />
                                    </div>
                                    <div className="pos-food-details">
                                      <h6>{food.name}</h6>
                                      <div className="pos-price">
                                        <p>₹{food.price}</p>
                                        <div className="pos-count">
                                          <button
                                            type="button"
                                            className="pos-decrement"
                                            onClick={() =>
                                              updateQuantity(food.id, -1)
                                            }
                                            disabled={
                                              (quantities[food.id] || 1) <= 1
                                            }
                                            aria-label="Decrease quantity"
                                          >
                                            <Minus size={12} />
                                          </button>
                                          <div className="pos-count-value">
                                            {quantities[food.id] || 1}
                                          </div>
                                          <button
                                            type="button"
                                            className="pos-increment"
                                            onClick={() =>
                                              updateQuantity(food.id, 1)
                                            }
                                            aria-label="Increase quantity"
                                          >
                                            <Plus size={12} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pos-food-btn">
                                      <button
                                        type="button"
                                        className={`btn btn-food-add ${
                                          isAdded ? "added" : ""
                                        }`}
                                        onClick={() => openAddOnModal(food)}
                                        aria-label={`Customize ${food.name}`}
                                      >
                                        {isAdded ? (
                                          <Check size={16} />
                                        ) : (
                                          <Plus size={16} />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </Col>
                              );
                            })
                          ) : (
                            <Col xs={12}>
                              <p className="text-center py-4">
                                No food items found.
                              </p>
                            </Col>
                          )}
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xl={3} md={3} className="p-1">
                <div className="pos-order-wrapper">
                  <div className="pos-order-content">
                    <div className="pos-right-method mb-2 header">
                      <Form>
                        <div className="d-flex gap-2 mb-2">
                          <Form.Group>
                            <Form.Select aria-label="Order status">
                              <option value="1">On Dine</option>
                              <option value="2">Reserved</option>
                              <option value="3">Available</option>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group>
                            <Form.Select aria-label="Select table">
                              <option value="1">Table 1 (Available)</option>
                              <option value="2">Table 2 (Available)</option>
                              <option value="3">Table 3 (Available)</option>
                            </Form.Select>
                          </Form.Group>
                        </div>
                        <Form.Group>
                          <Form.Control
                            required
                            type="text"
                            defaultValue="Rajkumar Laha"
                          />
                        </Form.Group>
                      </Form>
                    </div>
                    <div className="pos-order-body">
                      <div className="pos-order-section">
                        <div className="pos-order-heading mb-3">
                          <h6>Ordered Items</h6>
                          <span>
                            {cartItems
                              .reduce((total, item) => total + item.qty, 0)
                              .toString()
                              .padStart(2, "0")}
                          </span>
                        </div>
                        <div className="pos-ordered-list">
                          {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                              <div
                                className="pos-ordered-item"
                                key={item.cartKey}
                              >
                                <span>{item.qty}x</span>
                                <div className="flex-grow-1">
                                  <p>{item.name}</p>
                                  {item.addons.length > 0 && (
                                    <small className="order-ones-item">
                                      {item.addons
                                        .map((addon) => addon.label)
                                        .join(", ")}
                                    </small>
                                  )}
                                </div>
                                <strong>
                                  ₹{(item.price * item.qty).toFixed(2)}
                                </strong>
                                <button
                                  type="button"
                                  className="pos-ordered-remove"
                                  onClick={() =>
                                    removeFoodFromCart(item.cartKey)
                                  }
                                  aria-label={`Remove ${item.name}`}
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-3 empty-cart-message">
                              <SquareDashedPlus size={20} />
                              <br />
                              No items added yet.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="pos-payment-summary">
                        <h6>Payment Summary</h6>
                        <div className="pos-summary-row">
                          <span>Subtotal</span>
                          <strong>₹{subtotal.toFixed(2)}</strong>
                        </div>
                        <div className="pos-summary-row">
                          <span>Tax (5%)</span>
                          <strong>₹{tax.toFixed(2)}</strong>
                        </div>
                        <div className="pos-summary-row">
                          <span>Donation for Palestine</span>
                          <strong>₹{donation.toFixed(2)}</strong>
                        </div>
                        {discountAmount > 0 && (
                          <div className="pos-summary-row">
                            <span>Discount</span>
                            <strong>-₹{discountAmount.toFixed(2)}</strong>
                          </div>
                        )}
                        <div className="pos-total-row">
                          <strong>Total Payable</strong>
                          <strong>₹{totalPayable.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pos-order-actions footer">
                    <div className="pos-right-method mt-2">
                      <h6>Discount</h6>
                      <Form>
                        <div className="d-flex gap-2">
                          <Form.Group>
                            <Form.Select
                              value={discountType}
                              onChange={(e) => setDiscountType(e.target.value)}
                            >
                              <option value="1">Flat</option>
                              <option value="2">Percentage</option>
                            </Form.Select>
                          </Form.Group>
                          <Form.Group>
                            <Form.Control
                              type="number"
                              min="0"
                              placeholder="Discount"
                              value={discount}
                              onChange={(e) => setDiscount(e.target.value)}
                            />
                          </Form.Group>
                        </div>
                      </Form>
                    </div>
                    <div className="d-flex gap-2 mb-2">
                      <button
                        type="button"
                        className="resto-primary w-100"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="resto-secondary w-100"
                        onClick={handleShow}
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        {/**&#x20;Billing Modal&#x20;**/}
        <Modal
          show={show}
          onHide={handleClose}
          dialogClassName="billing-modal-right"
        >
          <Form onSubmit={handleBillingSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Billing Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text>Bill Type</InputGroup.Text>
                <Form.Select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value)}
                >
                  <option value="1">One</option>
                  <option value="2">Two</option>
                  <option value="3">Three</option>
                </Form.Select>
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Mob No</InputGroup.Text>
                <Form.Control
                  type="tel"
                  placeholder="Enter mobile number"
                  aria-label="Mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Customer Name</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Enter customer name"
                  aria-label="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </InputGroup>
              <div className="mt-3 mb-3">
                <h5>Payment Method</h5>
                <div className="pos-payment-method">
                  <button
                    type="button"
                    className={paymentMethod === "Cash" ? "active" : ""}
                    onClick={() => setPaymentMethod("Cash")}
                  >
                    <Banknote size={16} />
                    <span>Cash</span>
                  </button>
                  <button
                    type="button"
                    className={paymentMethod === "Card" ? "active" : ""}
                    onClick={() => setPaymentMethod("Card")}
                  >
                    <CreditCard size={16} />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    className={paymentMethod === "Online" ? "active" : ""}
                    onClick={() => setPaymentMethod("Online")}
                  >
                    <ScanLine size={16} />
                    <span>Online</span>
                  </button>
                  <button
                    type="button"
                    className={paymentMethod === "NetBanking" ? "active" : ""}
                    onClick={() => setPaymentMethod("NetBanking")}
                  >
                    <Landmark size={16} />
                    <span>Net banking</span>
                  </button>
                </div>
              </div>
              <InputGroup className="mb-3">
                <InputGroup.Text>Payable Amount</InputGroup.Text>
                <Form.Control
                  type="text"
                  value={`₹${totalPayable.toFixed(2)}`}
                  aria-label="Payable Amount"
                  readOnly
                />
              </InputGroup>
              {splitPayment && (
                <div className="split-payment-fields">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="qr-header">
                      <div className="dot"></div>
                      Split Payment
                    </h5>
                    <button
                      type="button"
                      className="pos-ordered-remove"
                      onClick={() => {
                        setSplitPayment(false);
                        setSplitAmount("");
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="secondAmount">
                        <Form.Label>Second Amount</Form.Label>
                        <Form.Control
                          type="number"
                          min="0.01"
                          max={Math.max(0, totalPayable - 0.01)}
                          step="0.01"
                          placeholder="Enter amount"
                          value={splitAmount}
                          onChange={(e) => setSplitAmount(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="secondMethod">
                        <Form.Label>Second Method</Form.Label>
                        <Form.Select
                          value={splitPaymentMethod}
                          onChange={(e) =>
                            setSplitPaymentMethod(e.target.value)
                          }
                        >
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="Online">Online</option>
                          <option value="NetBanking">Net banking</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  {Number(splitAmount) > 0 &&
                    Number(splitAmount) < totalPayable && (
                      <div className="pos-summary-row mb-3">
                        <span>Remaining Amount</span>
                        <strong>
                          ₹{(totalPayable - Number(splitAmount)).toFixed(2)}
                        </strong>
                      </div>
                    )}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="resto-secondary"
                onClick={() => {
                  setSplitPayment((prev) => !prev);
                  setSplitAmount("");
                }}
              >
                {splitPayment ? "Remove Split Payment" : "Add Split Payment"}
              </button>
              <button
                type="button"
                className="resto-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button className="resto-primary" type="submit">
                Submit
              </button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/**&#x20;Dynamic Add-on Modal&#x20;**/}
        <Modal
          show={modalShow}
          onHide={closeAddOnModal}
          aria-labelledby="add-on-modal-title"
          centered
          className="add-onse-modal"
        >
          {selectedFood && (
            <>
              <Modal.Body>
                <div className="add-ones-body">
                  <div className="add-on-img">
                    <img
                      src={selectedFood.image}
                      className="img-fluid"
                      alt={selectedFood.name}
                    />
                  </div>
                  <div className="add-on-det">
                    <small>{selectedFood.category}</small>
                    <h5 id="add-on-modal-title">{selectedFood.name}</h5>
                    <p>₹{selectedFood.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="add-onse-thinks">
                  {addOnGroups.map((group) => (
                    <div className="add-onse-item-check" key={group.id}>
                      <h5 className="qr-header mb-2">
                        <div className="dot"></div>
                        {group.title}
                      </h5>
                      {group.options.map((option) => {
                        const checked = (selectedAddOns[group.id] || []).some(
                          (item) => item.id === option.id,
                        );
                        return (
                          <div className="add-onse-check-row" key={option.id}>
                            <Form.Check
                              type="checkbox"
                              id={`addon-${group.id}-${option.id}`}
                              checked={checked}
                              onChange={() => handleAddOnChange(group, option)}
                              label={
                                <>
                                  {option.label}
                                  {option.detail && (
                                    <span className="serves-text">
                                      {" "}
                                      {option.detail}
                                    </span>
                                  )}
                                </>
                              }
                            />
                            <span className="add-onse-price">
                              ₹{option.price}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="split-payment-fields mb-2 w-100">
                  <div className="added-summary-row">
                    <div>
                      <strong>{selectedFood.name}</strong>
                      <p>
                        Added :{" "}
                        <span>
                          {selectedAddOnList.length > 0
                            ? selectedAddOnList
                                .map((option) => option.label)
                                .join(", ")
                            : "No extra options selected"}
                        </span>
                      </p>
                      <div className="adons-summery-total">
                        <div className="d-flex justify-content-between summary-total">
                          <span>Base Price</span>
                          <strong>₹{selectedFood.price.toFixed(2)}</strong>
                        </div>
                        <div className="d-flex justify-content-between summary-total">
                          <span>Add-on Price</span>
                          <strong>₹{addOnTotal.toFixed(2)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="resto-cancel"
                  onClick={closeAddOnModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="resto-primary"
                  onClick={addFoodToCart}
                >
                  <Plus size={15} />
                  <strong>₹{selectedFoodTotal.toFixed(2)}</strong>
                </button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </main>
    </>
  );
}
export default UnderPos;
