"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueData = exports.getViolations = exports.getMetrics = void 0;
const mockData_1 = require("../data/mockData");
const getMetrics = (req, res) => {
    res.json(mockData_1.trafficMetrics);
};
exports.getMetrics = getMetrics;
const getViolations = (req, res) => {
    res.json(mockData_1.violations);
};
exports.getViolations = getViolations;
const getQueueData = (req, res) => {
    res.json(mockData_1.queueData);
};
exports.getQueueData = getQueueData;
