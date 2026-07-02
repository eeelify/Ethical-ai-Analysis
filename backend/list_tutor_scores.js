const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI environment variable bulunamadı (.env yüklenmedi olabilir).');
}

async function listAllScores() {
    try {
        await mongoose.connect(uri.replace(/&appName=[^&]*/i, ''));
        console.log('✅ Connected\n');

        const db = mongoose.connection.db;
        const scores = db.collection('scores');
        const projects = db.collection('projects');

        // Find Tutor AI
        const tutorProject = await projects.findOne({ title: /tutor/i });
        console.log(`📁 Project: ${tutorProject.title}\n`);

        // Find ALL scores for this project
        const allScores = await scores.find({ projectId: tutorProject._id }).toArray();

        console.log(`Found ${allScores.length} score documents:\n`);

        allScores.forEach((score, i) => {
            console.log(`${i + 1}. questionnaireKey: ${score.questionnaireKey}`);
            console.log(`   userId: ${score.userId || 'N/A'}`);
            console.log(`   role: ${score.role || 'N/A'}`);
            console.log(`   questionBreakdown: ${score.questionBreakdown?.length || 0} items`);
            console.log(`   totals.n: ${score.totals?.n || 'N/A'}`);
            console.log('');
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

listAllScores();
