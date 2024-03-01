const mainCtrl = {
    home: async (req, res) => {
        const locals = {
            title: "NodeJs Task App",
            description: "Free NodeJs Task App"
        }

        req.render('index', {locals, layout: "../views/layouts/front-page"})
    },

    about: async (req, res) => {
        const locals = {
            title: "About NodeJs Task App",
            description: "About NodeJs Task App"
        }
        res.render('about', {locals})
    },
    contact: async (req, res) => {
        const locals = {
            title: "About NodeJs Task App",
            description: "About NodeJs Task App"
        }
        res.render('emaile', {locals})
    }
}


module.exports = mainCtrl;