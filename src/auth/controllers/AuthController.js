class AuthController {
    signUp = async function(req, res, next) {
        const { email, password } = req.body;
        const user = new User({
            email,
            password
        });
        try {
            const result = await user.save();
            res.status(200).json({
                message: 'User created successfully',
                result
            });
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
}

module.exports = new AuthController();