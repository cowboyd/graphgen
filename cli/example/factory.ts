const { createGraphGen, weighted } = require("@frontside/graphgen");
const { fakergen } = require("./fakerGen.ts");

const world = `
type User {
  displayName: String! @gen(with: "@faker/name.fullName")
  email: String! @computed
  name: String! @computed
  picture: String! @gen(with: "@faker/internet.avatar")

}
type Group {
  name: String! @computed
  department: String! @gen(with: "@faker/commerce.department")
  description: String! @computed
  displayName: String! @computed
  email: String! @computed
  picture: String! @gen(with: "@faker/image.business", args: [null, null, true])
}

union Container = Component | System

type Component {
  name: String! @gen(with: "@faker/lorem.slug")
  description: String! @gen(with: "@faker/lorem.lines", args: [1])
  type: String! @computed
  lifecycle: String! @gen(with: "@backstage/component.lifecycle")
  owner: Group!
  partOf: [Container] @affinity(of: 0.25) @size(mean: 0.25)
  subComponents: [Component] @affinity(of: 0.25) @size(mean: 0)
  consumes: [API] @affinity(of: 0.1) @size(mean: 1)
  provides: [API] @affinity(of: 0.1) @size(mean: 1)
  dependencies: [Resource] @affinity(of: 0.1) @size(mean: 1)
}

type System {
  name: String! @computed
  description: String! @computed
  displayName: String! @gen(with: "@faker/commerce.productName")
}

type API {
  name: String! @gen(with: "@faker/lorem.slug", args: [2])
  description: String! @gen(with: "@faker/lorem.words", args: [20])
  consumedBy: [Component] @inverse(of: "Component.consumes") @affinity(of: 0.1) @size(mean: 3)
  providedBy: Component! @inverse(of: "Component.provides") @affinity(of: 0.1)
}

type Resource {
  name: String! @gen(with: "@faker/lorem.slug", args: [2])
}

type Link {
  title: String! @gen(with: "@faker/lorem.slug", args: [2])
  url: String! @gen(with: "@faker/internet.url")
}

type Domain {
  name: String! @gen(with: "@faker/lorem.slug")
  description: String! @gen(with: "@faker/lorem.lines", args: [1])
  owner: Group!
  tags: [String!]! @gen(with: "@backstage/tags")
  links: [Link!]! @size(mean: 2)
}
`;

const lifecycles = weighted([["deprecated", .15], ["experimental", .5], [
  "production",
  .35,
]]);

const gen = (info) => {
  if (info.method === "@backstage/component.lifecycle") {
    return lifecycles.sample(info.seed);
  } else {
    return info.next();
  }
};

module.exports = createGraphGen({
  seed: "factory",
  source: world,
  sourceName: "world.graphql",
  generate: [gen, fakergen],
  compute: {
    "User.name": ({ displayName }) =>
      `${displayName.toLowerCase().replace(/\s+/g, ".")}`,
    "User.email": ({ name }) => `${name}@example.com`,
    "Group.name": ({ department }) => `${department.toLowerCase()}-department`,
    "Group.description": ({ department }) => `${department} Department`,
    "Group.displayName": ({ department }) => `${department} Department`,
    "Group.email": ({ department }) => `${department.toLowerCase()}@acme.com`,

    "Component.type": () => "website",

    "System.name": ({ displayName }) =>
      displayName.toLowerCase().replace(/\s+/g, "-"),
    "System.description": ({ displayName }) =>
      `Everything related to ${displayName}`,
  },
});
