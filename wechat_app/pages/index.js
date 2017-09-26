Page({
    data: {
        list: [
            {
                id: 'beacon',
                name: 'Beacon',
                open: false
            },
            {
                id: 'lock',
                name: 'Lab Lock',
                open: false
            }
        ]
    },
    gotoPage: function (e) {
        var page = e.currentTarget.id
        wx.navigateTo({
            url: page+'/'+page,
        })
    }
});