const express = require('express');
const router = express.Router();
const Users = require('../models/User');

/**
 * @swagger
 * components:
 *  schemas:
 *      UserName:
 *          type: object
 *          required:
 *              - userName
 *          properties:
 *              userName:
 *                  type: string
 *                  description: the name of the user
 *      AmountTransfer:
 *          type: object
 *          required:
 *              -senderId
 *              -receiverId
 *              -amount
 *          properties:
 *              senderId:
 *                  type: string
 *                  description: user id of the user sending the amount
 *              receiverId:
 *                  type: string
 *                  description: user id of the user receiving the amount
 *              amount:
 *                  type: number
 *                  description: balance to be transferred
 *      User:
 *          type: object
 *          required:
 *              - userName
 *              - balance
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of the book
 *              userName:
 *                  type: string
 *                  description: The name of the user
 *              balance:
 *                  type: number
 *                  description: The balance of the user
 *              example:
 *                  id: 938732002ofv
 *                  userName: sam
 *                  balance: 200
 *         
 * 
 */

/**
 * @swagger
 * tags:
 *  name: Users API
 *  description: The UserName and balance managing API
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Returns the list of all the users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: The list of all the users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 */

router.get('/',async ( req,res)=>{
    try{
        const posts = await Users.find();
        res.json(posts);

    }
    catch(err){
        res.json({message: err})
    }
});


/**
 * @swagger
 * /users/newUser:
 *  post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/UserName'
 *      responses:
 *          200:
 *              description: The user was successfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *                                               
 */
router.post('/newUser',async (req,res)=>{

    const user = new Users({
        userName: req.body.userName,
        balance: 100
    });

    try{
    const savedUser = await user.save()
    res.json(savedUser);
    }
    catch(err){
        res.status(500).send({message: err});
    }
})


/**
 * @swagger
 * /users/transfer:
 *  post:
 *      summary: amount transfer from one user to other
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/AmountTransfer'
 *      responses:
 *          200:
 *              description: The amount was successfully transferred!
 *          400:
 *              description: bad or illegal request by the user
 *          500:
 *              description: internal error
 *           
 *      
 */
router.post('/transfer',async (req,res)=>{
    try{
        const senderBalance = await Users.findOne({_id:req.body.senderId});
        const receiverBalance = await Users.findOne({_id:req.body.receiverId});
        
        if (senderBalance==null || receiverBalance==null){
           const message = 'senderId or receiverId not found';
           res.status(400).send(message);
        }
        console.log(senderBalance);
        console.log(req.body.amount);
        if (senderBalance.balance<req.body.amount){
            const message = 'sender balance not sufficient';
            res.status(400).send(message);
        }
        
        const newSenderBalance = await Users.updateOne({_id:req.body.senderId},{$inc:{balance:-1*req.body.amount}},{new:true});
        const newReceiverBalance = await Users.updateOne({_id:req.body.receiverId},{$inc:{balance:req.body.amount}},{new:true});
        res.json('transferred successfully');
    }
    catch(err){
        if(err.name=='CastError'){
            res.status(400).send('senderId or receiverId not valid');
        }
        res.status(500).send({message:err});
    }
})

/**
 * @swagger
 * /users/{userId}:
 *  get:
 *      summary: Get the user details by id
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: The user id
 *      responses:
 *          200:
 *              description: The user description by id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              description: The user was not found
 */
router.get('/:userId', async (req,res) => {
    try{
        const user = await Users.findById(req.params.userId);
        res.json(user);
    }catch(err){
        res.status(404).send('User not found');
    }
})

module.exports = router;