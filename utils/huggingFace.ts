import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGING_FACE_TOKEN);

export const embeddingText = async (s: string) => {
  return await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: s,
  });
};
