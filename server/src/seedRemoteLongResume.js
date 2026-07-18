const baseUrl = 'https://spectrum-4qtx.onrender.com/api/v1';
const email = 'Spectrum@ddu.ac.in';
const password = 'admin@searc';

const longText = `The NGND Engineering and Research Club represents a pinnacle of student-led innovation, fostering an environment where theoretical concepts meet real-world applications. Our members dive deep into advanced technologies such as artificial intelligence, robotics, full-stack web development, and embedded systems. This initiative specifically aims to bridge the gap between academic learning and industry requirements by encouraging cross-disciplinary collaboration. We believe that by providing hands-on experience with cutting-edge tools and methodologies, we can equip the next generation of engineers with the skills necessary to tackle global challenges. Furthermore, our continuous commitment to open-source contributions and community-driven projects ensures that our work has a lasting impact beyond the university campus. Whether it's developing autonomous drones or designing scalable cloud architectures, our teams are constantly pushing the boundaries of what is possible at the undergraduate level.`;

const delay = ms => new Promise(r => setTimeout(r, ms));

const seedRemoteLong = async () => {
  try {
    console.log('Logging in...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginData.message}`);
    }

    const token = loginData.accessToken;
    console.log('✅ Logged in successfully!');

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Resuming from batch 17 where it failed
    for (let i = 17; i <= 40; i++) {
      console.log(`Seeding batch ${i} of 40...`);

      // 1. Gallery
      const galleryRes = await fetch(`${baseUrl}/admin/gallery`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          imageUrl: `https://picsum.photos/seed/longgallery${i}/800/600`,
          album: `Advanced Research and Development Showcase Album Number ${i}`,
          tags: [`technology-innovation-${i}`, 'engineering-showcase', 'student-led-research'],
          caption: `A comprehensive visual documentation of our latest prototype testing phase. ${longText.substring(0, 200)}`
        })
      });
      const galleryData = await galleryRes.json();
      const galleryId = galleryData.data?._id;

      // 2. Events
      await fetch(`${baseUrl}/admin/events`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title: `Annual Summit on Artificial Intelligence and Next-Generation Computing Infrastructures - Session ${i}`,
          description: `Detailed Event Description: ${longText}`,
          galleryRef: galleryId ? [galleryId] : [],
          isUpcoming: i % 2 === 0
        })
      });

      // 3. Projects
      await fetch(`${baseUrl}/admin/projects`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title: `Autonomous Aerial Vehicle Navigation System using Computer Vision - Iteration ${i}`,
          description: `Project Overview: ${longText}\n\nTechnical Details: ${longText}`,
          status: i % 3 === 0 ? 'completed' : 'ongoing'
        })
      });

      // 4. Announcements
      await fetch(`${baseUrl}/admin/announcements`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title: `Important Update Regarding the Upcoming National Hackathon and Engineering Symposium ${i}`,
          body: `Please review the following critical information: ${longText}`
        })
      });

      // 5. Publications
      await fetch(`${baseUrl}/admin/publications`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title: `A Novel Approach to Machine Learning Optimization in Resource-Constrained Environments - Study ${i}`,
          authors: [`Dr. Jonathan Researcher ${i}`, `Prof. Sarah Scientist ${i}`, `Student Engineer ${i}`]
        })
      });

      // 6. Team
      await fetch(`${baseUrl}/admin/team`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          fullName: `Dr. Alexander Bartholomew Montgomery III - Researcher ${i}`,
          role: `Lead Research Scientist & Systems Architecture Director for Division ${i}`
        })
      });

      // 7. Contact
      await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `Professor Henrietta Wellington-Smythe ${i}`,
          email: `henrietta.wellington.smythe.very.long.email.${i}@international-university-domain.edu`,
          subject: `Inquiry Regarding Potential Multi-Year Collaborative Research Opportunities with NGND Labs ${i}`,
          message: `Dear NGND Team,\n\n${longText}\n\nSincerely,\nProfessor Henrietta ${i}`
        })
      });

      // 8. Recruitment
      await fetch(`${baseUrl}/recruitment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: `Maximilian Alexander Sterling - Candidate ${i}`,
          email: `max.sterling.candidate.application.number${Date.now()}_${i}@student-engineering-portal.com`,
          phone: `+1-555-0198-472-${i}`,
          department: `Department of Advanced Robotics and Artificial Intelligence Engineering`,
          year: `Sophomore (Year 2)`,
          motivation: `Statement of Purpose: ${longText}\n\nAdditional Motivations: ${longText}`
        })
      });

      // Delay to avoid overwhelming the server
      await delay(800);
    }

    console.log('✅ Remote long-text seeding completed successfully!');
  } catch (err) {
    console.error('❌ Error during remote seeding:', err.message);
  }
};

seedRemoteLong();
