import { NextResponse } from "next/server";
import { retrieveRelevantChunks } from "@/app/lib/retrieval";
import { generateAnswer } from "@/app/lib/chat";

export async function POST(request: Request) {

    try {

        const { question , documentId} = await request.json();

        if (!question || !documentId) {
            return NextResponse.json(
                {
                    error: "Question and document are required"
                },
                {
                    status: 400
                }
            );
        }

        const retrievedChunks = await retrieveRelevantChunks(question , documentId);

        const context = retrievedChunks.join("\n\n");

        const answer = await generateAnswer(
            question,
            context
        );




        return NextResponse.json({
            success: true,
            answer,
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Something went wrong"
            },
            {
                status: 500
            }
        );
    }

}