const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI environment variable bulunamadı (.env yüklenmedi olabilir).');
}

const ProjectAssignmentSchema = new mongoose.Schema({}, { collection: 'projectassignments', strict: false });
const UserSchema = new mongoose.Schema({}, { collection: 'users', strict: false });
const ProjectSchema = new mongoose.Schema({}, { collection: 'projects', strict: false });

async function run() {
    try {
        await mongoose.connect(uri.replace(/&appName=[^&]*/i, ''));
        console.log('✅ Connected to DB\n');

        const ProjectAssignment = mongoose.model('ProjectAssignment', ProjectAssignmentSchema);
        const User = mongoose.model('User', UserSchema);
        const Project = mongoose.model('Project', ProjectSchema);

        // Find Tutor AI project
        const project = await Project.findOne({ title: /Tutor AI/i }).lean();
        console.log(`📁 Project: ${project.title}`);
        console.log(`   ID: ${project._id}\n`);

        // Find Gizem
        const gizem = await User.findOne({ name: /gizem/i }).lean();
        console.log(`👤 User: ${gizem.name} (${gizem.email})`);
        console.log(`   ID: ${gizem._id}\n`);

        // Find assignment
        const assignment = await ProjectAssignment.findOne({
            projectId: project._id,
            userId: gizem._id
        }).lean();

        if (!assignment) {
            console.log('❌ Assignment bulunamadı');
            process.exit(1);
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 QUESTIONNAIRE DETAYI');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        for (const q of assignment.questionnaires) {
            console.log(`\n📋 ${q.questionnaireKey}`);
            console.log(`   Progress: ${q.progress}%`);
            console.log(`   Toplam Soru: ${q.questions?.length || 0}`);

            if (q.questions && q.questions.length > 0) {
                const answered = q.questions.filter(qu => qu.answered).length;
                const hasResponseData = q.questions.filter(qu => qu.response && Object.keys(qu.response).length > 0).length;

                console.log(`   answered=true olan: ${answered}/${q.questions.length}`);
                console.log(`   response verisi olan: ${hasResponseData}/${q.questions.length}`);

                // Cevaplanmış ama response olmayan
                const answeredButNoResponse = q.questions.filter(qu => qu.answered === true && (!qu.response || Object.keys(qu.response).length === 0));
                if (answeredButNoResponse.length > 0) {
                    console.log(`\n   ⚠️  answered=true AMA response YOK (${answeredButNoResponse.length}):`);
                    answeredButNoResponse.forEach(qu => {
                        console.log(`      ❌ ${qu.code}: answered=${qu.answered}, response=${JSON.stringify(qu.response || {})}`);
                    });
                }

                // answered=false olanlar
                const notAnswered = q.questions.filter(qu => !qu.answered);
                if (notAnswered.length > 0) {
                    console.log(`\n   ℹ️  answered=false olan sorular (${notAnswered.length}):`);
                    notAnswered.forEach(qu => {
                        console.log(`      - ${qu.code}`);
                    });
                }

                // Response var ama answerScore yok
                const noScore = q.questions.filter(qu => qu.response && Object.keys(qu.response).length > 0 && (qu.response.answerScore === undefined || qu.response.answerScore === null));
                if (noScore.length > 0) {
                    console.log(`\n   🔍 response VAR ama answerScore YOK (${noScore.length}):`);
                    noScore.forEach(qu => {
                        console.log(`      - ${qu.code}: ${JSON.stringify(qu.response)}`);
                    });
                }
            }
        }

        console.log('\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Hata:', error);
        process.exit(1);
    }
}

run();
