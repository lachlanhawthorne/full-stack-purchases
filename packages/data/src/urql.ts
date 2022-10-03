import { createClient } from '@urql/core';
import supabaseClient from './supabase';

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZHlqZ3Zhb3BsdWFnYnV5bm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzcyNzEsImV4cCI6MTk3ODA1MzI3MX0.HcBAsuWBWK3yT0yLY6WZYI4UO5R2D7CXyUoXs5_2ByY",
  };

  const authorization = supabaseClient.auth.session()?.access_token;

  if (authorization) {
    headers["authorization"] = `Bearer ${authorization}`;
  }

  return headers;
}

export const urqlClient = createClient({
  url: `https://eddyjgvaopluagbuynoi.supabase.co/graphql/v1`,
  fetchOptions: function createFetchOptions() {
    return { headers: getHeaders() };
  },
});

export default urqlClient;