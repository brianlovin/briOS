export type BodyLockState = {
  listDetailMounted: boolean;
  overlayOpen: boolean;
};

export function shouldLockBody({ listDetailMounted, overlayOpen }: BodyLockState): boolean {
  return listDetailMounted || overlayOpen;
}
