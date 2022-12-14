// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[name].tsx";
import * as $1 from "./routes/_404.tsx";
import * as $2 from "./routes/_500.tsx";
import * as $3 from "./routes/api/joke.ts";
import * as $4 from "./routes/docs/[...slug].tsx";
import * as $5 from "./routes/gfm.css.ts";
import * as $6 from "./routes/index.tsx";
import * as $7 from "./routes/showcase.tsx";
import * as $$0 from "./islands/ComponentGallery.tsx";
import * as $$1 from "./islands/CopyArea.tsx";
import * as $$2 from "./islands/Counter.tsx";
import * as $$3 from "./islands/LemonDrop.tsx";

const manifest = {
  routes: {
    "./routes/[name].tsx": $0,
    "./routes/_404.tsx": $1,
    "./routes/_500.tsx": $2,
    "./routes/api/joke.ts": $3,
    "./routes/docs/[...slug].tsx": $4,
    "./routes/gfm.css.ts": $5,
    "./routes/index.tsx": $6,
    "./routes/showcase.tsx": $7,
  },
  islands: {
    "./islands/ComponentGallery.tsx": $$0,
    "./islands/CopyArea.tsx": $$1,
    "./islands/Counter.tsx": $$2,
    "./islands/LemonDrop.tsx": $$3,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
