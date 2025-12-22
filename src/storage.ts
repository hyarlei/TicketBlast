import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadPdf(fileName: string, pdfBuffer: Buffer): Promise<string> {
  const { error: uploadError } = await supabase.storage
    .from('ingressos-bucket')
    .upload(fileName, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Erro no upload: ${uploadError.message}`);
  }

  const { data, error: urlError } = await supabase.storage
    .from('ingressos-bucket')
    .createSignedUrl(fileName, 3600);

  if (urlError || !data?.signedUrl) {
    throw new Error(`Erro ao gerar URL assinada: ${urlError?.message}`);
  }

  return data.signedUrl;
}