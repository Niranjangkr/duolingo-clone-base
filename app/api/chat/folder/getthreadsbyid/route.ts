import { NextRequest } from "next/server";

import { getThreadsInFolder } from "@/db/queries";
import { fetchFolderThreadsApiRequestResponse, fetchFolderThreadsByIdRequestValidator } from "@/types";

export const POST = async (req: NextRequest) => {
    try {
        const { folderId } = fetchFolderThreadsByIdRequestValidator.parse(await req.json());
        const data = await getThreadsInFolder(folderId);
        
        const response = fetchFolderThreadsApiRequestResponse.parse({
            error: undefined,
            data: data
        })
        
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.log("ERROR: ",error)
        const response = fetchFolderThreadsApiRequestResponse.parse({
         error: (error as Error).message,
         data: undefined,
        });
 
        return new Response(JSON.stringify(response), { status: 422 });
    }
}