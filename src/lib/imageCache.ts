// Shared image cache to prevent re-loading images across components
// Used by GoodWebsiteGalleryItem and PreviewCard
export const imageCache = new Set<string>();
