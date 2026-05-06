const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI environment variable bulunamadı (.env yüklenmedi olabilir).');
}

async function fixW8Question() {
    try {
        await mongoose.connect(uri.replace(/&appName=[^&]*/i, ''));
        console.log('✅ Connected\n');

        const db = mongoose.connection.db;
        const questions = db.collection('questions');

        // Find W8
        const w8 = await questions.findOne({ code: 'W8' });

        if (!w8) {
            console.log('❌ W8 not found');
            process.exit(1);
        }

        console.log('📋 W8 BEFORE UPDATE:');
        console.log(`   questionnaireKey: ${w8.questionnaireKey}`);
        console.log(`   principle: ${w8.principle || 'MISSING'}`);
        console.log('');

        // Update W8
        const result = await questions.updateOne(
            { code: 'W8' },
            {
                $set: {
                    questionnaireKey: 'ethical-expert-v1',
                    principle: 'SOCIETAL & INTERPERSONAL WELL-BEING'
                }
            }
        );

        console.log(`✅ Updated: ${result.modifiedCount} document(s)`);

        // Verify
        const updated = await questions.findOne({ code: 'W8' });
        console.log('\n📋 W8 AFTER UPDATE:');
        console.log(`   questionnaireKey: ${updated.questionnaireKey}`);
        console.log(`   principle: ${updated.principle}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixW8Question();
