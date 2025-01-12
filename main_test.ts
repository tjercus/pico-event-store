// @ts-nocheck
import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { Right } from "npm:purify-ts@2.1.0";
//
import PicoEventStoreImpl from "./main.ts";

const sp = "./storage";

const checkFileExists = (filePath: string) => existsSync(filePath);

describe("PicoEventStoreImpl", () => {
  it("should create a stream as a file", () => {
    const streamName = "test1";
    const createStreamResult = PicoEventStoreImpl().createStream(streamName);
    assertEquals(createStreamResult.isRight(), true);
    assertEquals(checkFileExists(`${sp}/${streamName}.json`), true);
    assertEquals(PicoEventStoreImpl().getStreamVersion(streamName), Right(0));
  });
  it("should append an event to a stream", () => {
    const streamName = "test2";
    const appendToStreamResult = PicoEventStoreImpl().appendToStream(
      streamName,
      {
        type: "TestedIt",
      },
    );
    assertEquals(
      JSON.stringify(appendToStreamResult.extract()),
      `[{"type":"TestedIt"}]`,
    );
    assertEquals(checkFileExists(`${sp}/${streamName}.json`), true);
    assertEquals(PicoEventStoreImpl().getStreamVersion(streamName), Right(1));
  });
  it("should read a stream", () => {
    const streamName = "test3";
    const appendToStreamResult = PicoEventStoreImpl().appendToStream(
      streamName,
      {
        type: "TestedItOne",
      },
    );
    assertEquals(
      JSON.stringify(appendToStreamResult.extract()),
      `[{"type":"TestedItOne"}]`,
    );
    const appendToStreamResult2 = PicoEventStoreImpl().appendToStream(
      streamName,
      {
        type: "TestedItTwo",
      },
    );
    assertEquals(
      JSON.stringify(appendToStreamResult2.extract()),
      `[{"type":"TestedItOne"},{"type":"TestedItTwo"}]`,
    );
    assertEquals(
      PicoEventStoreImpl().readStream(streamName),
      Right([{ type: "TestedItOne" }, { type: "TestedItTwo" }]),
    );
    assertEquals(PicoEventStoreImpl().getStreamVersion(streamName), Right(2));
  });
  it("cleans itself up", () => {
    readdirSync(sp).forEach((f) => rmSync(`${sp}/${f}`));
  });
});
