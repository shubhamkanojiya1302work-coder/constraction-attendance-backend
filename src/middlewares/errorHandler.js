export const notFound= (req,res)=>{
    req.originalUrl;
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` })

}

export const errorHandler = (err, req, res, next) =>{
    console.log(err);
    req.originalUrl;
    res.status(500);
    res.json(err.message);

}
