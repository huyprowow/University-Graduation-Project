import { DataType, MilvusClient } from "@zilliz/milvus2-sdk-node";

export const COLLECTION_NAME = `product_vector`;
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
    dim: 384,
  },
  {
    name: "productId",
    data_type: DataType.VarChar,
    max_length: 100,
  },
];

async function milvusdbConnect() {
  const address = process.env.MILVUS_DB_ADDRESS ?? "";
  // connect to milvus
  const client: MilvusClient = new MilvusClient({ address });
  // define schema
  // create collection
  const exist = await client.hasCollection({
    collection_name: COLLECTION_NAME,
  });
  if (!exist?.value) {
    const create = await client.createCollection({
      collection_name: COLLECTION_NAME,
      fields: schema,
    });
    console.log("Create collection is finished.", create);

    // create index
    const createIndex = await client.createIndex({
      // required
      collection_name: COLLECTION_NAME,
      field_name: "vector", // optional if you are using milvus v2.2.9+
      index_name: "myindex", // optional
      index_type: "HNSW", // optional if you are using milvus v2.2.9+
      params: { efConstruction: 10, M: 384 }, // optional if you are using milvus v2.2.9+
      metric_type: "COSINE", // optional if you are using milvus v2.2.9+
    });
    console.log("Index is created", createIndex);

    const load = await client.loadCollectionSync({
      collection_name: COLLECTION_NAME,
    });
  }

  return client;
}
export default milvusdbConnect;
