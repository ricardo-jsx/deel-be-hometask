import { Err, Ok } from "ts-results";

type ErrResponse = { status: number, message: string }

export type UsecaseResponse<T> = Promise<Ok<T> | Err<ErrResponse>>;
