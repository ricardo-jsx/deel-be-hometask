import type { Request, Response } from "express";

export type ExpressHandler<T extends unknown> = (params: unknown, body: unknown) => T;

export default class ExpressAdapter {
	static create<T> (fn: ExpressHandler<T>) {
		return async function (req: Request, res: Response) {
			const obj = await fn(req.params, req.body);
			res.json(obj);
		}
	}
}