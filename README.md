## Usage

Intallation

```bash
npm install @mavvy/minigql-plugin-miniserver
```

Add the plugin configuration

```bash
// minigql.plugins.js
import miniserverPlugin from '@mavvy/minigql-plugin-miniserver';

export default [
  miniserverPlugin({
    product: {
      url: 'http://localhost:3001',
      methods: ['products', 'productById', 'addProduct'],
    },
  }),
];
```

### Usage
Call the service on you resolver
```javascript
// resolvers/myProducts
export const resolverType = 'Query';

export const returnType = '[Product]';

export const handler = async ({services}) => {
  const res = await services.product.products();

  return res.data;
}
```

```javascript
// resolvers/addProduct.ts

export const resolverType = 'Mutation';

export const inputVariable = 'AddProductInput!';

export const returnType = 'Product';

export async function handler({ services, input }) {
  const res = await services.product.addProduct(input);

  return res.data;
}

```

#### @mavvy/miniserver handler

This one should reside on your miniserver app

```javascript
// handlers/productList.ts

export async function handler({ currentModel }) {
  const data = await currentModel.find();

  return data.map((doc: any) => ({
    id: doc.id,
    name: doc.name,
  }));
}
```

```javascript
// handlers/addProduct.ts

export async function handler({ currentModel, input }) {
  const doc = await currentModel.create(input);

  return {
    id: doc.id,
    name: doc.name,
  };
}
```

See more on [@mavvy/miniserver](https://github.com/mavvy22/miniserver)
