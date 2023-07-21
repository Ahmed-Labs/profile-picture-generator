import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.DALLE_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateIcon(prompt: string): Promise<string> {
  if (env.MOCK_DALLE === "true") {
    return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-IQg8ead6Ki4Dl8PV9khCC46H/user-NZ6TVdGruLzSqWgtxcbWyyeU/img-klRv4CtrQvAKpMvEpWwYOCda.png?st=2023-07-20T18%3A47%3A54Z&se=2023-07-20T20%3A47%3A54Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-19T20%3A04%3A40Z&ske=2023-07-20T20%3A04%3A40Z&sks=b&skv=2021-08-06&sig=gNlZRHrVerk14m3gsWV/fApBefx5ZDG3Q%2BmYEYoFc2A%3D";
  } else {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return response.data.data[0]?.url!;
  }
}

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("we are here", input.prompt);

      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
          credits: {
            gte: 1,
          },
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have enough credits",
        });
      }

      const url = await generateIcon(input.prompt);

      return { imageUrl: url };
    }),
});
