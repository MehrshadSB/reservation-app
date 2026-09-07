/**
 * Inclusive-start occupancy window. Mode-specific inclusivity
 * (e.g. hotel check-out) is a later availability concern.
 */
export type TimeRange = {
  start: Date;
  end: Date;
};
