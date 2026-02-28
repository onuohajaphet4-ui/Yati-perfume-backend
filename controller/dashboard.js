import Order from "../model/order.js";
import {user} from "../model/user.js";

// get stats by time range
const getDateRange = (period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case "today":
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      break;

    case "week":
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      break;

    case "month":
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
      break;

    case "year":
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
      break;

    default:
      return {}; 
  }

  return { createdAt: { $gte: startDate } };
};

export const getDashboardStats = async (req, res) => {
  try {
    const period = req.query.period || "all";
    const dateFilter = getDateRange(period);

    const orders = await Order.find(dateFilter);

    const totalUsers = await user.countDocuments();

    //  Total Customers (users who ordered)
    const customerIds = await Order.distinct("user", dateFilter);
    const totalCustomers = await user.countDocuments(dateFilter)

    let totalRevenue = 0;
    let totalProductsSold = 0;

    orders.forEach(order => {
      totalRevenue += order.totalAmount || 0;

      order.items?.forEach(item => {
        totalProductsSold += item.quantity || 0;
      });
    });

    const AOV =
      orders.length > 0
        ? totalRevenue / orders.length
        : 0;

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      totalUsers,
      totalCustomers,   
      totalProductsSold,
      AOV
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCustomerDashboard = async (req, res) => {
  try {
    const period = req.query.period || "all";
    const dateFilter = getDateRange(period);

    const orders = await Order.find({
      userId: req.user._id,
      ...dateFilter
    });

    const totalSpent = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const totalProducts = orders.reduce(
      (sum, order) => sum + (order.items?.length || 0),
      0
    );

    const pendingOrders = orders.filter(
      order => order.status === "processing"
    ).length;

    res.json({
      totalOrders: orders.length,
      totalSpent,
      totalProducts,
      pendingOrders,
      recentOrders: orders.slice(-5).reverse()
    });

    console.log("Logged user:", req.user._id);
    console.log("Orders found:", orders.length)
    console.log("product found:", totalProducts)

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};