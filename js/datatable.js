 function datafilter (obj, query, properties) {
    for (let prop of properties) {
        if (!!obj[prop]) {
            if (obj[prop].toLowerCase().includes(query.toLowerCase())) {
                return true;
            }
        }
    }
    return false;
}

function dataTableValues() {
    return { limit: '10', page: 0, maxpage: 0, from: 1, to: 10, q: '' };
}

function dataTable ({ listado, page, maxpage, from, to, limit, q }, way, ...properties) {
    if (way == 0) {
        listado = listado.map(function (item) {
            item['filtered'] = datafilter(item, q, properties);
            return item;
        });
        let size = listado.reduce((total,x) => ( x.filtered ? total + 1 : total), 0);
        maxpage = (size % limit == 0 ? size / limit : Math.ceil(size / limit));
        to = parseInt(from) + parseInt(limit) - 1;
        to = to > size ? size : to;
    } else {
        if (page + way < 0 || page + way >= maxpage) {
            return { page: page, maxpage: maxpage, from: from, to: to, limit: limit, listado: listado };
        } else {
            page += way;
            from = page == 0 ? 1 : ((page * limit) + 1);
            to = from + parseInt(limit) - 1;
        }
    }
    
    let j = 1;
    for (let i = 0; i < listado.length; i++) {
        listado[i].show = false;
        if (listado[i].filtered) {
            if (j < from || j > to) {
                listado[i].show = false;
            } else {
                listado[i].show = true;
            }
            j++;
        }
    }

    let sizeTotal = listado.reduce((total,x) => ( x.filtered ? total + 1 : total), 0);
    console.log(from);
    console.log(to);
    to = (sizeTotal <= to) ? sizeTotal : limit * (page + 1);
    from = to == 0 ? 0 :
     from <= to ? (from == 0 ? 1 : from) : 
     to < limit ? 1 : ((to / limit) * limit) + 1;

    return { page: page, maxpage: maxpage, from: from, to: to, listado: listado, size: sizeTotal };
}