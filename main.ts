import { FSDB, FSDBError } from "npm:file-system-db@2.1.0";
import { Either, Left, Right } from "npm:purify-ts@2.1.0";

export type PicoEventStore = {
  appendToStream: <T>(
    streamName: string,
    event: T,
  ) => Either<FSDBError, Array<T>>;
  createStream: <T>(streamName: string) => Either<FSDBError, Array<T>>;
  getStreamVersion: (streamName: string) => Either<FSDBError, number>;
  readStream: <T>(streamName: string) => Either<FSDBError, Array<T>>;
};

/**
 * Simplest implementation of an Event Store using file-system-db
 */
const PicoEventStoreImpl = (storageDir: string = "storage"): PicoEventStore => ({
  appendToStream: <T>(streamName: string, event: T) => {
    try {
      const db = new FSDB(`./${storageDir}/${streamName}.json`, false);
      if (db.getAll().length === 0) {
        PicoEventStoreImpl().createStream(streamName);
      }
      db.push(streamName, event);
      return Right(db.getAll()[0] as unknown as Array<T>);
    } catch (ex: unknown) {
      return Left(ex as FSDBError);
    }
  },
  createStream: <T>(streamName: string) => {
    try {
      const db = new FSDB(`./${storageDir}/${streamName}.json`, false);
      db.set(streamName, []);
      return Right(db.getAll()[0] as unknown as Array<T>);
    } catch (ex: unknown) {
      return Left(ex as FSDBError);
    }
  },
  getStreamVersion: (streamName: string) => {
    try {
      const db = new FSDB(`./${storageDir}/${streamName}.json`, false);
      return Right(db.get(streamName).length);
    } catch (ex: unknown) {
      return Left(ex as FSDBError);
    }
  },
  readStream: <T>(streamName: string) => {
    try {
      const db = new FSDB(`./${storageDir}/${streamName}.json`, false);
      return Right(db.get(streamName) as unknown as Array<T>);
    } catch (ex: unknown) {
      return Left(ex as FSDBError);
    }
  },
});

export default PicoEventStoreImpl;
