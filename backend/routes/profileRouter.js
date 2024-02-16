import { Router } from 'express'
import authverifytoken from '../middlewares/authveriftoken.js'
import { profileController } from '../controllers/profileController.js'
export const profileRouter = Router()

profileRouter.get('/search', authverifytoken, profileController.unsearch)
profileRouter.get('/liked/:username', authverifytoken, profileController.likedtweets)
profileRouter.get('/mynotifs', authverifytoken, profileController.mynotifs)
profileRouter.get('/:username', authverifytoken, profileController.viewprofile)

profileRouter.put('/readnotif/:notifId', authverifytoken, profileController.readnotif)
profileRouter.put('/follow/:username', authverifytoken, profileController.follow)
profileRouter.put('/editprofile', authverifytoken, profileController.editprofile)
