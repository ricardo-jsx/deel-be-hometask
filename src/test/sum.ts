import { justLog } from "~/test/just-log";

export function sum(a: number, b: number): number {
  justLog();
  return a + b;
}