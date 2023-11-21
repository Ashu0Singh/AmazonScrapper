const getProductName = async (elements) => {
    for (const element of elements) {
        console.log(element.children?.[0].data);
    }
}

module.export = {
    getProductName
}