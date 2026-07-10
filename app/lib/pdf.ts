import {extractText , getDocumentProxy} from "unpdf";

export async function extractTextFromPDF(file : File) : Promise<string>{
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));

    const{text  ,totalPages} = await extractText(pdf , {
        mergePages : true,
    });

    console.log(`Total Pages : ${totalPages}`);

    return text;
}