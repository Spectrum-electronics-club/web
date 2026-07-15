const express = require('express')
const Settings = require('../models/Settings')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({})
    }
    res.json({ data: settings })
  } catch (err) {
    next(err)
  }
})

router.put('/', authMiddleware, async (req, res, next) => {
  try {
    let settings = await Settings.findOne()
    if (!settings) {
      settings = await Settings.create({})
    }
    if (req.body.logo1Url !== undefined) settings.logo1Url = req.body.logo1Url
    if (req.body.logo2Url !== undefined) settings.logo2Url = req.body.logo2Url
    
    // Contact Info
    if (req.body.contactEmail !== undefined) settings.contactEmail = req.body.contactEmail
    if (req.body.contactLocation !== undefined) settings.contactLocation = req.body.contactLocation
    if (req.body.contactSocial !== undefined) settings.contactSocial = req.body.contactSocial
    
    // Social Links
    if (req.body.socialInstagram !== undefined) settings.socialInstagram = req.body.socialInstagram
    if (req.body.socialLinkedin !== undefined) settings.socialLinkedin = req.body.socialLinkedin
    if (req.body.socialYoutube !== undefined) settings.socialYoutube = req.body.socialYoutube
    if (req.body.socialGithub !== undefined) settings.socialGithub = req.body.socialGithub
    
    // About Page
    if (req.body.aboutDescription !== undefined) settings.aboutDescription = req.body.aboutDescription
    if (req.body.aboutStory !== undefined) settings.aboutStory = req.body.aboutStory
    if (req.body.aboutMission !== undefined) settings.aboutMission = req.body.aboutMission
    if (req.body.aboutVision !== undefined) settings.aboutVision = req.body.aboutVision

    await settings.save()
    res.json({ data: settings })
  } catch (err) {
    next(err)
  }
})

module.exports = router
