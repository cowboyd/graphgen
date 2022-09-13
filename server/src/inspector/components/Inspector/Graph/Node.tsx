import { VertexNode } from "../../../../graphql/types.ts";
import { Loader } from "../../Loader/Loader.tsx";
import { StyledTreeItem } from "./StyledTreeItem.tsx";
import { TypeLabel } from "./TypeLabel.tsx";

interface NodeProps {
  parentId: string;
  node: VertexNode;
}

export function Node({ parentId, node }: NodeProps): JSX.Element {
  const props = node.fields.flatMap((n) =>
    n.__typename === "JSONFieldEntry" ? [n] : []
  );

  const relationships = node.fields.flatMap((n) =>
    n.__typename !== "JSONFieldEntry" ? [n] : []
  );

  return (
    <>
      <div className="angle">{`{`}</div>
      <div className="node">
        <div className="field">
          <span className="fieldname">id</span>
          <div className="type">(string)</div>
          <div className="colon">:</div>
          <span className="value">{node.id.split(":")[1]}</span>
        </div>
        {props
          .map((n, i) => (
            <div className="field" key={`${parentId}${n.key}${i}`}>
              <div className="fieldname">{n.key}</div>
              <div className="type">{`(${n.typename})`}</div>
              <div className="colon">:</div>
              <div className="value">
                {n.typename === "String" && <span>&quot;</span>}
                {n.json as string}
                {n.typename === "String" && <span>&quot;</span>}
              </div>
            </div>
          ))}
        {relationships.map((relationship) => {
          const index = node.fields.findIndex((field) =>
            relationship.key === field.key
          );
          const path = /\|data$/.test(parentId)
            ? `${parentId}.${relationship.key}`
            : `${parentId}.fields.${index}`;
          let id = path;

          if (relationship.__typename === "VertexFieldEntry") {
            id += `.${relationship.__typename}.${relationship.id}`;
          } else if (relationship.__typename === "VertexListFieldEntry") {
            id += `.${relationship.__typename}.${relationship.ids.join(",")}`;
          } else {
            throw new Error(`illegal FieldEntry`);
          }

          console.log({ ke1y: relationship.key });

          return (
            <StyledTreeItem
              key={id}
              nodeId={id}
              label={
                <TypeLabel
                  fieldname={relationship.key}
                  typenames={relationship.typenames}
                />
              }
            >
              {relationship.data &&
                  relationship.__typename === "VertexFieldEntry"
                ? (
                  <StyledTreeItem
                    key={relationship.data.id}
                    nodeId={relationship.data.id}
                    label={
                      <Node
                        parentId={`${path}.data`}
                        node={relationship.data}
                      />
                    }
                  />
                )
                : relationship.__typename === "VertexListFieldEntry" &&
                    !!relationship.data
                ? relationship.data.map((n, i) => (
                  <StyledTreeItem
                    key={n.id}
                    nodeId={n.id}
                    label={<Node parentId={`${path}.data.${i}`} node={n} />}
                  />
                ))
                : <Loader />}
            </StyledTreeItem>
          );
        })}
        <div className="angle">{`}`}</div>
      </div>
    </>
  );
}
