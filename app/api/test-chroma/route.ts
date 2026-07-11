import { NextResponse } from "next/server";
import { getCollection } from "@/app/lib/vectorStore";


export async function GET(){

    try{
        const collection = await getCollection();

        return NextResponse.json({
            success : true,
            collectionName : collection.name,
        });
    }
    catch(error){
        console.error(error);
        
        return NextResponse.json(
            {
                success : false,
                error : "Failed to connecto to ChromaDB",
            },
            {
                status : 500,
            }
        );
    }
}