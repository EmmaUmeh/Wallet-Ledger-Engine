import { Request, Response } from "express";
import CreateWalletService from "../service/createWallet.service";
import { User } from "../models/user.model";
import  { HTTPStatus } from "../utils/http.utils";


const handleTransfer = async(req: Request, res: Response) => {
    const {userId, currency_id} = req.body;

    try {

    const user = await User.findOne({where: {id: userId}})

    if(!user) {
        res.status(HTTPStatus.NOT_FOUND).json("Resource not found.")
    }
    
     const wallet = await CreateWalletService(userId, currency_id)

     if(!wallet) {
        res.status(HTTPStatus.BAD_REQUEST).json("Transfer Request Failed. Please try again.")
     }

    }catch(err) {
        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).json("An error occurred while processing the transfer request.");
    }
}

export default handleTransfer;