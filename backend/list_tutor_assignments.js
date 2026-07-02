const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI environment variable bulunamadı (.env yüklenmedi olabilir).');
}

async function run() {
    try {
        await mongoose.connect(uri.replace(/&appName=[^&]*/i, ''));
        console.log('✅ Connected\n');

        const db = mongoose.connection.db;

        // Find Tutor AI project
        const projects = db.collection('projects');
        const tutorProject = await projects.findOne({ title: /tutor/i });

        if (!tutorProject) {
            console.log('❌ Project not found');
            process.exit(1);
        }

        console.log(`📁 Project: ${tutorProject.title}`);
        console.log(`   _id: ${tutorProject._id}\n`);

        // Find all assignments for this project
        const assignments = db.collection('projectassignments');
        const projectAssignments = await assignments.find({ projectId: tutorProject._id }).toArray();

        console.log(`Found ${projectAssignments.length} assignments:\n`);

        for (const assignment of projectAssignments) {
            const users = db.collection('users');
            const user = await users.findOne({ _id: assignment.userId });

            console.log(`👤 ${user?.name || 'Unknown'} (${user?.email || 'N/A'})`);
            console.log(`   Role: ${assignment.role}`);
            console.log(`   Progress: ${assignment.progress}%`);
            console.log(`   Questionnaires: ${assignment.questionnaires?.length || 0}`);

            if (assignment.questionnaires && assignment.questionnaires.length > 0) {
                for (const q of assignment.questionnaires) {
                    const totalQ = q.questions?.length || 0;
                    const answeredQ = q.questions?.filter(qu => qu.answered).length || 0;
                    console.log(`     ${q.questionnaireKey}: ${q.progress}% (${answeredQ}/${totalQ} answered)`);
                }
            }
            console.log('');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

run();
