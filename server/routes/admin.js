// routes/admin.js
import express from "express"
import { adminAuth } from "../middleware/auth.js"
import {
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  listUsers,
  listPurchases,
  getPurchase,
  updatePurchaseNotes,
  initiateRefund,
} from "../controllers/adminController.js"
import {
  getInventoryLogs,
  getStockOverview,
  adjustStock,
  getSalesSummary,
  getSalesTimeline,
  getSalesByDate,
  getTopProducts,
} from "../controllers/inventoryController.js"
import { getSettings, updateSettings } from "../controllers/settingsController.js"

const router = express.Router();

// All routes require admin token
router.use(adminAuth);

// Products
router.get('/products', listProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Users & Purchases (view only)
router.get('/users', listUsers);
router.get('/purchases', listPurchases);
router.get('/purchases/:id', getPurchase);
router.patch('/purchases/:id/notes',  updatePurchaseNotes);
router.post('/purchases/:id/refund',  initiateRefund);

// Inventory
router.get('/inventory/logs',    getInventoryLogs);   // ?productId=&type=&dateFrom=&dateTo=&page=&limit=
router.get('/inventory/stock',   getStockOverview);   // current stock per product
router.post('/inventory/adjust', adjustStock);        // manual stock adjustment

// Sales Analytics
router.get('/sales/summary',      getSalesSummary);   // ?dateFrom=&dateTo=&source=
router.get('/sales/timeline',     getSalesTimeline);  // ?groupBy=day|month|year&dateFrom=&dateTo=
router.get('/sales/by-date',      getSalesByDate);    // ?date=YYYY-MM-DD
router.get('/sales/top-products', getTopProducts);    // ?dateFrom=&dateTo=&limit=&source=

// Settings
router.get('/settings',  getSettings);
router.put('/settings',  updateSettings);

export default router;
