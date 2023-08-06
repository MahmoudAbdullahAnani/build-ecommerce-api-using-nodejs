class apiFeatusers {
  constructor(mongoeQuery, requsteQuery) {
    this.mongoeQuery = mongoeQuery;
    this.requsteQuery = requsteQuery;
  }
  filter() {
    const requstQuerys = { ...this.requsteQuery };
    const removeQuerys = ["limit", "page", "sort", "fields"];
    removeQuerys.forEach((item) => {
      delete requstQuerys[item];
    });
    // (ratingsAverage[gte,gt,lte,lt])
    // { price: { gts: '1099' }, ratingsAverage: { gte: '4.3' } }
    let requstQueryString = JSON.stringify(requstQuerys);
    let requstQuery = requstQueryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    requstQueryString = JSON.parse(requstQuery);
    return this;
  }
  sort() {
    let sort = this.requsteQuery?.sort || "-createdAt";
    const handelMoreFieldsSort = sort.split(",").join(" ");
    this.mongoeQuery.sort(handelMoreFieldsSort);
    return this;
  }
  limitField() {
    let fields = this.requsteQuery?.fields || "";
    const handelMoreFieldsFields = fields.split(",").join(" ");
    this.mongoeQuery.select(handelMoreFieldsFields);
    return this;
  }
  pagenation() {
    const page = this.requsteQuery?.page || 1;
    const limit = this.requsteQuery?.limit || 5;
    const skip = (page - 1) * limit;
    this.mongoeQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = apiFeatusers;
