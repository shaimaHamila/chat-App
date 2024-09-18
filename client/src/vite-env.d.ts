// <reference types="vite/client" />
import type { ViteClient } from "vite/client"; // eslint-disable-line @typescript-eslint/no-unused-vars
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
