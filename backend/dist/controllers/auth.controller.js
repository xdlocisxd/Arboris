"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const zod_1 = require("zod");
const authSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().optional()
});
const register = async (req, res) => {
    try {
        const { email, password, name } = authSchema.parse(req.body);
        const existing = await server_1.prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ error: 'User exists' });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await server_1.prisma.user.create({
            data: { email, password: hashedPassword, name: name || 'Researcher' }
        });
        res.status(201).json({ id: user.id, email: user.email });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = authSchema.parse(req.body);
        const user = await server_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ error: 'Invalid credentials' });
        const valid = await bcryptjs_1.default.compare(password, user.password);
        if (!valid)
            return res.status(400).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.login = login;
