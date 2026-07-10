import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/app/lib/pdf";

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


        const extractedText = await extractTextFromPDF(file);
        console.log(extractedText);

        return NextResponse.json({
            success : true,
            extractedText,
        });

        

    }catch(error){
        console.error(error);

        return NextResponse.json(
            {error : "Something went wrong"},
            {status : 500}
        );
    }
}