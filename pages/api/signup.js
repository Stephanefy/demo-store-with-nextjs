import connectDb from '../../utils/connectDb';
import User from '../../models/User';
import Cart from '../../models/Cart';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';

connectDb();

export default async (req, res) => {
    const {name, email, password } = req.body
    try{

        // 1 Validate name, email and password 
        if(!isLength(name, {min: 3, max: 10})) {
            return res.status(422).send(`Votre nom d'utilisateur doit être entre 3 et 10 caractères`);
        } else if (!isLength(password, {min: 6})){
            return res.status(422).send(`Votre mot de passe doit contenir au moins 6 caractères`);
        } else if (!isEmail(email)) {
            return res.status(422).send(`Votre e-mail doit être valide`)
        }
        //  2 Check if user alreadyu exists in the db

        const user = await User.findOne({email})
        if(user){
            return res.status(422).send(`Utilisateur avec l'email ${email} existe déjà`)
        }
        // 3 if not, hash their password
        const hash = await bcrypt.hash(password, 10)
        //  4 create user
        const newUser = await new User({
            name,
            email,
            password: hash
        }). save()
        console.log({newUser})
        // Create a cart for the new User
        await new Cart({ user: newUser._id }).save();
        // 5 create token for the new user
        const token = jwt.sign({ userId: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
        // 6 send back token
        res.status(201).json(token)
    } catch(error){
        console.error(error)
        res.status(500).send("Problème d'enregistrement, veuillez réessayer plus tard")
    }
}