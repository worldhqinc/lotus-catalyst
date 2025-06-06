import { buildConfig } from '~/build-config/reader';

const storeHash = process.env.BIGCOMMERCE_STORE_HASH ?? '';

/**
 * Build the CDN image URL.
 * A query parameter containing the commit SHA is appended to the URL to ensure
 * that the asset is invalidated when the storefront app is deployed.
 *
 * @param {string} sizeSegment - The size segment of the URL. Can be of the form `{:size}` (to make it a urlTemplate) or `original` or `123w` or `123x123`.
 * @param {string} source - The source of the image. Can be either `content` or `image-manager`.
 * @param {string} path - The path of the image relative to the source.
 * @param {number} cdnIndex - The index of the CDN URL to use. Defaults to 0.
 * @returns {string} The CDN image URL.
 */
const cdnImageUrlBuilder = (
  sizeSegment: string,
  source: string,
  path: string,
  cdnIndex = 0,
): string => {
  return `https://${buildConfig.get('urls').cdnUrls.at(cdnIndex)}/s-${storeHash}/images/stencil/${sizeSegment}/${source}/${path}`;
};

/**
 * Given a path, return the full URL to the content asset.
 * These assets are accessible via the /content folder in WebDAV on the store.
 * A query parameter containing the commit SHA is appended to the URL to ensure
 * that the asset is invalidated when the storefront app is deployed.
 *
 * @param {string} path - The path of the content asset.
 * @param {number} cdnIndex - The index of the CDN URL to use. Defaults to 0.
 * @returns {string} The full URL to the content asset.
 */
export const contentAssetUrl = (path: string, cdnIndex = 0): string => {
  return `https://${buildConfig.get('urls').cdnUrls.at(cdnIndex)}/s-${storeHash}/content/${path}`;
};

/**
 * Build a URL or resizable URL template for an image in the /content folder in WebDAV.
 *
 * @param {string} path - The path of the image relative to the /content folder.
 * @param {string} sizeParam - The optional size parameter. Can be of the form `{:size}` (to make it a urlTemplate) or `original` or `123w` or `123x123`. If omitted, will return the templated string containing `{:size}`.
 * @returns {string} The resizeable URL template for the image, which can be used with `<Image>`.
 */
export const contentImageUrl = (path: string, sizeParam?: string): string => {
  // return a urlTemplate that can be used with the <Image> component
  return cdnImageUrlBuilder(sizeParam || '{:size}', 'content', path);
};

/**
 * Build a URL or resizable URL template for an image in the Image Manager.
 *
 * @param {string} filename - The filename of the image managed by the image manager.
 * @param {string} sizeParam - The optional size parameter. Can be of the form `{:size}` (to make it a urlTemplate) or `original` or `123w` or `123x123`. If omitted, will return the templated string containing `{:size}`.
 * @returns {string} The resizeable URL template for the image, which can be used with `<Image>`.
 */
export const imageManagerImageUrl = (filename: string, sizeParam?: string): string => {
  // return a urlTemplate that can be used with the <Image> component
  return cdnImageUrlBuilder(sizeParam || '{:size}', 'image-manager', filename);
};
