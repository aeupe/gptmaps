import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_GPTMAPS_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const openAiApiKey = getState().settings.openAiApiKey
      if (openAiApiKey) {
        headers.set('X-OpenAi-Api-Key', openAiApiKey)
      }
      return headers
    }
  }),
  endpoints: build => ({
    postQuery: build.mutation({
      query: body => ({ 
        url: `query`,
        method: 'POST',
        body
      }),
    }),
  }),
})

export const { 
  usePostQueryMutation
} = api