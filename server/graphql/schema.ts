import { gql } from 'graphql_tag';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';


export const typeDefs = gql`
scalar JSON
scalar JSONObject

interface Node {
  id: ID!
  typename: String!
}

type NodeEdge {
  node: Node
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type NodeConnection {
  count: Int
  pageInfo: PageInfo
  edges: [NodeEdge!]
}

type Vertex {
  id: ID!
  typename: String!
  fields: JSON
  computed: JSON
  references: [VertexEntry]
}

type VertexEntry {
  key: String!
  value: Vertex!
}

type VertexEdge {
  node: Vertex
  cursor: String
}

type VertexConnection {
  count: Int
  pageInfo: PageInfo
  edges: [VertexEdge!]
}

type Type {
  name: String
  count: Int
  nodes: NodeConnection
  vertices: VertexConnection
}

type Query {
  meta: [Type]
}
`;

export const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
};
