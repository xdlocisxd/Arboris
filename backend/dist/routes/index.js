"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const tree_controller_1 = require("../controllers/tree.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Passwords & Tokens
router.post('/auth/register', auth_controller_1.register);
router.post('/auth/login', auth_controller_1.login);
// Trees
router.post('/trees/sync', auth_middleware_1.authMiddleware, tree_controller_1.syncTrees);
router.get('/trees', auth_middleware_1.authMiddleware, tree_controller_1.getTrees);
exports.default = router;
