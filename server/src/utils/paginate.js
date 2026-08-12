/**
 * Paginate mongoose query
 * @param {import('mongoose').Model} model
 * @param {object} queryFilter
 * @param {object} sort
 * @param {number|string} [page]
 * @param {number|string} [limit]
 */
async function paginateQuery(model, queryFilter = {}, sort = {}, page, limit) {
  const pageNum = page ? Math.max(1, parseInt(page) || 1) : 1;
  // If limit is not specified, default to 1000 to remain backward compatible (fetch all)
  const limitNum = limit ? Math.max(1, parseInt(limit) || 10) : 1000;
  const skip = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    model.find(queryFilter).sort(sort).skip(skip).limit(limitNum).lean(),
    model.countDocuments(queryFilter)
  ]);

  return {
    data,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }
  };
}

module.exports = { paginateQuery };
