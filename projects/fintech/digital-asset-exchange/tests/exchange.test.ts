import {describe,it,expect} from "vitest";
import {Exchange} from "../src/exchange";
describe("Exchange matching engine",()=>{
 it("matches crossing limit orders at resting price",()=>{
  const e=new Exchange();e.fund("seller",5,0);e.fund("buyer",0,1000);
  e.submit({accountId:"seller",symbol:"NSTAR-USD",side:"sell",type:"limit",quantity:2,price:10});
  const buy=e.submit({accountId:"buyer",symbol:"NSTAR-USD",side:"buy",type:"limit",quantity:2,price:11});
  expect(buy.status).toBe("filled");expect(e.listTrades()).toHaveLength(1);expect(e.listTrades()[0].price).toBe(10);
  expect(e.balance("buyer").base).toBe(2);expect(e.balance("seller").quote).toBe(20);
 });
 it("uses price-time priority for resting orders",()=>{
  const e=new Exchange();e.fund("s1",2,0);e.fund("s2",2,0);e.fund("b",0,100);
  const first=e.submit({accountId:"s1",symbol:"NSTAR-USD",side:"sell",type:"limit",quantity:1,price:10});
  e.submit({accountId:"s2",symbol:"NSTAR-USD",side:"sell",type:"limit",quantity:1,price:10});
  e.submit({accountId:"b",symbol:"NSTAR-USD",side:"buy",type:"limit",quantity:1,price:10});
  expect(e.getOrder(first.id)?.status).toBe("filled");
 });
 it("partially fills and leaves remainder on the book",()=>{
  const e=new Exchange();e.fund("s",1,0);e.fund("b",0,100);
  e.submit({accountId:"s",symbol:"NSTAR-USD",side:"sell",type:"limit",quantity:1,price:10});
  const order=e.submit({accountId:"b",symbol:"NSTAR-USD",side:"buy",type:"limit",quantity:2,price:10});
  expect(order.status).toBe("partially_filled");expect(order.remaining).toBe(1);
 });
 it("rejects orders with insufficient funds",()=>{
  const e=new Exchange();e.fund("b",0,1);
  expect(()=>e.submit({accountId:"b",symbol:"NSTAR-USD",side:"buy",type:"limit",quantity:1,price:10})).toThrow("Insufficient quote balance");
 });
 it("cancels only the owner's active order",()=>{
  const e=new Exchange();e.fund("s",2,0);e.fund("other",0,100);
  const o=e.submit({accountId:"s",symbol:"NSTAR-USD",side:"sell",type:"limit",quantity:1,price:10});
  expect(()=>e.cancel(o.id,"other")).toThrow("Not order owner");
  expect(e.cancel(o.id,"s").status).toBe("cancelled");
 });
 it("enforces market lot size and market liquidity",()=>{
  const e=new Exchange();e.fund("buyer",0,100);
  expect(()=>e.submit({accountId:"buyer",symbol:"NSTAR-USD",side:"buy",type:"limit",quantity:0.00001,price:10})).toThrow("Quantity violates lot size");
  expect(()=>e.submit({accountId:"buyer",symbol:"NSTAR-USD",side:"buy",type:"market",quantity:1})).toThrow("No liquidity for market order");
 });
 it("returns ordered market depth",()=>{
  const e=new Exchange();e.fund("s1",2,0);e.fund("s2",2,0);
  e.submit({accountId:"s1",symbol:"NSTAR-USD",side:"sell",type:"limit",quantity:1,price:12});
  e.submit({accountId:"s2",symbol:"NSTAR-USD",side:"sell",type:"limit",quantity:1,price:11});
  expect(e.book("NSTAR-USD").asks.map(x=>x.price)).toEqual([11,12]);
 });
});
