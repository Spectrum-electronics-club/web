const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  logo1Url: { type: String, default: '' },
  logo2Url: { type: String, default: '' },
  
  // Contact Info
  contactEmail: { type: String, default: 'ngnd@club.edu' },
  contactLocation: { type: String, default: 'Engineering Department, Lab-7' },
  contactSocial: { type: String, default: '@ngnd_club' },
  
  // Social Links
  socialInstagram: { type: String, default: '' },
  socialLinkedin: { type: String, default: '' },
  socialYoutube: { type: String, default: '' },
  socialGithub: { type: String, default: '' },
  
  // About Page
  aboutDescription: { type: String, default: 'NGND is a student-led engineering and research club dedicated to turning curiosity into creation — bridging the gap between classroom theory and real-world innovation.' },
  aboutStory: { type: String, default: 'Founded in 2019, NGND started as a small group of engineering students passionate about making things. Today we are a thriving community of 200+ members across multiple technical domains, with projects deployed in the real world.' },
  aboutMission: { type: String, default: 'To foster a culture of innovation and collaboration where members can grow their technical skills, conduct meaningful research, and make impactful contributions to their field and society.' },
  aboutVision: { type: String, default: 'A club where every member becomes a builder, researcher, and leader. We envision NGND alumni driving technological change at the highest levels of industry and academia.' }
}, { timestamps: true })

module.exports = mongoose.model('Settings', schema)
