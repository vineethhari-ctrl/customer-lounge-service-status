import { createMockSource } from "./mockSource";
import type { DataSource } from "./types";

// Single place to swap the data provider.
// TODO(DMS): add createDmsSource() that maps DMS records to the types in ./types,
// and return it here once the DMS API, credentials and field mapping are known.
export const dataSource: DataSource = createMockSource();
