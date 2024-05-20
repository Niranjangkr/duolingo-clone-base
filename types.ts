import { z } from "zod"

export const fetchChatApiRequestValidator =  z.object({
    threadId: z.string() 
});

export const fetchChatApiRequestResponse = z.union([
    z.object({
        error: z.string(),
        message: z.undefined(),
    }),
    z.object({
        error: z.undefined(),
        messages: z.array(
            z.object({
                id: z.string(),
                role: z.enum(["user", "assistant"]),
                content: z.string(),
                created_at: z.number()
            })
        )
    })
])

export type FetchChatApiRequest = z.infer<typeof fetchChatApiRequestValidator>
export type FetchChatApiResponse = z.infer<typeof fetchChatApiRequestResponse >