export const notFound= (req,res)=>{
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` })

}

export const errorHandler = (err, req, res, next) =>{
    console.log(err);
    const status = err.status || 500;
    // Hide internal details (e.g. database errors) from the client
    const message = status >= 500 ? "Internal server error" : err.message;
    res.status(status).json({ message });

}
