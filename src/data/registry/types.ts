/**
 * Registry domain types belong here. Feature and presentation layers must
 * consume these domain models instead of defining competing sources of truth.
 * Population is intentionally deferred to the data-layer issue.
 */

export type RegistryId = string;

export interface ProjectRecord {
  id: RegistryId;
  name: string;
  category: string;
  status: string;
}
