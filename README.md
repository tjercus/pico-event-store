# Pico Event Store

Minimalistic event store implementation

## integrate

```TypeScript
const streamName = 'shoppingcart-1234';

const db = PicoEventStoreImpl("/tmp/databases/my-app");

const streamCreateResult = db.createStream<>(streamName);


streamCreateResult.caseOf({
  Right: console.log,
  Left: console.error
});

type SomeEvent<T> = {
  type: string;
  data: T;
}

const cartCreatedEvent: SomeEvent<string> = {
  type: "CartCreated",
  data: "1234"
};

const appendResult = db.appendToStream<SomeEvent<string>>(streamName, cartCreatedEvent);

appendResult.caseOf({
  Right: console.log,
  Left: console.error
});
```

## test

`npm run test`
