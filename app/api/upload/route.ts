import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/app/lib/pdf";
import { chunkText } from "@/app/lib/chunk";
import { generateEmbedding } from "@/app/lib/embeddings";
import { processPDF } from "@/app/lib/rag";

export async function POST(request : Request){

    try{
        const formData = await request.formData();

        const file = formData.get("file") as File;

        if(!file){

            return NextResponse.json(
                {error : "No file uploaded"},
                {status : 400}
            );
        }

        if(file.type !== "application/pdf"){
            return NextResponse.json(
                {error : "only pdf files are allowred"},
                {status : 400}
            );
        }

        console.log("File Name : " , file.name);
        console.log("File Type: " , file.type);
        console.log("File Size: " , file.size);


        const chunks = await processPDF(file);

        return NextResponse.json({
            success:true,
            totalChunks : chunks.length,
        });

        

    }catch(error){
        console.error(error);

        return NextResponse.json(
            {error : "Something went wrong"},
            {status : 500}
        );
    }
}