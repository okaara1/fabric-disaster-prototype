"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const bodyParser = __importStar(require("body-parser"));
// App routes
const controllers_1 = require("./controllers");
class App {
    constructor() {
        this.express = express_1.default();
        this
            .setMiddlewares()
            .setRoutes();
    }
    setMiddlewares() {
        this.express.use(morgan_1.default('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        return this;
    }
    setRoutes() {
        let router = express_1.default.Router();
        this.express.use('/api/v1/welcome', controllers_1.welcomeRoutes);
        this.express.use('/api/v1/records', controllers_1.medicalRecordRoutes);
        return this;
    }
}
exports.default = new App().express;
