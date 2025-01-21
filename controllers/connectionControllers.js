const sendConnectionRequest = async (req, res) => { 
    try {
        const profile=req.user
        // console.log(profile)
        res.send( profile?.firstName+" "+"connection request sent successfully")
    } 
    catch (error) {
    res.status(500).json({message:'Error while fetching data',error:error.message})
}
}
module.exports = sendConnectionRequest;