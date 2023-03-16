class ApiFeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  search() {
    const product = this.queryString.product
      ? {
          name: {
            $regex: this.queryString.product,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...product });
    return this;
  }

  filter() {
    const queryStringCopy = { ...this.queryString };
    // removing fields in query that is not for filter
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((el) => {
      delete queryStringCopy[el];
    });
    // removing fields in query that is not for filter

    // creating filter for price and rating
    let queryStr = JSON.stringify(queryStringCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultsPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);
    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
