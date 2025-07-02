import * as Webflow from "../api";
import { Items } from "../api/resources/collections/resources/items/client/Client";
export declare class Client extends Items {
    protected readonly _options: Items.Options;
    constructor(_options: Items.Options);
    /**
     * Create Item in a Collection.</br></br> To create items across multiple locales, <a href="https://developers.webflow.com/data/reference/create-item-for-multiple-locales"> please use this endpoint.</a> </br></br> Required scope | `CMS:write`
     * @throws {@link Webflow.BadRequestError}
     * @throws {@link Webflow.UnauthorizedError}
     * @throws {@link Webflow.NotFoundError}
     * @throws {@link Webflow.TooManyRequestsError}
     * @throws {@link Webflow.InternalServerError}
     *
     * @example
     *     await webflow.collections.items.createItem("collection_id", {
     *         id: "42b720ef280c7a7a3be8cabe",
     *         cmsLocaleId: "653ad57de882f528b32e810e",
     *         lastPublished: "2022-11-29T16:22:43.159Z",
     *         lastUpdated: "2022-11-17T17:19:43.282Z",
     *         createdOn: "2022-11-17T17:11:57.148Z",
     *         isArchived: false,
     *         isDraft: false,
     *         fieldData: {
     *             name: "Pan Galactic Gargle Blaster Recipe",
     *             slug: "pan-galactic-gargle-blaster"
     *         }
     *     })
     */
    createItem(collectionId: string, request: Webflow.CollectionItem, requestOptions?: Items.RequestOptions): Promise<Webflow.CollectionItem>;
    /**
     * Create live Item in a Collection. This Item will be published to the live site. </br></br> To create items across multiple locales, <a href="https://developers.webflow.com/data/reference/create-item-for-multiple-locales"> please use this endpoint.</a> </br></br> Required scope | `CMS:write`
     *
     * @param {string} collectionId - Unique identifier for a Collection
     * @param {Webflow.CollectionItem} request
     * @param {Items.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Webflow.BadRequestError}
     * @throws {@link Webflow.UnauthorizedError}
     * @throws {@link Webflow.NotFoundError}
     * @throws {@link Webflow.TooManyRequestsError}
     * @throws {@link Webflow.InternalServerError}
     *
     * @example
     *     await client.collections.items.createItemLive("580e63fc8c9a982ac9b8b745", {
     *         id: "42b720ef280c7a7a3be8cabe",
     *         cmsLocaleId: "653ad57de882f528b32e810e",
     *         lastPublished: "2022-11-29T16:22:43.159Z",
     *         lastUpdated: "2022-11-17T17:19:43.282Z",
     *         createdOn: "2022-11-17T17:11:57.148Z",
     *         isArchived: false,
     *         isDraft: false,
     *         fieldData: {
     *             name: "Pan Galactic Gargle Blaster Recipe",
     *             slug: "pan-galactic-gargle-blaster"
     *         }
     *     })
     */
    createItemLive(collectionId: string, request: Webflow.CollectionItem, requestOptions?: Items.RequestOptions): Promise<Webflow.CollectionItem>;
    /**
     * Create single Item in a Collection with multiple corresponding locales. </br></br> Required scope | `CMS:write`
     *
     * @param {string} collectionId - Unique identifier for a Collection
     * @param {Webflow.BulkCollectionItem} request
     * @param {Items.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link Webflow.BadRequestError}
     * @throws {@link Webflow.UnauthorizedError}
     * @throws {@link Webflow.NotFoundError}
     * @throws {@link Webflow.TooManyRequestsError}
     * @throws {@link Webflow.InternalServerError}
     *
     * @example
     *     await client.collections.items.createItemForMultipleLocales("580e63fc8c9a982ac9b8b745", {
     *         id: "580e64008c9a982ac9b8b754"
     *     })
     */
    createItemForMultipleLocales(collectionId: string, request: Webflow.BulkCollectionItem, requestOptions?: Items.RequestOptions): Promise<Webflow.BulkCollectionItem>;
}
