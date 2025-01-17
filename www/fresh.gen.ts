// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_name_ from "./routes/[name].tsx";
import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $docs_slug_ from "./routes/docs/[...slug].tsx";
import * as $gfm_css from "./routes/gfm.css.ts";
import * as $index from "./routes/index.tsx";
import * as $sitemap_xml from "./routes/sitemap.xml.ts";
import * as $CopyArea from "./islands/CopyArea.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/[name].tsx": $_name_,
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/docs/[...slug].tsx": $docs_slug_,
    "./routes/gfm.css.ts": $gfm_css,
    "./routes/index.tsx": $index,
    "./routes/sitemap.xml.ts": $sitemap_xml,
  },
  islands: {
    "./islands/CopyArea.tsx": $CopyArea,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
