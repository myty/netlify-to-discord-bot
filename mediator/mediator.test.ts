import {
  assertEquals,
  assertNotEquals,
  assertThrows,
} from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { Mediator, Request } from "./mediator.ts";

Deno.test("Mediator", async (t) => {
  // Setup
  class TestClass1 extends Request<Promise<number>> {}
  class TestClass2 extends Request<Promise<number>> {}
  class TestClass3 extends Request {}
  const mediator = new Mediator();
  const expected = 42;

  await t.step("requestTypeId is unique for each inherited class", () => {
    assertNotEquals(TestClass1.requestTypeId, TestClass2.requestTypeId);
  });

  await t.step("can add handler for request type", () => {
    mediator.use(TestClass1, () => Promise.resolve(expected));
  });

  await t.step("can add handler with no response for request type", () => {
    mediator.use(TestClass3, () => {});
    mediator.send(new TestClass3());
  });

  await t.step(
    "cannot add a request handler for the same type more than once",
    () => {
      assertThrows(() => {
        mediator.use(TestClass1, () => Promise.resolve(expected));
      });
    },
  );

  await t.step("send request calls correct handler", async () => {
    assertEquals(await mediator.send(new TestClass1()), expected);
  });

  await t.step(
    "send request has exception if there is no registered handler",
    () => {
      assertThrows(() => {
        class UnregisteredClass extends Request<number> {}
        mediator.send(new UnregisteredClass());
      });
    },
  );
});
