const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI environment variable bulunamadı (.env yüklenmedi olabilir).');
}

async function checkAllScores() {
    try {
        await mongoose.connect(uri.replace(/&appName=[^&]*/i, ''));
        console.log('✅ Connected\n');

        const db = mongoose.connection.db;
        const scores = db.collection('scores');

        // Find all scores with questionnaireKey __ALL_COMBINED__
        const allCombined = await scores.find({ questionnaireKey: '__ALL_COMBINED__' }).toArray();

        console.log(`Found ${allCombined.length} combined scores:\n`);

        for (const score of allCombined) {
            const projects = db.collection('projects');
            const project = await projects.findOne({ _id: score.projectId });

            console.log(`📁 ${project?.title || 'Unknown Project'}`);
            console.log(`   Project ID: ${score.projectId}`);
            console.log(`   totals.n: ${score.totals?.n || 'N/A'}`);
            console.log(`   totals.nAnswered: ${score.totals?.nAnswered || 'N/A'}`);
            console.log('');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkAllScores();
