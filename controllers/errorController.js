exports.get404 = (req, res, next) =>{
    res.status(404).render('error', {
        title: 'Une erreur est servenue',
        path: '/errors',
        statusCode: '404'
    });
};