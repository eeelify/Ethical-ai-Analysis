const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error('MONGO_URI environment variable bulunamadı (.env yüklenmedi olabilir).');
}

async function fixDuplicateW8() {
    try {
        await mongoose.connect(uri.replace(/&appName=[^&]*/i, ''));
        console.log('✅ Connected\n');

        const db = mongoose.connection.db;
        const questions = db.collection('questions');

        // Find all W8 questions
        const allW8 = await questions.find({ code: 'W8' }).toArray();
        console.log(`Found ${allW8.length} W8 questions:\n`);

        allW8.forEach((q, i) => {
            console.log(`${i + 1}. _id: ${q._id}`);
            console.log(`   questionnaireKey: ${q.questionnaireKey}`);
            console.log(`   principle: ${q.principle || 'MISSING'}`);
            console.log('');
        });

        // Delete the one with wrong questionnaireKey
        const deleteResult = await questions.deleteOne({
            code: 'W8',
            questionnaireKey: 'ethical-v1'
        });

        console.log(`🗑️  Deleted ${deleteResult.deletedCount} document(s) with questionnaireKey='ethical-v1'\n`);

        // Update the correct one to add principle field
        const updateResult = await questions.updateOne(
            {
                code: 'W8',
                questionnaireKey: 'ethical-expert-v1'
            },
            {
                $set: {
                    principle: 'SOCIETAL & INTERPERSONAL WELL-BEING'
                }
            }
        );

        console.log(`✅ Updated ${updateResult.modifiedCount} document(s) to add principle field\n`);

        // Verify
        const final = await questions.findOne({ code: 'W8' });
        console.log('📋 FINAL W8:');
        console.log(`   questionnaireKey: ${final.questionnaireKey}`);
        console.log(`   principle: ${final.principle}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixDuplicateW8();
