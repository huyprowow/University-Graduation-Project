import { DataType, MilvusClient } from "@zilliz/milvus2-sdk-node";

export const collection_name = `product-vector`;
const dim = 128;
const schema = [
  {
    name: "id",
    data_type: DataType.Int64,
    is_primary_key: true,
    autoID: true,
  },
  {
    name: "vector",
    description: "Vector field",
    data_type: DataType.FloatVector,
    dim: 8,
  },
  {
    name: "productId",
    data_type: DataType.VarChar,
  },
];

async function milvusdbConnect() {
  const address = process.env.MILVUS_DB_ADDRESS ?? "";
  // connect to milvus
  const client: MilvusClient = new MilvusClient({ address });
  // define schema
  // create collection

  const create = await client.createCollection({
    collection_name,
    fields: schema,
  });
  console.log("Create collection is finished.", create);

  // create index
  const createIndex = await client.createIndex({
    // required
    collection_name,
    field_name: "vector", // optional if you are using milvus v2.2.9+
    index_name: "myindex", // optional
    index_type: "HNSW", // optional if you are using milvus v2.2.9+
    params: { efConstruction: 10, M: 4 }, // optional if you are using milvus v2.2.9+
    metric_type: "COSINE", // optional if you are using milvus v2.2.9+
  });
  console.log("Index is created", createIndex);

  const load = await client.loadCollectionSync({
    collection_name,
  });
  return client;
}
export default milvusdbConnect;
