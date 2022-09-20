import React from "react";
import type { SyntheticEvent } from "react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import { Loader } from "../Loader/Loader.tsx";
import { Node } from "./Node.tsx";
import { all, node } from "./queries.ts";
import { graphReducer } from "./graphReducer.ts";
import type { VertexNode } from "@frontside-graphgen/types";
import { MinusSquare, PlusSquare } from "./icons.tsx";
import { StyledTreeItem } from "./StyledTreeItem.tsx";
import { fetchGraphQL } from "../../graphql/fetchGraphql.ts";

const emptyGraph = { graph: {} };

export function GraphInspector(): JSX.Element {
  const [graphLoaded, setGraphLoaded] = useState(false);
  const [{ graph }, dispatch] = useReducer(graphReducer, emptyGraph);
  const expandedNodes = useRef(new Set<string>());

  const handleChange = useCallback(
    async (_: SyntheticEvent, nodeIds: string[]) => {
      if (nodeIds.length === 0) {
        return;
      }

      const nodeId = nodeIds[0];

      if (expandedNodes.current.has(nodeId)) {
        console.log(`${nodeId} has previously been opened`);
        return;
      }

      expandedNodes.current.add(nodeId);

      if (nodeId.indexOf(".") > -1) {
        const path = nodeId.split(".");

        const [fieldEntryType, ids] = path.slice(-2);

        const pathToField = path.slice(0, -2);

        if (fieldEntryType === "VertexListFieldEntry") {
          try {
            const nodes = await Promise.all<{ data: { node: VertexNode } }>(
              ids.split(",")
                .map((id) => node(id)),
            );

            dispatch({
              type: "EXPAND",
              payload: {
                kind: "VertexListFieldEntry",
                path: pathToField,
                nodes: nodes.map((node) => node.data.node),
              },
            });
          } catch (e) {
            console.error(e);
            throw e;
          }
        } else {
          try {
            const response = await node(ids);

            dispatch({
              type: "EXPAND",
              payload: {
                kind: "VertexFieldEntry",
                path: pathToField,
                node: response.data.node,
              },
            });
          } catch (e) {
            console.error(e);
            throw e;
          }
        }

        return;
      }

      try {
        const response = await all(nodeId);

        dispatch({
          type: "ALL",
          payload: {
            typename: nodeIds[0],
            nodes: response.data.all,
          },
        });
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
    [],
  );

  useEffect(() => {
    async function loadGraph() {
      if(graphLoaded) {
        return;
      }
      const graph = await fetchGraphQL(`
      query Meta {
        meta {
          typename
          count
        }
      }
      `);

      dispatch({ type: "ROOTS", payload: graph.data.meta });
    }

    loadGraph()
      .then(() => setGraphLoaded(true))
      .catch(console.error);
  }, []);

  if (!graphLoaded) {
    return <Loader />;
  }

  console.dir(Object.values(graph))

  return (
    <TreeView
      aria-label="graph inspector"
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      onNodeToggle={handleChange}
      multiSelect={false}
    >
      {Object.values(graph).map(({ typename, label, nodes }) => ((
        <StyledTreeItem
          key={typename}
          nodeId={typename}
          label={label}
        >
          {nodes.length > 0
            ? nodes.map((vertexNode, i) => {
              return (
                <StyledTreeItem
                  key={vertexNode.id}
                  nodeId={vertexNode.id}
                  label={
                    <Node
                      parentId={`${typename}.nodes.${i}`}
                      node={vertexNode}
                    />
                  }
                />
              );
            })
            : <Loader />}
        </StyledTreeItem>
      )))}
    </TreeView>
  );
}
