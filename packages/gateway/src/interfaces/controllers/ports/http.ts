import { FastifyReply, FastifyRequest } from "fastify";

export interface HttpResponse {
    statusCode: number
    body: any,
    headers?: any
    raw?: any
  }
  
export interface HttpRequest {
  body?: any;
  headers?: any;
  params?: any;
  query?: any;
  
  raw?: FastifyRequest['raw']; 
  reply?: FastifyReply;
}