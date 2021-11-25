exports.testproduct = async (req, res) => {
    try {
        // const db = await something() 
        res.status(200).json({
            success: true,
            greeting: 'Hello from Dummy route product'
        })
    } catch (error) {
        console.log(error)
    }

}