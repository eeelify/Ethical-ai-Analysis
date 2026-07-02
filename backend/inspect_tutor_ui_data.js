const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI environment variable bulunamadı (.env yüklenmedi olabilir).');
}

// Use minimal schema to avoid dependency issues
const ScoreSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    questionnaireKey: String,
    byPrinciple: mongoose.Schema.Types.Mixed,
    totals: mongoose.Schema.Types.Mixed,
    questionBreakdown: Array
}, { collection: 'scores', strict: false });

const ProjectSchema = new mongoose.Schema({
    title: String
}, { collection: 'projects', strict: false });

async function run() {
    try {
        await mongoose.connect(uri.replace(/&appName=[^&]*/i, ''));
        console.log('Connected to DB (Production/Atlas)');

        const Project = mongoose.model('Project', ProjectSchema);
        const Score = mongoose.model('Score', ScoreSchema);

        const project = await Project.findOne({ title: /Tutor AI/i });
        if (!project) {
            console.log('Project not found');
            process.exit(1);
        }
        console.log('Project:', project.title, 'ID:', project._id);

        const scores = await Score.find({ projectId: project._id });
        console.log('Total Scores found:', scores.length);

        const combined = scores.find(s => s.questionnaireKey === '__ALL_COMBINED__');
        if (combined) {
            const societal = combined.byPrinciple['SOCIETAL & INTERPERSONAL WELL-BEING'];
            if (societal) {
                console.log('--- SOCIETAL PRINCIPLE DATA ---');
                console.log('Questions count (n):', societal.n);
                console.log('Cumulative Risk:', societal.risk);
                console.log('Average ERC:', (societal.risk / societal.n).toFixed(4));
                console.log('Questions Detail:');
                console.log(JSON.stringify(societal.topDrivers, null, 2));
            } else {
                console.log('Societal principle not found in combined score');
            }
        } else {
            console.log('Combined score NOT found for this project.');
        }

        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

run();
