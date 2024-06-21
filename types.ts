import { z } from "zod"

export type Level = "basic" | "intermediate" | "advanced";

export type userCourseProgressType2 = {
    level: string,
    questionIndex: number
}

export type Quiz = {
    question: string,
    options: string[],
    correct_answer: string,
    explanation: string,
}

export type Unit = {
    basic: Quiz[],
    intermediate: Quiz[],
    advanced: Quiz[]
}

export type UserCourseProgressType = {
    level: string;
    id: number;
    userId: string;
    userCourseId: number;
    questionIndex: number;
}

export type CourseDataType = {
    [key: string]: Unit
}

export interface Course {
    courseData: CourseDataType | null,
    createdAt: string,
    userId: string,
    id: string
}

export const threadSchema = z.array(
    z.object({
        folderId: z.number(),
        threadId: z.union([z.string(), z.null()]),
        id: z.number(),
        name: z.string(),
        createdAt: z.union([z.instanceof(Date), z.null()])
    })
)

export const errorResponseSchema = z.object({
    error: z.string(),
    data: z.undefined(),
})

export const fetchChatApiRequestValidator = z.object({
    threadId: z.string()
});

export const fetchFolderResponse = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
        userId: z.string(),
        createdAt: z.any()
    })
)

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

export const folderCreateResponse = z.union([
    z.object({
        error: z.string(),
        message: z.undefined().optional(),
    }),
    z.object({
        error: z.undefined().optional(),
        message: z.object({
            id: z.number(),
            userId: z.string(),
            name: z.string(),
            createdAt: z.any()
        }).optional()
    }),
    z.object({
        error: z.undefined().optional(),
        message: z.undefined().optional()
    })
])

export const newChatCreateResponse = z.union([
    z.object({
        message: z.undefined().optional(),
    }),
    z.object({
        message: z.array(
            z.object({
                folderId: z.number(),
                id: z.number(),
                name: z.string(),
                createdAt: z.union([z.instanceof(Date), z.string(), z.null()]),
                threadId: z.string().nullable()
            })
        )
    }),
    z.object({
        error: z.undefined().optional(),
        message: z.undefined().optional()
    })
])

export const fetchFolderThreadsApiRequestResponse = z.union([
    z.object({
        error: z.undefined(),
        data: threadSchema
    }),
    errorResponseSchema
])


export const fetchFolderThreadsByIdRequestValidator = z.object({
    folderId: z.number()
})

export const newChatRequest = z.object({
    folderId: z.number()
});

export type NewChatRequest = z.infer<typeof newChatRequest>;
export type Thread = z.infer<typeof threadSchema>
export const fetchFolderThreadsResponseSchama = z.array(threadSchema);
export type FetchFolderThreadsApiResponse = z.infer<typeof fetchFolderThreadsApiRequestResponse>
export type FetchFolderByIdRequest = z.infer<typeof fetchFolderThreadsByIdRequestValidator>
export type FetchChatApiRequest = z.infer<typeof fetchChatApiRequestValidator>
export type FetchFolderResponse = z.infer<typeof fetchFolderResponse>
export type FetchChatApiResponse = z.infer<typeof fetchChatApiRequestResponse>
export type FolderCreateResponse = z.infer<typeof folderCreateResponse>
export type NewChatCreateResponse = z.infer<typeof newChatCreateResponse>