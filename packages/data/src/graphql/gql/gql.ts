/* eslint-disable */
import * as graphql from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "query GetUserAccount($id: UUID) {\n  accountCollection(filter: {id: {eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        interval\n        name\n        subscribed\n      }\n    }\n  }\n}": graphql.GetUserAccountDocument,
};

export function gql(source: "query GetUserAccount($id: UUID) {\n  accountCollection(filter: {id: {eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        interval\n        name\n        subscribed\n      }\n    }\n  }\n}"): (typeof documents)["query GetUserAccount($id: UUID) {\n  accountCollection(filter: {id: {eq: $id}}) {\n    edges {\n      node {\n        id\n        created_at\n        interval\n        name\n        subscribed\n      }\n    }\n  }\n}"];

export function gql(source: string): unknown;
export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;