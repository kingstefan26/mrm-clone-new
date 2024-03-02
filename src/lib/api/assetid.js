export const assetidToUrl = (id, overrides = '') => {
	return `/api/asset/proxy/${id}${overrides}`;
};
