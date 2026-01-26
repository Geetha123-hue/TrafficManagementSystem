import { Request, Response } from 'express';
import { trafficMetrics, violations, queueData } from '../data/mockData';

export const getMetrics = (req: Request, res: Response) => {
    res.json(trafficMetrics);
};

export const getViolations = (req: Request, res: Response) => {
    res.json(violations);
};

export const getQueueData = (req: Request, res: Response) => {
    res.json(queueData);
};
