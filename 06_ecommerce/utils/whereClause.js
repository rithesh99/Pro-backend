// base - Product.find()
// base - Product.find(email: {"hitesh@lco.dev"})

//bigQ - //search=coder&page=2&category=shortsleeves&rating[gte]=4
// &price[lte]=999&price[gte]=199&limit=5

class WhereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }

    search() {
        const searchword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: 'i'
            }
        } : ""
        this.base = this.base.find({ ...searchword })
        return this;
    }

    pager(resultperPage) {
        let currentPage = this.bigQ.page ? this.bigQ.page : 1;
        let skipVal = resultperPage * (currentPage - 1);
        this.base = this.base.limit(resultperPage).skip(skipVal)
        return this;
    }

    filter() {
        const copyQ = { ...this.bigQ };
        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];

        //convert bigQ to string
        let stringOfCopyQ = JSON.stringify(copyQ);

        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$$m`)
        const jsonOfCopyQ = JSON.parse(stringOfCopyQ)

        this.base = this.base.find(jsonOfCopyQ)
        return this;
    }
}

module.exports = WhereClause;