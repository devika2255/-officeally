"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const url_join_1 = __importDefault(require("url-join"));
const Webflow = __importStar(require("../api"));
const Client_1 = require("../api/resources/collections/resources/items/client/Client");
const core = __importStar(require("../core"));
const environments = __importStar(require("../environments"));
const errors = __importStar(require("../errors"));
const serializers = __importStar(require("../serialization"));
// Client adapts the base client to permit extra properties in
// the client.Collections.Items.createItem, createItemLive, and createItemForMultipleLocales request.
class Client extends Client_1.Items {
    constructor(_options) {
        super(_options);
        this._options = _options;
    }
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
    createItem(collectionId, request, requestOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)((_a = (yield core.Supplier.get(this._options.environment))) !== null && _a !== void 0 ? _a : environments.WebflowEnvironment.Default, `collections/${encodeURIComponent(collectionId)}/items`),
                method: "POST",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-Fern-Language": "JavaScript",
                    "X-Fern-SDK-Name": "webflow-api",
                    "X-Fern-SDK-Version": "2.4.2",
                    "User-Agent": "webflow-api/2.4.2",
                    "X-Fern-Runtime": core.RUNTIME.type,
                    "X-Fern-Runtime-Version": core.RUNTIME.version,
                },
                contentType: "application/json",
                requestType: "json",
                body: serializers.CollectionItem.jsonOrThrow(request, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    skipValidation: true,
                }),
                timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
                maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
                abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal,
            });
            if (_response.ok) {
                return serializers.CollectionItem.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    skipValidation: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new Webflow.BadRequestError(_response.error.body);
                    case 401:
                        throw new Webflow.UnauthorizedError(_response.error.body);
                    case 404:
                        throw new Webflow.NotFoundError(_response.error.body);
                    case 429:
                        throw new Webflow.TooManyRequestsError(serializers.TooManyRequestsErrorBody.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            skipValidation: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 500:
                        throw new Webflow.InternalServerError(_response.error.body);
                    default:
                        throw new errors.WebflowError({
                            statusCode: _response.error.statusCode,
                            body: _response.error.body,
                        });
                }
            }
            switch (_response.error.reason) {
                case "non-json":
                    throw new errors.WebflowError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.rawBody,
                    });
                case "timeout":
                    throw new errors.WebflowTimeoutError();
                case "unknown":
                    throw new errors.WebflowError({
                        message: _response.error.errorMessage,
                    });
            }
        });
    }
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
    createItemLive(collectionId, request, requestOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)((_a = (yield core.Supplier.get(this._options.environment))) !== null && _a !== void 0 ? _a : environments.WebflowEnvironment.Default, `collections/${encodeURIComponent(collectionId)}/items/live`),
                method: "POST",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-Fern-Language": "JavaScript",
                    "X-Fern-SDK-Name": "webflow-api",
                    "X-Fern-SDK-Version": "2.4.2",
                    "User-Agent": "webflow-api/2.4.2",
                    "X-Fern-Runtime": core.RUNTIME.type,
                    "X-Fern-Runtime-Version": core.RUNTIME.version,
                },
                contentType: "application/json",
                requestType: "json",
                body: serializers.CollectionItem.jsonOrThrow(request, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    skipValidation: true,
                }),
                timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
                maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
                abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal,
            });
            if (_response.ok) {
                return serializers.CollectionItem.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    skipValidation: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new Webflow.BadRequestError(_response.error.body);
                    case 401:
                        throw new Webflow.UnauthorizedError(_response.error.body);
                    case 404:
                        throw new Webflow.NotFoundError(_response.error.body);
                    case 429:
                        throw new Webflow.TooManyRequestsError(serializers.TooManyRequestsErrorBody.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            skipValidation: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 500:
                        throw new Webflow.InternalServerError(_response.error.body);
                    default:
                        throw new errors.WebflowError({
                            statusCode: _response.error.statusCode,
                            body: _response.error.body,
                        });
                }
            }
            switch (_response.error.reason) {
                case "non-json":
                    throw new errors.WebflowError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.rawBody,
                    });
                case "timeout":
                    throw new errors.WebflowTimeoutError();
                case "unknown":
                    throw new errors.WebflowError({
                        message: _response.error.errorMessage,
                    });
            }
        });
    }
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
    createItemForMultipleLocales(collectionId, request, requestOptions) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const _response = yield core.fetcher({
                url: (0, url_join_1.default)((_a = (yield core.Supplier.get(this._options.environment))) !== null && _a !== void 0 ? _a : environments.WebflowEnvironment.Default, `collections/${encodeURIComponent(collectionId)}/items/bulk`),
                method: "POST",
                headers: {
                    Authorization: yield this._getAuthorizationHeader(),
                    "X-Fern-Language": "JavaScript",
                    "X-Fern-SDK-Name": "webflow-api",
                    "X-Fern-SDK-Version": "2.4.2",
                    "User-Agent": "webflow-api/2.4.2",
                    "X-Fern-Runtime": core.RUNTIME.type,
                    "X-Fern-Runtime-Version": core.RUNTIME.version,
                },
                contentType: "application/json",
                requestType: "json",
                body: serializers.CollectionItem.jsonOrThrow(request, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    skipValidation: true,
                }),
                timeoutMs: (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeoutInSeconds) != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
                maxRetries: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.maxRetries,
                abortSignal: requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.abortSignal,
            });
            if (_response.ok) {
                return serializers.BulkCollectionItem.parseOrThrow(_response.body, {
                    unrecognizedObjectKeys: "passthrough",
                    allowUnrecognizedUnionMembers: true,
                    allowUnrecognizedEnumValues: true,
                    skipValidation: true,
                    breadcrumbsPrefix: ["response"],
                });
            }
            if (_response.error.reason === "status-code") {
                switch (_response.error.statusCode) {
                    case 400:
                        throw new Webflow.BadRequestError(_response.error.body);
                    case 401:
                        throw new Webflow.UnauthorizedError(_response.error.body);
                    case 404:
                        throw new Webflow.NotFoundError(_response.error.body);
                    case 429:
                        throw new Webflow.TooManyRequestsError(serializers.TooManyRequestsErrorBody.parseOrThrow(_response.error.body, {
                            unrecognizedObjectKeys: "passthrough",
                            allowUnrecognizedUnionMembers: true,
                            allowUnrecognizedEnumValues: true,
                            skipValidation: true,
                            breadcrumbsPrefix: ["response"],
                        }));
                    case 500:
                        throw new Webflow.InternalServerError(_response.error.body);
                    default:
                        throw new errors.WebflowError({
                            statusCode: _response.error.statusCode,
                            body: _response.error.body,
                        });
                }
            }
            switch (_response.error.reason) {
                case "non-json":
                    throw new errors.WebflowError({
                        statusCode: _response.error.statusCode,
                        body: _response.error.rawBody,
                    });
                case "timeout":
                    throw new errors.WebflowTimeoutError();
                case "unknown":
                    throw new errors.WebflowError({
                        message: _response.error.errorMessage,
                    });
            }
        });
    }
}
exports.Client = Client;
